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

function allCodeFromIndex(allPegs, index) {
  const p0 = allPegs[Math.trunc(index / 216) % 6]
  const p1 = allPegs[Math.trunc(index / 36) % 6]
  const p2 = allPegs[Math.trunc(index / 6) % 6]
  const p3 = allPegs[index % 6]
  return [p0, p1, p2, p3]
}

function encodeCode(code) {
  const p0 = code[0]
  const p1 = code[1] << 4
  const p2 = code[2] << 8
  const p3 = code[3] << 12
  return p0 | p1 | p2 | p3
}

function decodeCode(encoded) {
  const p0 = encoded & 0x000f
  const p1 = (encoded & 0x00f0) >> 4
  const p2 = (encoded & 0x0f00) >> 8
  const p3 = (encoded & 0xf000) >> 12
  return [p0, p1, p2, p3]
}

gpu.addFunction(allCodeFromIndex)
gpu.addFunction(encodeCode)
gpu.addFunction(decodeCode)
// gpu.addFunction(evaluateScore)
// gpu.addFunction(findBest)

function kernelEntryPoint(allPegs) {
  const index = this.thread.x
  return encodeCode(allCodeFromIndex(allPegs, index))
}

const settings = {
  output: [1296]
}

const kernel = gpu.createKernel(kernelEntryPoint, settings)

const main = () => {
  const results = kernel(allPegs)
  results.forEach(code => console.log(codeToString(decodeCode(code))))
}

main()
