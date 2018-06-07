const { checkAndConvertSiret, getVatNumber } = require('./index')
const convertToVatNumber = require('./index')

it('the processed SIRET should return a valid SIREN', () => {
  const siret = '81787166800023'
  const siren = checkAndConvertSiret(siret)

  expect(siren.length).toEqual(9)
  expect(siren).toEqual('817871668')
})

it('a wrong SIRET should throw an error', () => {
  const siret = '81787166800021'

  expect(() => checkAndConvertSiret(siret)).toThrow()
})

it('the processed SIREN should return a valid VAT number', () => {
  const siren = '817871668'
  const vat = getVatNumber(siren)

  expect(vat.length).toEqual(13)
  expect(vat).toEqual('FR16817871668')
})

it('a wrong type should return an error', () => {
  expect(() => convertToVatNumber({ name: 'I am an object' })).toThrow()
  expect(() => convertToVatNumber(null)).toThrow()
  expect(() => convertToVatNumber(undefined)).toThrow()
  expect(() => convertToVatNumber("I'm a string")).toThrow()
  expect(() => convertToVatNumber(['I', 'am', 'an', 'array'])).toThrow()
})

it('a valid SIRET should get a valid VAT number', () => {
  const siret = '81787166800023'
  const vat = convertToVatNumber(siret)

  expect(vat.length).toEqual(13)
  expect(vat).toEqual('FR16817871668')
})

it('a valid spaced SIRET should get a valid VAT number', () => {
  const siret = '817 871 668 00023'
  const vat = convertToVatNumber(siret)

  expect(vat.length).toEqual(13)
  expect(vat).toEqual('FR16817871668')
})

it('a valid SIREN should get a valid VAT number', () => {
  const siren = '817871668'
  const vat = convertToVatNumber(siren)

  expect(vat.length).toEqual(13)
  expect(vat).toEqual('FR16817871668')
})

it('a valid spaced SIREN should get a valid VAT number', () => {
  const siren = '817 871 668'
  const vat = convertToVatNumber(siren)

  expect(vat.length).toEqual(13)
  expect(vat).toEqual('FR16817871668')
})

it('a number size format different from a SIREN or a SIRET should return an error', () => {
  expect(() => convertToVatNumber(123456)).toThrow()
  expect(() => convertToVatNumber('123 456 78 90')).toThrow()
})
