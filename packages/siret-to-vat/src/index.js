'use strict'

module.exports = function (nbr) {
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
    // SIRET
    case 14:
      tva = getVatNumber(checkAndConvertSiret(number))
      break
  }

  return tva
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

  if (total % 10 === 0) {
    return siret.substring(0, 9)
  } else {
    // invalid siret number
    return null
  }
}

const getVatNumber = number => {
  const validation = (12 + 3 * (number % 97)) % 97

  return `FR${validation}${number}`
}
