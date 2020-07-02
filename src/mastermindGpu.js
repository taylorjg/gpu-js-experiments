import PromiseWorker from 'promise-worker'
import { evaluateScore, solve, codeToString } from './mastermindCommon'

const webWorker = new Worker('./mastermindGpuWebWorker.js', { type: 'module' })
const webWorkerP = new PromiseWorker(webWorker)

const calculateNewGuess = untried => {
  return webWorkerP.postMessage({ type: 'calculateNewGuess', untried })
}

export const mastermindGpu = async (secret, logger) => {
  logger(`secret: ${codeToString(secret)}`)
  const attempt = guess => evaluateScore(secret, guess)
  const history = await solve(logger, attempt, calculateNewGuess)
  logger(`numAttempts: ${history.length}`)
}
