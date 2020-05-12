export const salesforceConvertId = (sfId: string) => {
  if (![15, 18].includes(sfId.length) || sfId.length === 18) {
    return sfId
  }

  let addon = ''

  for (let block = 0; block < 3; block++) {
    let loop = 0

    for (let position = 0; position < 5; position++) {
      const current = sfId.charAt(block * 5 + position)

      if (current >= 'A' && current <= 'Z') {
        loop += 1 << position
      }
    }

    addon += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ012345'.charAt(loop)
  }

  return sfId + addon
}
