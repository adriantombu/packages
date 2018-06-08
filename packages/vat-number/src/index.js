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
      country: result.countryCode,
      vatNumber: result.vatNumber,
      fullVatNumber: `${result.countryCode}${result.vatNumber}`,
      name: result.name,
      address: result.address
    }
  } catch (err) {
    throw new Error('The VAT number provided is not valid')
  }
}
