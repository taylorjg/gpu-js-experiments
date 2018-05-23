const P = {
  R: Symbol('red'),
  G: Symbol('green'),
  B: Symbol('blue'),
  Y: Symbol('yellow'),
  BL: Symbol('black'),
  WH: Symbol('white')
};

const ALL_PEGS = Object.values(P);

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

export const ALL_CODES =
  Array.from(function* () {
    for (const a of ALL_PEGS)
      for (const b of ALL_PEGS)
        for (const c of ALL_PEGS)
          for (const d of ALL_PEGS)
            yield [a, b, c, d];
  }());

export const range = n =>
  Array.from(Array(n).keys());

export const ALL_SCORES =
  Array.from(function* () {
    for (const blacks of range(5))
      for (const whites of range(5 - blacks))
        yield { blacks, whites };
  }())
    .filter(fb => !(fb.blacks === 3 && fb.whites === 1));

export const INITIAL_GUESS = [P.R, P.R, P.G, P.G];

export const countWithPredicate = (xs, p) =>
  xs.reduce((acc, x) => acc + (p(x) ? 1 : 0), 0);

export const generateRandomCode = () => {
  const chooseRandomPeg = () => {
    const randomIndex = Math.floor((Math.random() * ALL_PEGS.length));
    return ALL_PEGS[randomIndex];
  };
  return range(4).map(chooseRandomPeg);
};

export const evaluateGuess = (secret, guess) => {
  const count = (xs, p) => xs.filter(x => x === p).length;
  const add = (a, b) => a + b;
  const sum = ALL_PEGS.map(p => Math.min(count(secret, p), count(guess, p))).reduce(add);
  const blacks = secret.filter((peg, index) => peg === guess[index]).length;
  const whites = sum - blacks;
  return { blacks, whites };
};

export const sameFeedback = (fb1, fb2) =>
  fb1.blacks === fb2.blacks &&
  fb1.whites === fb2.whites;

export const evaluatesToSameFeedback = (code1, feedback) => code2 =>
  sameFeedback(evaluateGuess(code1, code2), feedback);
