import { convertToVatNumber, checkAndConvertSiret, getVatNumber } from './index'

it('the processed SIRET should return a valid SIREN', () => {
  const siret = '81787166800023'
  const data = checkAndConvertSiret(siret)

  expect(data.siren.length).toEqual(9)
  expect(data.siren).toEqual('817871668')
})

it('a wrong SIRET should return an error', () => {
  const siret = '81787166800021'
  const data = checkAndConvertSiret(siret)

  expect(data.siren).toBe(siret)
  expect(data.valid).toBe(false)
  expect(data.message).toBe('The SIRET provided is not valid')
})

it('the processed SIREN should return a valid VAT number', () => {
  const siren = '817871668'
  const vat = getVatNumber(siren)

  expect(vat.length).toEqual(13)
  expect(vat).toEqual('FR16817871668')
})

it('a wrong type should return an error', () => {
  const emptyValue = convertToVatNumber()
  const objectValue = convertToVatNumber({ name: 'I am an object' })
  const nullValue = convertToVatNumber(null)
  const undefinedValue = convertToVatNumber(undefined)
  const arrayValue = convertToVatNumber(['I', 'am', 'an', 'array'])

  expect(emptyValue.valid).toBe(false)
  expect(objectValue.valid).toBe(false)
  expect(nullValue.valid).toBe(false)
  expect(undefinedValue.valid).toBe(false)
  expect(arrayValue.valid).toBe(false)
})

it('a wrong SIRET should get an error', () => {
  const siret = '81787166800021'
  const vat = convertToVatNumber(siret)

  expect(vat).toEqual({
    vatNumber: siret,
    message: 'The SIRET provided is not valid',
    valid: false,
  })
})

it('a valid SIRET should get a valid VAT number', () => {
  const siret = '81787166800023'
  const vat = convertToVatNumber(siret)

  expect(vat).toEqual({
    vatNumber: 'FR16817871668',
    message: '',
    valid: true,
  })
})

it('a valid spaced SIRET should get a valid VAT number', () => {
  const siret = '817 871 668 00023'
  const vat = convertToVatNumber(siret)

  expect(vat).toEqual({
    vatNumber: 'FR16817871668',
    message: '',
    valid: true,
  })
})

it('a valid SIREN should get a valid VAT number', () => {
  const siren = '817871668'
  const vat = convertToVatNumber(siren)

  expect(vat).toEqual({
    vatNumber: 'FR16817871668',
    message: '',
    valid: true,
  })
})

it('a valid spaced SIREN should get a valid VAT number', () => {
  const siren = '817 871 668'
  const vat = convertToVatNumber(siren)

  expect(vat).toEqual({
    vatNumber: 'FR16817871668',
    message: '',
    valid: true,
  })
})

it('a number size format different from a SIREN or a SIRET should return an error', () => {
  const badNumber = convertToVatNumber(123456)
  const badStringNumber = convertToVatNumber('123 456 78 90')

  expect(badNumber).toEqual({
    vatNumber: 123456,
    valid: false,
    message:
      'The number provided must be a SIREN (9 caracters) or SIREN (14 caracters)',
  })
  expect(badStringNumber).toEqual({
    vatNumber: '123 456 78 90',
    valid: false,
    message:
      'The number provided must be a SIREN (9 caracters) or SIREN (14 caracters)',
  })
})
