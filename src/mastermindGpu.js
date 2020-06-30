import {
  ALL_PEGS,
  evaluateScore,
  codeToString,
  solve
} from './mastermindCommon'

import { GPU } from 'gpu.js'
const gpu = new GPU()

function encodeScore(blacks, whites) {
  return blacks | (whites << 8)
}

function decodeScore(encoded) {
  const blacks = encoded & 0x00ff
  const whites = (encoded & 0xff00) >> 8
  return [blacks, whites]
}

const allScoresInterop = [
  encodeScore(0, 0),
  encodeScore(0, 1),
  encodeScore(0, 2),
  encodeScore(0, 3),
  encodeScore(0, 4),
  encodeScore(1, 0),
  encodeScore(1, 1),
  encodeScore(1, 2),
  encodeScore(1, 3),
  encodeScore(2, 0),
  encodeScore(2, 1),
  encodeScore(2, 2),
  encodeScore(3, 0),
  encodeScore(4, 0),
]

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

function allCodeFromIndex(allPegs, index) {
  const p0 = allPegs[Math.trunc(index / 216) % 6]
  const p1 = allPegs[Math.trunc(index / 36) % 6]
  const p2 = allPegs[Math.trunc(index / 6) % 6]
  const p3 = allPegs[index % 6]
  return [p0, p1, p2, p3]
}

function countPegs(peg, code) {
  const [p0, p1, p2, p3] = code
  return (
    (p0 === peg ? 1 : 0) +
    (p1 === peg ? 1 : 0) +
    (p2 === peg ? 1 : 0) +
    (p3 === peg ? 1 : 0)
  )
}

function evaluateScoreGpu(allPegs, code1, code2) {
  let sumOfMins = 0
  for (let i = 0; i < 6; i++) {
    const peg = allPegs[i]
    const numMatchingCode1Pegs = countPegs(peg, code1)
    const numMatchingCode2Pegs = countPegs(peg, code2)
    sumOfMins += Math.min(numMatchingCode1Pegs, numMatchingCode2Pegs)
  }
  let blacks = 0
  if (code1[0] == code2[0]) blacks++
  if (code1[1] == code2[1]) blacks++
  if (code1[2] == code2[2]) blacks++
  if (code1[3] == code2[3]) blacks++
  const whites = sumOfMins - blacks
  return [blacks, whites]
}

function findBest(allPegs, allScores, allCode, untried, untriedCount) {
  let maxCount = 0
  for (let i = 0; i < 14; i++) {
    const [blacks1, whites1] = decodeScore(allScores[i])
    let count = 0
    for (let j = 0; j < untriedCount; j++) {
      const untriedCode = decodeCode(untried[j])
      const [blacks2, whites2] = evaluateScoreGpu(allPegs, allCode, untriedCode)
      if (blacks1 === blacks2 && whites1 === whites2) count++
    }
    maxCount = Math.max(maxCount, count)
  }
  return [maxCount, encodeCode(allCode)]
}

gpu.addFunction(allCodeFromIndex)
gpu.addFunction(encodeCode)
gpu.addFunction(decodeCode)
gpu.addFunction(decodeScore)
gpu.addFunction(countPegs)
gpu.addFunction(evaluateScoreGpu)
gpu.addFunction(findBest)

function kernelEntryPoint(allPegs, allScores, untried, untriedCount) {
  const index = this.thread.x
  return findBest(
    allPegs,
    allScores,
    allCodeFromIndex(allPegs, index),
    untried,
    untriedCount)
}

const settings = {
  output: [1296]
}

const kernel = gpu.createKernel(kernelEntryPoint, settings)

const calculateNewGuess = untried => {
  const untriedInterop = untried.map(encodeCode)
  const bests = kernel(ALL_PEGS, allScoresInterop, untriedInterop, untriedInterop.length)
  const overallBest = bests.reduce(
    (currentBest, best) => best[0] < currentBest[0] ? best : currentBest,
    [Number.MAX_SAFE_INTEGER, undefined])
  return decodeCode(overallBest[1])
}

export const mastermindGpu = secret => {
  console.log(`[mastermindGpu] secret: ${codeToString(secret)}`)
  const attempt = guess => evaluateScore(secret, guess)
  const history = solve(attempt, calculateNewGuess)
  console.log(`[mastermindGpu] numAttempts: ${history.length}`)
}
