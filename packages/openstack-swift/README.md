# Openstack Swift storage
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This library is a simple wrapper over [pkgcloud](https://github.com/pkgcloud/pkgcloud) to be able to use the [Swift storage provider](https://docs.openstack.org/swift/latest/) from Openstack easily.

> A distributed object storage system designed to scale from a single machine to thousands of servers. Swift is optimized for multi-tenancy and high concurrency. Swift is ideal for backups, web and mobile content, and any other unstructured data that can grow without bound.

### How to install it

* Install the package from npm with `yarn add @adriantombu/openstack-swift`
* Fill in the following environnement variables

```
OPENSTACK_SWIFT_PROVIDER
OPENSTACK_SWIFT_USERNAME
OPENSTACK_SWIFT_PASSWORD
OPENSTACK_SWIFT_AUTHURL
OPENSTACK_SWIFT_REGION
OPENSTACK_SWIFT_CONTAINER
```

* Instanciate the library in your script

```
const getenv = require('getenv')
const swift = require('../src/providers/swift').container(
  getenv('OPENSTACK_SWIFT_CONTAINER')
)
```

### How to contribute

* Clone the repository `git clone git@github.com:adriantombu/openstack-swift.git`
* Install the packages with `yarn install`
* Modify the `src/index.js` file
* When everything's done, you can run `yarn build` to wrap everything up !
