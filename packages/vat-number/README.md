EUROPEAN VAT NUMBER
===================

[![npm version](https://badge.fury.io/js/%40adriantombu%2Fvat-number.svg)](https://badge.fury.io/js/%40adriantombu%2Fvat-number) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This library validates an european VAT number and gets the related business data through the VIES API

### How to use it

* Install the library first with `yarn add @adriantombu/vat-number`
* And then import it in your script

```
const getVatNumberInfos = require('@adriantombu/vat-number')

const vatNumber = 'FR16817871668';
const checkedVat = await getVatNumberInfos(vatNumber)

{
  country: 'FR',
  vatNumber: '16817871668',
  fullVatNumber: 'FR16817871668',
  name: 'SASU OTSO',
  address: 'CS 21531\n59 ALL JEAN JAURES\n31000 TOULOUSE',
  valid: true
}
```

In case of an invalid VAT number, you will receive the following result, with the value `valid` set to `false`

```
const getVatNumberInfos = require('@adriantombu/vat-number')

const vatNumber = 'FRXXXXXXXXXX8';
const checkedVat = await getVatNumberInfos(vatNumber)

{
  fullVatNumber: 'FRXXXXXXXXXX8',
  message: 'The VAT number provided is not valid',
  valid: false
}
```

### How to contribute

* Clone the repository `git clone git@github.com:adriantombu/vat-number.git`
* Install the packages with `yarn install`
* Modify the `src/index.js` file
* When everything's done, you can send a PR \o/
