import PromiseWorker from 'promise-worker'

const worker = new Worker('./mastermindCpuWebWorker.js', { type: 'module' })
const promiseWorker = new PromiseWorker(worker)

export const calculateNewGuessCpu = untried =>
  promiseWorker.postMessage({ type: 'calculateNewGuess', untried })
