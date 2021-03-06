# EUROPEAN VAT NUMBER

[![npm version](https://badge.fury.io/js/%40adriantombu%2Fvat-number.svg)](https://badge.fury.io/js/%40adriantombu%2Fvat-number) [![](https://img.shields.io/badge/Buy%20me%20a%20tree-%F0%9F%8C%B3-lightgreen)](https://offset.earth/adrian)

This library validates an european VAT number and gets the related business data through the VIES API

### How to use it

- Install the library first with `yarn add @adriantombu/vat-number`
- And then import it in your script

```
const { getVatNumberInfos } = require('@adriantombu/vat-number')

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
const { getVatNumberInfos } = require('@adriantombu/vat-number')

const vatNumber = 'FRXXXXXXXXXX8';
const checkedVat = await getVatNumberInfos(vatNumber)

{
  fullVatNumber: 'FRXXXXXXXXXX8',
  valid: false
}
```

### How to contribute

- Clone the repository `git clone git@github.com:adriantombu/vat-number.git`
- Install the packages with `yarn install`
- Modify the `src/index.ts` file
- When everything's done, you can send a PR \o/
