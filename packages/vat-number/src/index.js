'use strict'

const soap = require('soap')

module.exports = async function (vatNumber) {
  const url = 'http://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl'
  const args = {
    countryCode: vatNumber.substring(0, 2),
    vatNumber: vatNumber.substring(2)
  }

  const client = await soap.createClientAsync(url)
  const result = await client.checkVatAsync(args)

  if (!result || !result.valid) {
    return null
  }

  return {
    country: result.countryCode,
    vatNumber: result.vatNumber,
    fullVatNumber: `${result.countryCode}${result.vatNumber}`,
    name: result.name,
    address: result.address
  }
}
