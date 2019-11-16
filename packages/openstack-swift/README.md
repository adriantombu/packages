# Openstack Swift storage

[![npm version](https://badge.fury.io/js/%40adriantombu%2Fopenstack-swift.svg)](https://badge.fury.io/js/%40adriantombu%2Fopenstack-swift) [![Buy me a tree !](https://img.shields.io/badge/Buy%20me%20a%20tree-%F0%9F%8C%B3-lightgreen)](https://offset.earth/adrian)

This library is a simple wrapper over [pkgcloud](https://github.com/pkgcloud/pkgcloud) to be able to use the [Swift storage provider](https://docs.openstack.org/swift/latest/) from Openstack easily.

> A distributed object storage system designed to scale from a single machine to thousands of servers. Swift is optimized for multi-tenancy and high concurrency. Swift is ideal for backups, web and mobile content, and any other unstructured data that can grow without bound.

### How to install it

* Install the package from npm with `yarn add @adriantombu/openstack-swift`
* Instanciate the library in your script

```
const swift = require('@adriantombu/openstack-swift').default.container(
  container: 'swift-container',
  username: 'swift-username',
  password: 'swift-password',
  authUrl: 'swift-auth-url,
  region: 'swift-region'
)
```

You can then find all the available methods in the pkgcloud documentation under the [Storage section](https://github.com/pkgcloud/pkgcloud#storage).

### How to contribute

* Clone the repository `git clone git@github.com:adriantombu/openstack-swift.git`
* Install the packages with `yarn install`
* Modify the `src/index.ts` file
* When everything's done, you can send a PR \o/
