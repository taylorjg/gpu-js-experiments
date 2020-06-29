/* eslint-env node */

const { GPU } = require('gpu.js')
const gpu = new GPU()

const red = 0
const green = 1
const blue = 2
const yellow = 3
const black = 4
const white = 5

const allPegs = [red, green, blue, yellow, black, white]

const pegToString = peg => {
  switch (peg) {
    case red: return 'R'
    case green: return 'G'
    case blue: return 'B'
    case yellow: return 'Y'
    case black: return 'b'
    case white: return 'w'
    default: return '?'
  }
}

function codeToString(code) {
  const [a, b, c, d] = code
  const p0 = pegToString(a)
  const p1 = pegToString(b)
  const p2 = pegToString(c)
  const p3 = pegToString(d)
  return `${p0}-${p1}-${p2}-${p3}`
}

function allCodeFromIndex(index) {
  const p0 = allPegs[Math.trunc(index / 216) % 6]
  const p1 = allPegs[Math.trunc(index / 36) % 6]
  const p2 = allPegs[Math.trunc(index / 6) % 6]
  const p3 = allPegs[index % 6]
  return [p0, p1, p2, p3]
}

function encodeCode(code) {
  const [a, b, c, d] = code
  const p0 = a
  const p1 = b << 4
  const p2 = c << 8
  const p3 = d << 12
  return p0 | p1 | p2 | p3
}

function decodeCode(encoded) {
  const p0 = encoded & 0x000f
  const p1 = (encoded & 0x00f0) >> 4
  const p2 = (encoded & 0x0f00) >> 8
  const p3 = (encoded & 0xf000) >> 12
  return [p0, p1, p2, p3]
}

const fred = gpu.createKernel(function (allPegs) {

  function allCodeFromIndex(allPegs, index) {
    return [
      allPegs[Math.trunc(index / 216) % 6],
      allPegs[Math.trunc(index / 36) % 6],
      allPegs[Math.trunc(index / 6) % 6],
      allPegs[index % 6]
    ]
  }

  function encodeCode(code) {
    return code[0] | (code[1] << 4) | (code[2] << 8) | (code[3] << 12)
  }

  function decodeCode(encoded) {
    return [
      encoded & 0x000f,
      (encoded & 0x00f0) >> 4,
      (encoded & 0x0f00) >> 8,
      (encoded & 0xf000) >> 12
    ]
  }

  const index = this.thread.x
  return encodeCode(allCodeFromIndex(allPegs, index))
}).setOutput([1296])

const main = () => {
  const code = allCodeFromIndex(1295)
  console.log(`code: ${codeToString(code)}`)
  const fredResult = fred(allPegs)
  fredResult.forEach(code => console.log(codeToString(decodeCode(code))))
}

main()
