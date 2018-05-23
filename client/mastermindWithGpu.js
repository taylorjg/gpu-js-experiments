// import GPU from "gpu.js";
// const gpu = new GPU();

import {
  ALL_CODES,
  ALL_SCORES,
  INITIAL_GUESS,
  generateRandomCode,
  evaluateGuess,
  evaluatesToSameFeedback,
  codeToString,
  countWithPredicate
} from "./mastermindCommon";

// const f = gpu.createKernel(function (x) {
//   return x[this.thread.x % 3];
// }).setOutput([100]);

// export const runBasicExample = () => {
//   const result = f([1, 2, 3]);
//   console.log(`result: ${JSON.stringify(result)}`);
// };

const autosolve = attempt =>
  autosolve2(attempt, ALL_CODES, []);

const autosolve2 = (attempt, set, acc) => {
  console.log(`set length: ${set.length}`);
  const guess = acc.length === 0 ? INITIAL_GUESS :
    set.length === 1 ? set[0] : calculateNewGuess(set);
  console.log(`generated guess: ${codeToString(guess)}`);
  const score = attempt(guess);
  console.log(`score: ${JSON.stringify(score)}`);
  const updatedAcc = [...acc, [guess, score]];
  if (score.blacks === 4) return updatedAcc;
  const updatedSet = set.filter(evaluatesToSameFeedback(guess, score));
  return autosolve2(attempt, updatedSet, updatedAcc);
};

const calculateNewGuess = set => {
  const best = ALL_CODES.reduce((currentBest, unusedCode) => {
    const max = ALL_SCORES.reduce((currentMax, score) => {
      const count = countWithPredicate(set, evaluatesToSameFeedback(unusedCode, score));
      return Math.max(currentMax, count);
    }, 0);
    return max < currentBest.min ? { min: max, guess: unusedCode } : currentBest;
  }, { min: Number.MAX_VALUE });
  return best.guess;
};

export const runWithGpuAutoSolve = () => {
  const secret = generateRandomCode();
  console.log(`secret: ${codeToString(secret)}`);
  const guesses = autosolve(guess => evaluateGuess(secret, guess));
  console.log(`numAttempts: ${guesses.length}`);
};
