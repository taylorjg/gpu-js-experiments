import {
  ALL_CODES,
  ALL_SCORES,
  evaluateScore,
  evaluatesToSameScore,
  codeToString,
  solve
} from './mastermindCommon'
import * as U from './utils'

const calculateNewGuess = untried => {
  const initialBest = { count: Number.MAX_VALUE }
  const best = ALL_CODES.reduce((currentBest, allCode) => {
    const maxCount = ALL_SCORES.reduce((currentMax, allScore) => {
      const count = U.countWithPredicate(untried, evaluatesToSameScore(allCode, allScore))
      return Math.max(currentMax, count)
    }, 0)
    return maxCount < currentBest.count
      ? { count: maxCount, guess: allCode }
      : currentBest
  }, initialBest)
  return best.guess
}

export const mastermindCpu = (secret, outputElement) => {
  const logger = U.makeLogger(outputElement)
  logger(`[mastermindCpu] secret: ${codeToString(secret)}`)
  const attempt = guess => evaluateScore(secret, guess)
  const history = solve(logger, attempt, calculateNewGuess)
  logger(`[mastermindCpu] numAttempts: ${history.length}`)
}
