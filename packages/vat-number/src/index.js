'use strict'

const soap = require('soap')

module.exports = async vatNumber => {
  const apiUrl = 'http://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl'
  const args = {
    countryCode: vatNumber.substring(0, 2),
    vatNumber: vatNumber.substring(2)
  }

  try {
    const client = await soap.createClientAsync(apiUrl)
    const result = await client.checkVatAsync(args)

    return {
      country: result[0].countryCode,
      vatNumber: result[0].vatNumber,
      fullVatNumber: `${result[0].countryCode}${result[0].vatNumber}`,
      name: result[0].name,
      address: result[0].address
    }
  } catch (err) {
    throw new Error('The VAT number provided is not valid')
  }
}
