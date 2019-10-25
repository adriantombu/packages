import { getVatNumberInfos } from './index'

jest.setTimeout(30000)

it('the processed vat should return a proper object', async () => {
  const vatNumber = 'FR16817871668'
  const data = await getVatNumberInfos(vatNumber)

  expect(data).toHaveProperty('country', 'FR')
  expect(data).toHaveProperty('vatNumber', '16817871668')
  expect(data).toHaveProperty('fullVatNumber', 'FR16817871668')
  expect(data).toHaveProperty('name', 'SASU OTSO')
  expect(data).toHaveProperty('address', 'CS 21531\n59 ALL JEAN JAURES\n31000 TOULOUSE')
  expect(data).toHaveProperty('valid', true)
})

it('a wrong vat number should return an error message', async () => {
  const vatNumber = 'XX99999999999'
  const data = await getVatNumberInfos(vatNumber)

  expect(data).toHaveProperty('fullVatNumber', 'XX99999999999')
  expect(data).toHaveProperty('message', 'The VAT number provided is not valid')
  expect(data).toHaveProperty('valid', false)
})
