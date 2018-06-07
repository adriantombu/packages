'use strict'

module.exports = arr => {
  if (!Array.isArray(arr)) {
    throw new Error(`Got a parameter of type ${typeof arr} instead of an array`)
  }

  return arr
    .map(a => [ Math.random(), a ])
    .sort((a, b) => a[0] - b[0]).map((a) => a[1])
}
