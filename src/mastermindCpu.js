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

const calculateNewGuess = untried => {
  const initialBest = { count: Number.MAX_VALUE }
  const best = ALL_CODES.reduce((currentBest, allCode) => {
    const maxCount = ALL_SCORES.reduce((currentMax, allScore) => {
      const count = countWithPredicate(untried, evaluatesToSameScore(allCode, allScore))
      return Math.max(currentMax, count)
    }, 0)
    return maxCount < currentBest.count
      ? { count: maxCount, guess: allCode }
      : currentBest
  }, initialBest)
  return best.guess
}

const solve = (attempt, untried = ALL_CODES, history = []) => {
  console.log(`[mastermindCpu solve] untried length: ${untried.length}`)
  const guess = history.length === 0 ? INITIAL_GUESS :
    untried.length === 1 ? untried[0] : calculateNewGuess(untried)
  const score = attempt(guess)
  console.log(`[mastermindCpu solve] guess: ${codeToString(guess)}; score: ${scoreToString(score)}`)
  const newHistory = [...history, { guess, score }]
  if (score.blacks === 4) return newHistory
  const newUntried = untried.filter(evaluatesToSameScore(guess, score))
  return solve(attempt, newUntried, newHistory)
}

export const mastermindCpu = secret => {
  console.log(`[mastermindCpu] secret: ${codeToString(secret)}`)
  const attempt = guess => evaluateScore(secret, guess)
  const history = solve(attempt)
  console.log(`[mastermindCpu] numAttempts: ${history.length}`)
}
