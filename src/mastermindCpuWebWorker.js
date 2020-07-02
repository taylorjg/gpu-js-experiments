import registerPromiseWorker from 'promise-worker/register'
import { ALL_CODES, ALL_SCORES, evaluatesToSameScore } from './mastermindCommon'
import * as U from './utils'

const onCalculateNewGuess = untried => {
  const initialBest = { count: Number.MAX_VALUE, guess: undefined }
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
