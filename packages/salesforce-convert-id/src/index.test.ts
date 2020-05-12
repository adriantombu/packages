import { salesforceConvertId } from './index'

describe('salesforceConvertId() method', () => {
  test('with sfid of invalid length', async () => {
    const sfid = '123'

    const res = salesforceConvertId(sfid)

    expect(res).toBe(sfid)
  })

  test('with sfid of length 18', async () => {
    const sfid = 'a0i1t000002i0p0AAA'

    const res = salesforceConvertId(sfid)

    expect(res).toBe('a0i1t000002i0p0AAA')
  })

  test('with sfid of length 15', async () => {
    const sfid = 'a0i1t000002i0p0'

    const res = salesforceConvertId(sfid)

    expect(res).toBe('a0i1t000002i0p0AAA')
  })
})
