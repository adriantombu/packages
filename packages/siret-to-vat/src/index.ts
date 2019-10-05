export default (nbr: number | string) => {
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
        message: '',
        valid: true
      }

    case 14: {
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
        message: '',
        valid: true
      }
    }

    default:
      return {
        vatNumber: nbr,
        message: 'The number provided must be a SIREN (9 caracters) or SIREN (14 caracters)',
        valid: false
      }
  }
}

export function checkAndConvertSiret (siret: string) {
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
    message: '',
    siren: siret.substring(0, 9)
  }
}

export function getVatNumber (number: string): string {
  const validation = (12 + 3 * (parseInt(number, 10) % 97)) % 97

  return `FR${validation}${number}`
}
