'use strict'

const pkgcloud = require('pkgcloud')
const promisify = require('es6-promisify')
const getenv = require('getenv')
const { Readable, Writable } = require('stream')

class Swift {
  constructor (container) {
    this._client = pkgcloud.storage.createClient({
      provider: getenv('SWIFT_PROVIDER'),
      username: getenv('SWIFT_USERNAME'),
      password: getenv('SWIFT_PASSWORD'),
      authUrl: getenv('SWIFT_AUTHURL'),
      region: getenv('SWIFT_REGION')
    })

    this._container = container
  }

  static container (container) {
    return new Swift(container)
  }

  async getAllData () {
    return {
      container: await this.getContainer(),
      containerFiles: await this.getContainerFiles()
    }
  }

  async createContainer () {
    try {
      return this._client.createContainer({
        name: this._container
      })
    } catch (err) {
      console.log(`${err.statusCode} create container errror: ${err.failCode}`)

      return false
    }
  }

  async destroyContainer () {
    const destroyContainer = promisify(
      this._client.destroyContainer,
      this._client
    )

    try {
      return destroyContainer(this._container)
    } catch (err) {
      console.log(`${err.statusCode} destroy container errror: ${err.failCode}`)

      return false
    }
  }

  async getContainer () {
    const getContainer = promisify(this._client.getContainer, this._client)

    try {
      return getContainer(this._container)
    } catch (err) {
      console.log(`${err.statusCode} fetch container errror: ${err.failCode}`)

      return null
    }
  }

  async getContainerFiles () {
    const getFiles = promisify(this._client.getFiles, this._client)

    try {
      return getFiles(this._container)
    } catch (err) {
      console.log(
        `${err.statusCode} get container files errror: ${err.failCode}`
      )

      return []
    }
  }

  async removeContainerFiles () {
    const files = await this.getContainerFiles()

    try {
      for (const file of files) {
        await this.removeFile(file)
      }
    } catch (err) {
      console.log(`${err.statusCode} delete container errror: ${err.failCode}`)

      return null
    }
  }

  async getFile (filename) {
    const getFile = promisify(this._client.getFile, this._client)

    try {
      return await getFile(this._container, filename)
    } catch (err) {
      console.log(`${err.statusCode} fetching file errror: ${err.failCode}`)

      return null
    }
  }

  async downloadFile (filename) {
    return new Promise((resolve, reject) => {
      try {
        const file = new Writable()
        file.data = ''
        file._write = function (chunk, encoding, done) {
          this.data += chunk.toString()
          done()
        }

        this._client.download(
          {
            container: this._container,
            remote: filename,
            stream: file
          },
          (err, result) => {
            if (err) {
              console.log(
                `${err.statusCode} download file errror: ${err.failCode}`
              )
              return resolve(null)
            }

            return resolve(JSON.parse(file.data))
          }
        )
      } catch (err) {
        console.log(`${err.statusCode} download file errror: ${err.failCode}`)

        return resolve(null)
      }
    })
  }

  async uploadFile (filename, data) {
    return new Promise((resolve, reject) => {
      try {
        const readStream = new Readable()
        readStream.push(JSON.stringify(data))
        readStream.push(null)

        const writeStream = this._client.upload({
          container: this._container,
          remote: filename
        })

        writeStream.on('success', function (file) {
          return resolve(true)
        })

        readStream.pipe(writeStream)
      } catch (err) {
        console.log(`${err.statusCode} upload file errror: ${err.failCode}`)

        return resolve(false)
      }
    })
  }

  async removeFile (filename) {
    const removeFile = promisify(this._client.removeFile, this._client)

    try {
      return removeFile(this._container, filename)
    } catch (err) {
      console.log(`${err.statusCode} remove fil errror: ${err.failCode}`)

      return null
    }
  }
}

module.exports = Swift
