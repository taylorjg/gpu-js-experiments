/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/mastermindCpuWebWorker.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/promise-worker/register.js":
/*!*************************************************!*\
  !*** ./node_modules/promise-worker/register.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function isPromise (obj) {
  // via https://unpkg.com/is-promise@2.1.0/index.js
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}

function registerPromiseWorker (callback) {
  function postOutgoingMessage (e, messageId, error, result) {
    function postMessage (msg) {
      /* istanbul ignore if */
      if (typeof self.postMessage !== 'function') { // service worker
        e.ports[0].postMessage(msg)
      } else { // web worker
        self.postMessage(msg)
      }
    }
    if (error) {
      /* istanbul ignore else */
      if (typeof console !== 'undefined' && 'error' in console) {
        // This is to make errors easier to debug. I think it's important
        // enough to just leave here without giving the user an option
        // to silence it.
        console.error('Worker caught an error:', error)
      }
      postMessage([messageId, {
        message: error.message
      }])
    } else {
      postMessage([messageId, null, result])
    }
  }

  function tryCatchFunc (callback, message) {
    try {
      return { res: callback(message) }
    } catch (e) {
      return { err: e }
    }
  }

  function handleIncomingMessage (e, callback, messageId, message) {
    var result = tryCatchFunc(callback, message)

    if (result.err) {
      postOutgoingMessage(e, messageId, result.err)
    } else if (!isPromise(result.res)) {
      postOutgoingMessage(e, messageId, null, result.res)
    } else {
      result.res.then(function (finalResult) {
        postOutgoingMessage(e, messageId, null, finalResult)
      }, function (finalError) {
        postOutgoingMessage(e, messageId, finalError)
      })
    }
  }

  function onIncomingMessage (e) {
    var payload = e.data
    if (!Array.isArray(payload) || payload.length !== 2) {
      // message doens't match communication format; ignore
      return
    }
    var messageId = payload[0]
    var message = payload[1]

    if (typeof callback !== 'function') {
      postOutgoingMessage(e, messageId, new Error(
        'Please pass a function into register().'))
    } else {
      handleIncomingMessage(e, callback, messageId, message)
    }
  }

  self.addEventListener('message', onIncomingMessage)
}

module.exports = registerPromiseWorker


/***/ }),

/***/ "./src/mastermindCommon.js":
/*!*********************************!*\
  !*** ./src/mastermindCommon.js ***!
  \*********************************/
/*! exports provided: P, ALL_PEGS, ALL_CODES, ALL_SCORES, codeToString, scoreToString, INITIAL_GUESS, randomSecret, evaluateScore, sameScore, evaluatesToSameScore, solve */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "P", function() { return P; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ALL_PEGS", function() { return ALL_PEGS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ALL_CODES", function() { return ALL_CODES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ALL_SCORES", function() { return ALL_SCORES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "codeToString", function() { return codeToString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scoreToString", function() { return scoreToString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "INITIAL_GUESS", function() { return INITIAL_GUESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "randomSecret", function() { return randomSecret; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "evaluateScore", function() { return evaluateScore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sameScore", function() { return sameScore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "evaluatesToSameScore", function() { return evaluatesToSameScore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "solve", function() { return solve; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.js");


const P = {
  R: 0,
  G: 1,
  B: 2,
  Y: 3,
  BL: 4,
  WH: 5
}

const ALL_PEGS = Object.values(P)

const ALL_CODES =
  Array.from(function* () {
    for (const p0 of ALL_PEGS)
      for (const p1 of ALL_PEGS)
        for (const p2 of ALL_PEGS)
          for (const p3 of ALL_PEGS)
            yield [p0, p1, p2, p3]
  }())

const ALL_SCORES =
  Array.from(function* () {
    for (const blacks of _utils__WEBPACK_IMPORTED_MODULE_0__["range"](5))
      for (const whites of _utils__WEBPACK_IMPORTED_MODULE_0__["range"](5 - blacks))
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

const codeToString = code =>
  code.map(pegToString).join('-')

const scoreToString = score =>
  'B'.repeat(score.blacks) + 'W'.repeat(score.whites)

const INITIAL_GUESS = [P.R, P.R, P.G, P.G]

const randomSecret = () => {
  const chooseRandomPeg = () => {
    const randomIndex = Math.floor((Math.random() * ALL_PEGS.length))
    return ALL_PEGS[randomIndex]
  }
  return _utils__WEBPACK_IMPORTED_MODULE_0__["range"](4).map(chooseRandomPeg)
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

const evaluateScore = (code1, code2) => {
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

const sameScore = (score1, score2) =>
  score1.blacks === score2.blacks &&
  score1.whites === score2.whites

const evaluatesToSameScore = (code1, score) => code2 =>
  sameScore(evaluateScore(code1, code2), score)

const recursiveSolveStep = async (logger, attempt, calculateNewGuess, untried, history) => {
  logger(`untried length: ${untried.length}`)
  const guess = history.length === 0 ? INITIAL_GUESS :
    untried.length === 1 ? untried[0] : await calculateNewGuess(untried)
  const score = attempt(guess)
  logger(`guess: ${codeToString(guess)}; score: ${scoreToString(score)}`)
  const newHistory = [...history, { guess, score }]
  if (score.blacks === 4) return newHistory
  const newUntried = untried.filter(evaluatesToSameScore(guess, score))
  return recursiveSolveStep(logger, attempt, calculateNewGuess, newUntried, newHistory)
}

const solve = async (logger, secret, calculateNewGuess) => {
  logger(`secret: ${codeToString(secret)}`)
  const attempt = guess => evaluateScore(secret, guess)
  const start = performance.now()
  const history = await recursiveSolveStep(logger, attempt, calculateNewGuess, ALL_CODES, [])
  const end = performance.now()
  logger(`numAttempts: ${history.length}`)
  logger(`duration: ${(end - start).toFixed(2)}ms`)
}


/***/ }),

/***/ "./src/mastermindCpuWebWorker.js":
/*!***************************************!*\
  !*** ./src/mastermindCpuWebWorker.js ***!
  \***************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var promise_worker_register__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! promise-worker/register */ "./node_modules/promise-worker/register.js");
/* harmony import */ var promise_worker_register__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(promise_worker_register__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mastermindCommon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mastermindCommon */ "./src/mastermindCommon.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.js");




const onCalculateNewGuess = untried => {
  const initialBest = { count: Number.MAX_VALUE, guess: undefined }
  const best = _mastermindCommon__WEBPACK_IMPORTED_MODULE_1__["ALL_CODES"].reduce((currentBest, allCode) => {
    const maxCount = _mastermindCommon__WEBPACK_IMPORTED_MODULE_1__["ALL_SCORES"].reduce((currentMax, allScore) => {
      const count = _utils__WEBPACK_IMPORTED_MODULE_2__["countWithPredicate"](untried, Object(_mastermindCommon__WEBPACK_IMPORTED_MODULE_1__["evaluatesToSameScore"])(allCode, allScore))
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

promise_worker_register__WEBPACK_IMPORTED_MODULE_0___default()(processMessage)


/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! exports provided: range, flatten, countWithPredicate, makeLogger, defer, deferFor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "range", function() { return range; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flatten", function() { return flatten; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "countWithPredicate", function() { return countWithPredicate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeLogger", function() { return makeLogger; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defer", function() { return defer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deferFor", function() { return deferFor; });
const range = n =>
  Array.from(Array(n).keys())

const flatten = xss =>
  [].concat(...xss)

const countWithPredicate = (xs, p) =>
  xs.reduce((acc, x) => acc + (p(x) ? 1 : 0), 0)

const makeLogger = outputElement => message => {
  const timestamp = new Date().toLocaleTimeString()
  const timestampedMessage = `${timestamp}: ${message}`
  const existingText = outputElement.innerText
  outputElement.innerText = existingText
    ? [existingText, timestampedMessage].join('\n')
    : timestampedMessage
  console.log(timestampedMessage)
}

const defer = thunk =>
  deferFor(0, thunk)

const deferFor = (ms, thunk) =>
  setTimeout(thunk, ms)


/***/ })

/******/ });
//# sourceMappingURL=0.bundle.worker.js.map