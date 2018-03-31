import {
  ALL_COMBINATIONS,
  ALL_OUTCOMES,
  INITIAL_GUESS,
  generateRandomCode,
  evaluateGuess,
  sameGuessAs,
  evaluatesToSameFeedback,
  codeToString,
  countWithPredicate
} from "./mastermindCommon";

export const generateGuess = (set, usedCodes, lastGuess, lastGuessFeedback) =>
  usedCodes.length
    ? mainAlgorithm(set, usedCodes, lastGuess, lastGuessFeedback)
    : {
      guess: INITIAL_GUESS,
      autoSolveSet: set,
      autoSolveUsed: [INITIAL_GUESS]
    };

const mainAlgorithm = (set, usedCodes, lastGuess, lastGuessFeedback) => {

  const filteredSet = set.filter(evaluatesToSameFeedback(lastGuess, lastGuessFeedback));

  if (filteredSet.length === 1) {
    const guess = filteredSet[0];
    return {
      guess,
      autoSolveSet: filteredSet,
      autoSolveUsed: usedCodes.concat([guess])
    };
  }

  const unusedCodes = ALL_COMBINATIONS.filter(guess => !usedCodes.find(sameGuessAs(guess)));

  const guess = calculate(filteredSet, unusedCodes).guess;

  return {
    guess,
    autoSolveSet: filteredSet,
    autoSolveUsed: usedCodes.concat([guess])
  };
};

const calculate = (filteredSet, unusedCodes) => {
  
  // TODO: use GPU if filteredSet.length > threshold

  return unusedCodes.reduce((currentBest, unusedCode) => {
    const max = ALL_OUTCOMES.reduce((currentMax, outcome) => {
      const count = countWithPredicate(filteredSet, evaluatesToSameFeedback(unusedCode, outcome));
      return Math.max(currentMax, count);
    }, 0);
    return max < currentBest.min ? { min: max, guess: unusedCode } : currentBest;
  }, { min: Number.MAX_VALUE });
};

const autoSolve = secret => {

  const loop = state => {

    console.log(`[attempt: ${state.numAttempts}] calling generateGuess()...`);

    const result = generateGuess(
      state.autoSolveSet,
      state.autoSolveUsed,
      state.lastGuess,
      state.lastGuessFeedback);

    console.log(`[attempt: ${state.numAttempts}] generated guess: ${codeToString(result.guess)}`);

    const feedback = evaluateGuess(secret, result.guess);

    console.log(`[attempt: ${state.numAttempts}] feedback: ${JSON.stringify(feedback)}`);

    return (feedback.blacks === 4)
      ? state.numAttempts
      : loop({
        autoSolveSet: result.autoSolveSet,
        autoSolveUsed: result.autoSolveUsed,
        lastGuess: result.guess,
        lastGuessFeedback: feedback,
        numAttempts: state.numAttempts + 1
      });
  };

  return loop({
    autoSolveSet: ALL_COMBINATIONS,
    autoSolveUsed: [],
    lastGuess: null,
    lastGuessFeedback: null,
    numAttempts: 1
  });
};

export const runAutoSolve = () => {
  const secret = generateRandomCode();
  console.log(`secret: ${codeToString(secret)}`);
  const numAttempts = autoSolve(secret);
  console.log(`numAttempts: ${numAttempts}`);
};
