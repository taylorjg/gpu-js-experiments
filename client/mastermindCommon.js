const P = {
  R: Symbol('red'),
  G: Symbol('green'),
  B: Symbol('blue'),
  Y: Symbol('yellow'),
  BL: Symbol('black'),
  WH: Symbol('white')
};

const PEGS = Object.values(P);

const pegToString = peg => {
  switch (peg) {
    case P.R: return "R";
    case P.G: return "G";
    case P.B: return "B";
    case P.Y: return "Y";
    case P.BL: return "BL";
    case P.WH: return "WH";
    default: return "?";
  }
};

export const codeToString = code =>
  code.map(pegToString).join("-");

export const ALL_COMBINATIONS =
  Array.from(function* () {
    for (const a of PEGS)
      for (const b of PEGS)
        for (const c of PEGS)
          for (const d of PEGS)
            yield [a, b, c, d];
  }());

export const ALL_OUTCOMES =
  Array.from(function* () {
    for (const blacks of [0, 1, 2, 3, 4])
      for (const whites of [0, 1, 2, 3, 4])
        yield { blacks, whites };
  }())
    .filter(fb => fb.blacks + fb.whites <= 4)
    .filter(fb => !(fb.blacks === 3 && fb.whites === 1));

export const INITIAL_GUESS = [P.R, P.R, P.G, P.G];

export const range = n =>
  Array.from(Array(n).keys());

export const countWithPredicate = (xs, p) =>
  xs.reduce((acc, x) => acc + (p(x) ? 1 : 0), 0);

export const generateRandomCode = () => {
  const chooseRandomPeg = () => {
    const randomIndex = Math.floor((Math.random() * PEGS.length));
    return PEGS[randomIndex];
  };
  return range(4).map(chooseRandomPeg);
};

export const evaluateGuess = (secret, guess) => {
  const count = (xs, p) => xs.filter(x => x === p).length;
  const add = (a, b) => a + b;
  const sum = PEGS.map(p => Math.min(count(secret, p), count(guess, p))).reduce(add);
  const blacks = secret.filter((peg, index) => peg === guess[index]).length;
  const whites = sum - blacks;
  return { blacks, whites };
};

export const sameFeedback = (fb1, fb2) =>
  fb1.blacks === fb2.blacks &&
  fb1.whites === fb2.whites;

export const evaluatesToSameFeedback = (code1, feedback) => code2 =>
  sameFeedback(evaluateGuess(code1, code2), feedback);

export const sameGuessAs = g1 => g2 => g1.every((p, i) => p === g2[i]);
