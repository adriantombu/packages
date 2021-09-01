import { Readable, Writable } from 'stream'
import * as pkgcloud from 'pkgcloud'

export default class Swift {
  private client: pkgcloud.storage.Client

  constructor(params: pkgcloud.OpenstackProviderOptions) {
    const options: pkgcloud.OpenstackProviderOptions = {
      provider: 'openstack',
      username: params.username,
      password: params.password,
      authUrl: params.authUrl,
      region: params.region,
      tenantId: params.tenantId,
      version: params.version,
      keystoneAuthVersion: params.keystoneAuthVersion,
      domainId: params.domainId,
      domainName: params.domainName,
    }

    this.client = pkgcloud.storage.createClient(options)
  }

  static client(params: pkgcloud.OpenstackProviderOptions): Swift {
    return new Swift(params)
  }

  async getAllData(container: string) {
    return {
      container: await this.getContainer(container),
      containerFiles: await this.getContainerFiles(container),
    }
  }

  async createContainer(container: string, metadata: object = {}): Promise<boolean> {
    return new Promise((resolve) => {
      this.client.createContainer({ name: container, metadata }, function (err) {
        if (err) {
          console.error(`${err.statusCode} create container errror: ${err.failCode}`)

          resolve(false)
        }

        resolve(true)
      })
    })
  }

  async destroyContainer(container: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.client.destroyContainer(container, function (err) {
        if (err) {
          console.error(`${err.statusCode} destroy container errror: ${err.failCode}`)

          resolve(false)
        }

        resolve(true)
      })
    })
  }

  async getContainer(container: string): Promise<pkgcloud.storage.Container | null> {
    return new Promise((resolve) => {
      this.client.getContainer(container, function (err, container) {
        if (err) {
          console.error(`${err.statusCode} fetch container errror: ${err.failCode}`)

          resolve(null)
        }

        resolve(container)
      })
    })
  }

  async getContainerFiles(container: string): Promise<pkgcloud.storage.File[]> {
    return new Promise((resolve) => {
      this.client.getFiles(container, function (err, files) {
        if (err) {
          console.error(`${err.statusCode} get container files errror: ${err.failCode}`)

          resolve([])
        }

        resolve(files)
      })
    })
  }

  async removeContainerFiles(container: string): Promise<void> {
    const files = await this.getContainerFiles(container)

    for (const file of files) {
      await this.removeFile(container, file.name)
    }
  }

  async getFile(container: string, filename: string): Promise<pkgcloud.storage.File | null> {
    return new Promise((resolve) => {
      this.client.getFile(container, filename, function (err, file) {
        if (err) {
          console.error(`${err.statusCode} fetching file errror: ${err.failCode}`)

          resolve(null)
        }

        resolve(file)
      })
    })
  }

  async downloadFile(container: string, filename: string): Promise<string | null> {
    return new Promise((resolve) => {
      try {
        const file: Result = new Writable()
        file.data = ''
        file._write = function (chunk, _, done) {
          this.data += chunk.toString()
          done()
        }

        this.client.download(
          {
            container: container,
            remote: filename,
            stream: file,
          },

          // Types for this method are not up to date with the pkgcloud library
          // @ts-ignore
          (err: error) => {
            if (err) {
              console.error(`${err.statusCode} download file errror: ${err.failCode}`)

              return resolve(null)
            }

            return resolve(file.data ? JSON.parse(file.data) : '')
          },
        )
      } catch (err: any) {
        console.error(`${err.statusCode} download file errror: ${err.failCode}`)

        return resolve(null)
      }
    })
  }

  async uploadFile(container: string, filename: string, data: any): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const readStream = new Readable()
        readStream.push(JSON.stringify(data))
        readStream.push(null)

        const writeStream = this.client.upload({
          container: container,
          remote: filename,
        })

        writeStream.on('success', () => {
          return resolve(true)
        })

        readStream.pipe(writeStream)
      } catch (err: any) {
        console.error(`${err.statusCode} upload file errror: ${err.failCode}`)

        return resolve(false)
      }
    })
  }

  async removeFile(container: string, filename: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.client.removeFile(container, filename, function (err) {
        if (err) {
          console.error(`${err.statusCode} remove fil errror: ${err.failCode}`)

          resolve(false)
        }

        resolve(true)
      })
    })
  }
}

interface Result extends Writable {
  data?: string
}
