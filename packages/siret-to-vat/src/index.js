'use strict'

module.exports = nbr => {
  if (!['string', 'number'].includes(typeof nbr)) {
    return {
      vatNumber: nbr,
      message: `Expected a number or string number but got a ${typeof nbr}`,
      valid: false
    }
  }

  const number = nbr.toString().replace(/\s/g, '')

  switch (number.length) {
    case 9:
      return {
        vatNumber: getVatNumber(number),
        valid: true
      }

    case 14:
      const vat = checkAndConvertSiret(number)

      if (!vat.valid) {
        return {
          vatNumber: nbr,
          message: vat.message,
          valid: false
        }
      }

      return {
        vatNumber: getVatNumber(vat.siren),
        valid: true
      }

    default:
      return {
        vatNumber: nbr,
        message: 'The number provided must be a SIREN (9 caracters) or SIREN (14 caracters)',
        valid: false
      }
  }
}

const checkAndConvertSiret = siret => {
  let total = 0
  let even = false

  for (let i = 13; i >= 0; i--) {
    let number = parseInt(siret[i], 10)

    if (even) {
      if ((number *= 2) > 9) number -= 9
    }

    total += number
    even = !even
  }

  if (total % 10 !== 0) {
    return {
      valid: false,
      message: 'The SIRET provided is not valid',
      siren: siret
    }
  }

  return {
    valid: true,
    siren: siret.substring(0, 9)
  }
}

const getVatNumber = number => {
  const validation = (12 + 3 * (number % 97)) % 97

  return `FR${validation}${number}`
}

module.exports.checkAndConvertSiret = checkAndConvertSiret
module.exports.getVatNumber = getVatNumber
