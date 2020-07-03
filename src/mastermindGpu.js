import PromiseWorker from 'promise-worker'

const worker = new Worker('./mastermindGpuWebWorker.js', { type: 'module' })
const promiseWorker = new PromiseWorker(worker)

export const calculateNewGuessGpu = untried =>
  promiseWorker.postMessage({ type: 'calculateNewGuess', untried })
