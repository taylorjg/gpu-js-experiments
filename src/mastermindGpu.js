import PromiseWorker from 'promise-worker'

const webWorker = new Worker('./mastermindGpuWebWorker.js', { type: 'module' })
const webWorkerP = new PromiseWorker(webWorker)

export const calculateNewGuessGpu = untried =>
  webWorkerP.postMessage({ type: 'calculateNewGuess', untried })
