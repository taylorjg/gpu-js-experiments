// import { GPU } from 'gpu.js'
// const gpu = new GPU()

import {
  ALL_CODES,
  ALL_SCORES,
  INITIAL_GUESS,
  evaluateScore,
  evaluatesToSameScore,
  codeToString,
  scoreToString,
  countWithPredicate
} from './mastermindCommon'

// const f = gpu.createKernel(function (x) {
//   return x[this.thread.x % 3]
// }).setOutput([100])

// export const runBasicExample = () => {
//   const result = f([1, 2, 3])
//   console.log(`result: ${JSON.stringify(result)}`)
// }

const calculateNewGuess = untried => {
  const best = ALL_CODES.reduce((currentBest, unusedCode) => {
    const max = ALL_SCORES.reduce((currentMax, score) => {
      const count = countWithPredicate(untried, evaluatesToSameScore(unusedCode, score))
      return Math.max(currentMax, count)
    }, 0)
    return max < currentBest.min ? { min: max, guess: unusedCode } : currentBest
  }, { min: Number.MAX_VALUE })
  return best.guess
}

const solve = (attempt, untried, history) => {
  console.log(`[mastermindWithoutGpu] untried length: ${untried.length}`)
  const guess = history.length === 0 ? INITIAL_GUESS :
    untried.length === 1 ? untried[0] : calculateNewGuess(untried)
  console.log(`[mastermindWithoutGpu] generated guess: ${codeToString(guess)}`)
  const score = attempt(guess)
  console.log(`[mastermindWithoutGpu] score: ${scoreToString(score)}`)
  const newHistory = [...history, { guess, score }]
  if (score.blacks === 4) return newHistory
  const newUntried = untried.filter(evaluatesToSameScore(guess, score))
  return solve(attempt, newUntried, newHistory)
}

export const mastermindWithGpu = secret => {
  console.log(`[mastermindWithoutGpu] secret: ${codeToString(secret)}`)
  const history = solve(guess => evaluateScore(secret, guess), ALL_CODES, [])
  console.log(`[mastermindWithoutGpu] numAttempts: ${history.length}`)
}
