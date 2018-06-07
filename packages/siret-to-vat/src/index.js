'use strict'

module.exports = nbr => {
  if (!['string', 'number'].includes(typeof nbr)) {
    throw new Error(`Expected a number or string number but got a ${typeof nbr}`)
  }

  const number = nbr.toString().replace(/\s/g, '')

  switch (number.length) {
    case 9:
      return getVatNumber(number)
    case 14:
      return getVatNumber(checkAndConvertSiret(number))
    default:
      throw new Error(`The number provided must be a SIREN (9 caracters) or SIREN (14 caracters)`)
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
