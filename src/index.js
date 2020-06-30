import { GPU } from 'gpu.js'
import { generateRandomCode } from './mastermindCommon'
import { mastermindCpu } from './mastermindCpu'
import { mastermindGpu } from './mastermindGpu'
import * as U from './utils'

const onRun = loggers => {
  runElement.disabled = true
  cpuOutputElement.innerText = ''
  gpuOutputElement.innerText = ''
  U.deferFor(10, () => {
    try {
      const secret = generateRandomCode()
      mastermindCpu(secret, loggers.cpuLogger)
      mastermindGpu(secret, loggers.gpuLogger)
    } catch (error) {
      sysOutputElement.innerText = ''
      loggers.sysLogger(error)
      if (error.stack) {
        loggers.sysLogger(error.stack)
      }
    } finally {
      U.defer(() => { runElement.disabled = false })
    }
  })
}

const cpuOutputElement = document.getElementById('cpu-output')
const gpuOutputElement = document.getElementById('gpu-output')
const sysOutputElement = document.getElementById('sys-output')

const loggers = {
  cpuLogger: U.makeLogger(cpuOutputElement),
  gpuLogger: U.makeLogger(gpuOutputElement),
  sysLogger: U.makeLogger(sysOutputElement)
}

const runElement = document.getElementById('run')
runElement.addEventListener('click', () => onRun(loggers))

loggers.sysLogger(`GPU.isGPUSupported: ${GPU.isGPUSupported}`)
loggers.sysLogger(`GPU.isWebGLSupported: ${GPU.isWebGLSupported}`)
loggers.sysLogger(`GPU.isWebGL2Supported: ${GPU.isWebGL2Supported}`)
loggers.sysLogger(`GPU.isSinglePrecisionSupported: ${GPU.isSinglePrecisionSupported}`)

onRun(loggers)
