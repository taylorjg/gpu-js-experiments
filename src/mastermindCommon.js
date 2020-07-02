import * as U from './utils'

export const P = {
  R: 0,
  G: 1,
  B: 2,
  Y: 3,
  BL: 4,
  WH: 5
}

export const ALL_PEGS = Object.values(P)

export const ALL_CODES =
  Array.from(function* () {
    for (const p0 of ALL_PEGS)
      for (const p1 of ALL_PEGS)
        for (const p2 of ALL_PEGS)
          for (const p3 of ALL_PEGS)
            yield [p0, p1, p2, p3]
  }())

export const ALL_SCORES =
  Array.from(function* () {
    for (const blacks of U.range(5))
      for (const whites of U.range(5 - blacks))
        yield { blacks, whites }
  }())
    .filter(score => score.blacks + score.whites <= 4)
    .filter(score => !(score.blacks === 3 && score.whites === 1))

const pegToString = peg => {
  switch (peg) {
    case P.R: return 'R'
    case P.G: return 'G'
    case P.B: return 'B'
    case P.Y: return 'Y'
    case P.BL: return 'b'
    case P.WH: return 'w'
    default: return '?'
  }
}

export const codeToString = code =>
  code.map(pegToString).join('-')

export const scoreToString = score =>
  'B'.repeat(score.blacks) + 'W'.repeat(score.whites)

export const INITIAL_GUESS = [P.R, P.R, P.G, P.G]

export const generateRandomCode = () => {
  const chooseRandomPeg = () => {
    const randomIndex = Math.floor((Math.random() * ALL_PEGS.length))
    return ALL_PEGS[randomIndex]
  }
  return U.range(4).map(chooseRandomPeg)
}

const countOccurrencesOfPeg = (peg, code) =>
  (peg === code[0] ? 1 : 0) +
  (peg === code[1] ? 1 : 0) +
  (peg === code[2] ? 1 : 0) +
  (peg === code[3] ? 1 : 0)

const countMatchingPegsByPosition = (code1, code2) =>
  (code1[0] === code2[0] ? 1 : 0) +
  (code1[1] === code2[1] ? 1 : 0) +
  (code1[2] === code2[2] ? 1 : 0) +
  (code1[3] === code2[3] ? 1 : 0)

export const evaluateScore = (code1, code2) => {
  const add = (a, b) => a + b
  const minOccurrences = ALL_PEGS.map(peg => {
    const numOccurrences1 = countOccurrencesOfPeg(peg, code1)
    const numOccurrences2 = countOccurrencesOfPeg(peg, code2)
    return Math.min(numOccurrences1, numOccurrences2)
  })
  const sumOfMinOccurrences = minOccurrences.reduce(add)
  const blacks = countMatchingPegsByPosition(code1, code2)
  const whites = sumOfMinOccurrences - blacks
  return { blacks, whites }
}

export const sameScore = (score1, score2) =>
  score1.blacks === score2.blacks &&
  score1.whites === score2.whites

export const evaluatesToSameScore = (code1, score) => code2 =>
  sameScore(evaluateScore(code1, code2), score)

const recursiveSolveStep = (logger, attempt, calculateNewGuess, untried, history) => {
  logger(`[recursiveSolveStep] untried length: ${untried.length}`)
  const guess = history.length === 0 ? INITIAL_GUESS :
    untried.length === 1 ? untried[0] : calculateNewGuess(untried)
  const score = attempt(guess)
  logger(`[recursiveSolveStep] guess: ${codeToString(guess)}; score: ${scoreToString(score)}`)
  const newHistory = [...history, { guess, score }]
  if (score.blacks === 4) return newHistory
  const newUntried = untried.filter(evaluatesToSameScore(guess, score))
  return recursiveSolveStep(logger, attempt, calculateNewGuess, newUntried, newHistory)
}

export const solve = (logger, attempt, calculateNewGuess) => {
  const start = performance.now()
  const history = recursiveSolveStep(logger, attempt, calculateNewGuess, ALL_CODES, [])
  const end = performance.now()
  logger(`[solve] duration: ${(end - start).toFixed(2)}ms`)
  return history
}
