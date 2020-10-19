# Openstack Swift storage

[![npm version](https://badge.fury.io/js/%40adriantombu%2Fopenstack-swift.svg)](https://badge.fury.io/js/%40adriantombu%2Fopenstack-swift) [![Buy me a tree !](https://img.shields.io/badge/Buy%20me%20a%20tree-%F0%9F%8C%B3-lightgreen)](https://offset.earth/adrian)

This library is a simple wrapper over [pkgcloud](https://github.com/pkgcloud/pkgcloud) to be able to use the [Swift storage provider](https://docs.openstack.org/swift/latest/) from Openstack easily.

> A distributed object storage system designed to scale from a single machine to thousands of servers. Swift is optimized for multi-tenancy and high concurrency. Swift is ideal for backups, web and mobile content, and any other unstructured data that can grow without bound.

### How to install it

- Install the package from npm with `yarn add @adriantombu/openstack-swift`
- Instanciate the library in your script

```
const swift = require('./lib').default.client({
  username: 'swift-username', // required
  password: 'swift-password', // required
  authUrl: 'swift-auth-url, // required
  region: 'swift-region'
  version: 'v3',
  keystoneAuthVersion: 'v3',
  domainName: 'Default'
})
```

- Start using the library

```
const container = await swift.getContainer('my-container')
```

### Container Model

A Container for OpenStack has following properties:

```
{
  name: 'my-container',
  count: 1, // number of files in your container
  bytes: 12345, // size of the container in bytes
  metadata: { // key value pairs for the container
    // ...
  }
}
```

### File Model

A File for OpenStack has the following properties:

```
{
  name: 'my-file',
  container:  'my-container', // may be an instance of container if provided
  size: 12345, // size of the file in bytes
  contentType: 'plain/text' // Mime type for the file
  lastModified: Fri Dec 14 2012 10:16:50 GMT-0800 (PST), // Last modified date of the file
  etag: '1234567890abcdef', // MD5 sum of the file
  metadata: {} // optional object metadata
}
```

### Available methods

#### swift.createContainer(container, metadata)

Creates a new container with the name from argument [`container`](#container-model). You can optionally provide `metadata` on the request:

```
swift.createContainer('my-container', {
  brand: 'bmw',
  model: '335i'
  year: 2009
})
```

#### swift.getContainer(container)

Retrieves the specified container from the current client instance.

#### swift.destroyContainer(container)

Removes the container from the storage account. If there are any files within the [`container`](#container-model), they will be deleted before removing the [`container`](#container-model) on the client. `result` will be `true` on success.

#### swift.getContainerFiles(container)

Retreives an array of [`file`](#file-model) for the provided [`container`](#container-model).

#### swift.removeContainerFiles(container)

Removes all the [`file`](#file-model) from the provided [`container`](#container-model).

#### swift.getFile(container, filename)

Retrieves the specified [`file`](#file-model) details in the specified [`container`](#container-model) from the current client instance.

#### swift.downloadFile(container, filename)

Returns a readable stream. Download a [`file`](#file-model) from a [`container`](#container-model).

#### swift.uploadFile(container, filename, data)

Returns a `writableStream`. Upload a new file to a [`container`](#container-model).

#### swift.removeFile(container, filename)

Removes the provided [`file`](#file-model) from the provided [`container`](#container-model).

#### swift.getAllData(container)

Returns an array containing the [`container`](#container-model) informations and a list of [`file`](#file-model).

```
{
  container: { ... },
  containerFiles: [ ... ],
}
```

### How to contribute

- Clone the repository `git clone git@github.com:adriantombu/packages.git`
- Install the packages with `yarn install`
- Modify the `packages/openstack-swift/src/index.ts` file
- When everything's done, you can send a PR \o/
