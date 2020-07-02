import registerPromiseWorker from 'promise-worker/register'
import { GPU } from 'gpu.js'
import { ALL_PEGS, ALL_SCORES } from './mastermindCommon'

const gpu = new GPU()

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

function countOccurrencesOfPeg(peg, code) {
  return (
    (peg === code[0] ? 1 : 0) +
    (peg === code[1] ? 1 : 0) +
    (peg === code[2] ? 1 : 0) +
    (peg === code[3] ? 1 : 0)
  )
}

function countMatchingPegsByPosition(code1, code2) {
  return (
    (code1[0] === code2[0] ? 1 : 0) +
    (code1[1] === code2[1] ? 1 : 0) +
    (code1[2] === code2[2] ? 1 : 0) +
    (code1[3] === code2[3] ? 1 : 0)
  )
}

function evaluateScore(allPegs, code1, code2) {
  let sumOfMinOccurrences = 0
  for (let i = 0; i < 6; i++) {
    const peg = allPegs[i]
    const numOccurrences1 = countOccurrencesOfPeg(peg, code1)
    const numOccurrences2 = countOccurrencesOfPeg(peg, code2)
    const minOccurrences = Math.min(numOccurrences1, numOccurrences2)
    sumOfMinOccurrences += minOccurrences
  }
  const blacks = countMatchingPegsByPosition(code1, code2)
  const whites = sumOfMinOccurrences - blacks
  return [blacks, whites]
}

function findBest(allPegs, allScores, allCode, untried, untriedCount) {
  let maxCount = 0
  for (let i = 0; i < 14; i++) {
    const [blacks1, whites1] = allScores[i]
    let count = 0
    for (let j = 0; j < untriedCount; j++) {
      const [p0, p1, p2, p3] = untried[j]
      const untriedCode = [p0, p1, p2, p3]
      const [blacks2, whites2] = evaluateScore(allPegs, allCode, untriedCode)
      if (blacks1 === blacks2 && whites1 === whites2) count++
    }
    maxCount = Math.max(maxCount, count)
  }
  return maxCount
}

gpu.addFunction(encodeCode)
gpu.addFunction(
  allCodeFromIndex,
  {
    argumentTypes: {
      allPegs: 'Array',
      index: 'Number'
    },
    returnType: 'Array(4)'
  })
gpu.addFunction(countOccurrencesOfPeg)
gpu.addFunction(countMatchingPegsByPosition)
gpu.addFunction(evaluateScore)
gpu.addFunction(findBest)

function kernelEntryPoint(allPegs, allScores, untried, untriedCount) {
  const index = this.thread.x
  const allCode = allCodeFromIndex(allPegs, index)
  const maxCount = findBest(allPegs, allScores, allCode, untried, untriedCount)
  return [maxCount, encodeCode(allCode)]
}

const settings = {
  output: [1296],
  dynamicArguments: true
}

const kernel = gpu.createKernel(kernelEntryPoint, settings)

const onCalculateNewGuess = untried => {
  const allScores = ALL_SCORES.map(({ blacks, whites }) => [blacks, whites])
  const untriedCount = untried.length
  const bests = kernel(ALL_PEGS, allScores, untried, untriedCount)
  const overallBest = bests.reduce(
    (currentBest, best) => best[0] < currentBest[0] ? best : currentBest,
    [Number.MAX_SAFE_INTEGER, undefined])
  return decodeCode(overallBest[1])
}

const onUnknownMessage = message => {
  console.log(`Unknown message: ${JSON.stringify(message)}`)
}

const processMessage = message => {
  switch (message.type) {
    case 'calculateNewGuess': return onCalculateNewGuess(message.untried)
    default: return onUnknownMessage(message)
  }
}

registerPromiseWorker(processMessage)
