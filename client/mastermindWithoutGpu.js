import {
  ALL_CODES,
  ALL_SCORES,
  INITIAL_GUESS,
  evaluateGuess,
  evaluatesToSameFeedback,
  codeToString,
  countWithPredicate
} from "./mastermindCommon";

const autosolve = (attempt, set, acc) => {
  console.log(`[mastermindWithoutGpu] set length: ${set.length}`);
  const guess = acc.length === 0 ? INITIAL_GUESS :
    set.length === 1 ? set[0] : calculateNewGuess(set);
  console.log(`[mastermindWithoutGpu] generated guess: ${codeToString(guess)}`);
  const score = attempt(guess);
  console.log(`[mastermindWithoutGpu] score: ${JSON.stringify(score)}`);
  const updatedAcc = [...acc, [guess, score]];
  if (score.blacks === 4) return updatedAcc;
  const updatedSet = set.filter(evaluatesToSameFeedback(guess, score));
  return autosolve(attempt, updatedSet, updatedAcc);
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

export const mastermindWithoutGpu = secret => {
  console.log(`[mastermindWithoutGpu] secret: ${codeToString(secret)}`);
  const guesses = autosolve(guess => evaluateGuess(secret, guess), ALL_CODES, []);
  console.log(`[mastermindWithoutGpu] numAttempts: ${guesses.length}`);
};
