import PromiseWorker from 'promise-worker'

const webWorker = new Worker('./mastermindCpuWebWorker.js', { type: 'module' })
const webWorkerP = new PromiseWorker(webWorker)

export const calculateNewGuessCpu = untried =>
  webWorkerP.postMessage({ type: 'calculateNewGuess', untried })
