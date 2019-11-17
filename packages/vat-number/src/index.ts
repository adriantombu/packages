import * as soap from 'soap'

export async function getVatNumberInfos(vatNumber: string): Promise<Result> {
  const apiUrl = 'http://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl'
  const args = {
    countryCode: vatNumber.substring(0, 2),
    vatNumber: vatNumber.substring(2),
  }

  try {
    const client = await soap.createClientAsync(apiUrl)
    const results = await client.checkVatAsync(args)

    return {
      country: results[0].countryCode,
      vatNumber: results[0].vatNumber,
      fullVatNumber: `${results[0].countryCode}${results[0].vatNumber}`,
      name: results[0].name,
      address: results[0].address,
      valid: true,
    }
  } catch (err) {
    return {
      fullVatNumber: vatNumber,
      message: 'The VAT number provided is not valid',
      valid: false,
    }
  }
}

interface Result {
  country?: string
  vatNumber?: string
  fullVatNumber: string
  message?: string
  name?: string
  address?: string
  valid: boolean
}
