'use strict'

const soap = require('soap')

exports.convertToVatNumber = function (nbr) {
  if (!nbr) {
    return false
  }

  const number = nbr.toString().replace(' ', '')
  let tva = null

  switch (number.length) {
    // SIREN
    case 9:
      tva = getVatNumber(number)
      break

    case 13:
      tva = number
      break
    // SIRET
    case 14:
      tva = getVatNumber(checkAndConvertSiret(number))
      break
  }

  return tva
}

exports.checkVatNumber = async function (vatNumber) {
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

const checkAndConvertSiret = siret => {
  const length = siret.length
  let total = 0

  for (let i = 1; i <= length; i++) {
    const number = siret.substring(-i, 1)

    if (i % 2 === 0) {
      total += 2 * number

      if (2 * number >= 10) {
        total -= 9
      }
    } else {
      total += number
    }
  }

  if (total % 10 === 0) {
    return siret.substring(0, -5)
  } else {
    // invalid siret number
    return null
  }
}

const getVatNumber = number => {
  const validation = (12 + 3 * (number % 97)) % 97

  return `FR${validation}${number}`
}
