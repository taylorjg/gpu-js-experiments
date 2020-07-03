import { GPU } from 'gpu.js'
import { randomSecret, solve } from './mastermindCommon'
import { calculateNewGuessCpu } from './mastermindCpu'
import { calculateNewGuessGpu } from './mastermindGpu'
import * as U from './utils'

const onRun = async loggers => {
  runElement.disabled = true
  try {
    const { cpuLogger, gpuLogger } = loggers
    cpuOutputElement.innerText = ''
    gpuOutputElement.innerText = ''
    const secret = randomSecret()
    const cpuPromise = solve(cpuLogger, secret, calculateNewGuessCpu).catch(cpuLogger)
    const gpuPromise = solve(gpuLogger, secret, calculateNewGuessGpu).catch(gpuLogger)
    await Promise.all([cpuPromise, gpuPromise])
  } finally {
    runElement.disabled = false
  }
}

const cpuOutputElement = document.getElementById('cpu-output')
const gpuOutputElement = document.getElementById('gpu-output')
const sysOutputElement = document.getElementById('sys-output')

const loggers = {
  cpuLogger: U.makeLogger(cpuOutputElement),
  gpuLogger: U.makeLogger(gpuOutputElement),
  sysLogger: U.makeLoggerNoTimestamp(sysOutputElement)
}

const runElement = document.getElementById('run')
runElement.addEventListener('click', () => onRun(loggers))

loggers.sysLogger(`GPU.isGPUSupported: ${GPU.isGPUSupported}`)
loggers.sysLogger(`GPU.isWebGLSupported: ${GPU.isWebGLSupported}`)
loggers.sysLogger(`GPU.isWebGL2Supported: ${GPU.isWebGL2Supported}`)
loggers.sysLogger(`GPU.isSinglePrecisionSupported: ${GPU.isSinglePrecisionSupported}`)

onRun(loggers)
