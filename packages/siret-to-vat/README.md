SIREN/SIREN to VAT number
=========================

[![npm version](https://badge.fury.io/js/%40adriantombu%2Fsiret-to-vat.svg)](https://badge.fury.io/js/%40adriantombu%2Fsiret-to-vat) [![](https://img.shields.io/badge/Buy%20me%20a%20tree-%F0%9F%8C%B3-lightgreen)](https://offset.earth/adrian)

This small library converts a French SIREN or SIRET to a valid VAT number. You can then use the [vat number library](https://github.com/adriantombu/vat-number) to check it against the official European records.

### How to use it

* Install the library first with `yarn add @adriantombu/siret-to-vat`
* And then import it in your script

```
const convertToVatNumber = require('@adriantombu/siret-to-vat')

const siren = 817871668
const vat = convertToVatNumber(siren)

{
  vatNumber: "FR16817871668",
  valid: true
}
```

In case of an invalid number, you will receive the following result, with the value `valid` set to `false`

```
const convertToVatNumber = require('@adriantombu/siret-to-vat')

const siren = 123456'
const vat = convertToVatNumber(siren)

{
  vatNumber: 123456',
  message: 'The number provided must be a SIREN (9 caracters) or SIREN (14 caracters)',
  valid: false
}
```

### How to contribute

* Clone the repository `git clone git@github.com:adriantombu/siret-to-vat.git`
* Install the packages with `yarn install`
* Modify the `src/index.ts` file
* When everything's done, you can send a PR \o/
