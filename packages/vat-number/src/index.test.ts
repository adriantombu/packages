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

it('the processed wrong vat number should return an error message', async () => {
  const vatNumber = 'FR16817871667' // This doesn't exist, but does not throw internally
  const data = await getVatNumberInfos(vatNumber)

  expect(data).toHaveProperty('fullVatNumber', vatNumber)
  expect(data).toHaveProperty('valid', false)
})

it('a wrong vat number should return an error message', async () => {
  const vatNumber = 'XX99999999999' // This doesn't exist and throws internally
  const data = await getVatNumberInfos(vatNumber)

  expect(data).toHaveProperty('fullVatNumber', vatNumber)
  expect(data).toHaveProperty('valid', false)
})
