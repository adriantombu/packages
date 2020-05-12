# Salesforce Convert ID

[![npm version](https://badge.fury.io/js/%40adriantombu%2Fsalesforce-convert-id.svg)](https://badge.fury.io/js/%40adriantombu%2Fsalesforce-convert-id) [![](https://img.shields.io/badge/Buy%20me%20a%20tree-%F0%9F%8C%B3-lightgreen)](https://offset.earth/adrian)

Before the [Salesforce API v2.5](https://help.salesforce.com/articleView?id=000324087&type=1&mode=1) we had both formats of ID lengths which can sometimes lead to some problems. This library aims to converts a 15 character Salesforce ID to a 18 characters Salesforce ID to address this issue.

### How to use it

- Install the library first with `yarn add @adriantombu/salesforce-convert-id`
- And then import it in your script

```
const { salesforceConvertId } = require('@adriantombu/salesforce-convert-id')

const smallId = 'a0i1t000002i0p0';
const longId = salesforceConvertId(smallId)

'a0i1t000002i0p0AAA'
```

In case of an invalid ID, we juste send it back with no warning as this is not the purpose of this library

```
const { salesforceConvertId } = require('@adriantombu/salesforce-convert-id')

const aWrongId = 'badid';
const longId = salesforceConvertId(aWrongId)

'badid'
```

### How to contribute

- Clone the repository `git clone git@github.com:adriantombu/salesforce-convert-id.git`
- Install the packages with `yarn install`
- Modify the `src/index.ts` file
- When everything's done, you can send a PR \o/
