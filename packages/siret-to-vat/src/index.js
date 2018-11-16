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

  try {
    switch (number.length) {
      case 9:
        return {
          vatNumber: getVatNumber(number),
          valid: true
        }
      case 14:
        return {
          vatNumber: getVatNumber(checkAndConvertSiret(number)),
          valid: true
        }
      default:
        return {
          vatNumber: nbr,
          message: 'The number provided must be a SIREN (9 caracters) or SIREN (14 caracters)',
          valid: false
        }
    }
  } catch (err) {
    return {
      vatNumber: nbr,
      message: err.message,
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
    throw new Error('The SIRET provided is not valid')
  }

  return siret.substring(0, 9)
}

const getVatNumber = number => {
  const validation = (12 + 3 * (number % 97)) % 97

  return `FR${validation}${number}`
}

module.exports.checkAndConvertSiret = checkAndConvertSiret
module.exports.getVatNumber = getVatNumber
