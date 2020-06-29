const P = {
  R: Symbol('red'),
  G: Symbol('green'),
  B: Symbol('blue'),
  Y: Symbol('yellow'),
  BL: Symbol('black'),
  WH: Symbol('white')
}

const ALL_PEGS = Object.values(P)

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

export const ALL_CODES =
  Array.from(function* () {
    for (const p0 of ALL_PEGS)
      for (const p1 of ALL_PEGS)
        for (const p2 of ALL_PEGS)
          for (const p3 of ALL_PEGS)
            yield [p0, p1, p2, p3]
  }())

export const range = n =>
  Array.from(Array(n).keys())

export const ALL_SCORES =
  Array.from(function* () {
    for (const blacks of range(5))
      for (const whites of range(5 - blacks))
        yield { blacks, whites }
  }())
    .filter(score => score.blacks + score.whites <= 4)
    .filter(score => !(score.blacks === 3 && score.whites === 1))

export const INITIAL_GUESS = [P.R, P.R, P.G, P.G]

export const countWithPredicate = (xs, p) =>
  xs.reduce((acc, x) => acc + (p(x) ? 1 : 0), 0)

export const generateRandomCode = () => {
  const chooseRandomPeg = () => {
    const randomIndex = Math.floor((Math.random() * ALL_PEGS.length))
    return ALL_PEGS[randomIndex]
  }
  return range(4).map(chooseRandomPeg)
}

export const evaluateScore = (code1, code2) => {
  const add = (a, b) => a + b
  const mins = ALL_PEGS.map(peg => {
    const count1 = countWithPredicate(code1, codePeg => codePeg === peg)
    const count2 = countWithPredicate(code2, codePeg => codePeg === peg)
    return Math.min(count1, count2)
  })
  const sumOfMins = mins.reduce(add)
  const blacks = code1.filter((peg, index) => peg === code2[index]).length
  const whites = sumOfMins - blacks
  return { blacks, whites }
}

export const sameScore = (score1, score2) =>
  score1.blacks === score2.blacks &&
  score1.whites === score2.whites

export const evaluatesToSameScore = (code1, score) => code2 =>
  sameScore(evaluateScore(code1, code2), score)
