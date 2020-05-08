import { promisify } from 'util'
import { Readable, Writable } from 'stream'
import * as pkgcloud from 'pkgcloud'

export default class Swift {
  private client: pkgcloud.storage.Client
  private container: string

  constructor(params: Params) {
    const options: pkgcloud.OpenstackProviderOptions = {
      provider: 'openstack',
      username: params.username,
      password: params.password,
      authUrl: params.authUrl,
      region: params.region,
    }

    this.client = pkgcloud.storage.createClient(options)
    this.container = params.container
  }

  static container(params: Params) {
    return new this({
      container: params.container,
      username: params.username,
      password: params.password,
      authUrl: params.authUrl,
      region: params.region,
    })
  }

  async getAllData() {
    return {
      container: await this.getContainer(),
      containerFiles: await this.getContainerFiles(),
    }
  }

  async createContainer() {
    try {
      return this.client.createContainer({ name: this.container }, (_, container) => container)
    } catch (err) {
      console.log(`${err.statusCode} create container errror: ${err.failCode}`)

      return false
    }
  }

  async destroyContainer() {
    const destroyContainer = promisify(this.client.destroyContainer)

    try {
      return destroyContainer(this.container)
    } catch (err) {
      console.log(`${err.statusCode} destroy container errror: ${err.failCode}`)

      return false
    }
  }

  async getContainer() {
    const getContainer = promisify(this.client.getContainer)

    try {
      return getContainer(this.container)
    } catch (err) {
      console.log(`${err.statusCode} fetch container errror: ${err.failCode}`)

      return null
    }
  }

  async getContainerFiles() {
    const getFiles = promisify(this.client.getFiles)

    try {
      return getFiles(this.container)
    } catch (err) {
      console.log(`${err.statusCode} get container files errror: ${err.failCode}`)

      return []
    }
  }

  async removeContainerFiles(): Promise<void> {
    const files = await this.getContainerFiles()

    try {
      for (const file of files) {
        await this.removeFile(file.name)
      }
    } catch (err) {
      console.log(`${err.statusCode} delete container errror: ${err.failCode}`)
    }
  }

  async getFile(filename: string) {
    const getFile = promisify(this.client.getFile)

    try {
      return await getFile(this.container, filename)
    } catch (err) {
      console.log(`${err.statusCode} fetching file errror: ${err.failCode}`)

      return null
    }
  }

  async downloadFile(filename: string): Promise<string> {
    return new Promise((resolve) => {
      try {
        const file = new Writable()
        // @ts-ignore
        file.data = ''
        file._write = (chunk, _, done) => {
          // @ts-ignore
          this.data += chunk.toString()
          done()
        }

        this.client.download(
          {
            container: this.container,
            remote: filename,
            stream: file,
          },
          // @ts-ignore
          (err) => {
            if (err) {
              console.log(`${err.statusCode} download file errror: ${err.failCode}`)

              return resolve()
            }

            // @ts-ignore
            return resolve(JSON.parse(file.data))
          },
        )
      } catch (err) {
        console.log(`${err.statusCode} download file errror: ${err.failCode}`)

        return resolve()
      }
    })
  }

  async uploadFile(filename: string, data: any): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const readStream = new Readable()
        readStream.push(JSON.stringify(data))
        readStream.push(null)

        const writeStream = this.client.upload({
          container: this.container,
          remote: filename,
        })

        writeStream.on('success', () => {
          return resolve(true)
        })

        readStream.pipe(writeStream)
      } catch (err) {
        console.log(`${err.statusCode} upload file errror: ${err.failCode}`)

        return resolve(false)
      }
    })
  }

  async removeFile(filename: string) {
    const removeFile = promisify(this.client.removeFile)

    try {
      return removeFile(this.container, filename)
    } catch (err) {
      console.log(`${err.statusCode} remove fil errror: ${err.failCode}`)

      return null
    }
  }
}

export interface Params {
  container: string
  username: string
  password: string
  authUrl: string
  region: string
}
