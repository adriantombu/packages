SIREN/SIREN to VAT number
=========================

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![buddy pipeline](https://app.buddy.works/otso/siret-to-vat/pipelines/pipeline/140021/badge.svg?token=7c466137d3a236e04f255619e7e906afa90a993122df5bb06eec336813d1b265 "buddy pipeline")](https://app.buddy.works/otso/siret-to-vat/pipelines/pipeline/140021)

This small library converts a French SIREN or SIRET to a valid VAT number. You can then use the [vat number library](https://github.com/adriantombu/vat-number) to check it against the official European records.

### How to use it

* Install the library first with `yarn add @adriantombu/siret-to-vat`
* And then import it in your script

```
const convertToVatNumber = require('@adriantombu/siret-to-vat')

const siren = 817871668
const vat = convertToVatNumber(siren)

"FR16817871668"
```

### How to contribute

* Clone the repository `git clone git@github.com:adriantombu/siret-to-vat.git`
* Install the packages with `yarn install`
* Modify the `src/index.js` file
* When everything's done, you can run `yarn build` to wrap everything up !


