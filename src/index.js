import { GPU } from 'gpu.js'
import { generateRandomCode } from './mastermindCommon'
import { mastermindCpu } from './mastermindCpu'
import { mastermindGpu } from './mastermindGpu'
import * as U from './utils'

const onRun = async loggers => {
  runElement.disabled = true
  try {
    cpuOutputElement.innerText = ''
    gpuOutputElement.innerText = ''
    const secret = generateRandomCode()
    const cpuPromise = mastermindCpu(secret, loggers.cpuLogger)
    const gpuPromise = mastermindGpu(secret, loggers.gpuLogger)
    await Promise.all([cpuPromise, gpuPromise])
  } catch (error) {
    console.log(error)
    error.stack && console.log(error.stack)
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
  sysLogger: U.makeLogger(sysOutputElement)
}

const runElement = document.getElementById('run')
runElement.addEventListener('click', () => onRun(loggers))

loggers.sysLogger(`GPU.isGPUSupported: ${GPU.isGPUSupported}`)
loggers.sysLogger(`GPU.isWebGLSupported: ${GPU.isWebGLSupported}`)
loggers.sysLogger(`GPU.isWebGL2Supported: ${GPU.isWebGL2Supported}`)
loggers.sysLogger(`GPU.isSinglePrecisionSupported: ${GPU.isSinglePrecisionSupported}`)

onRun(loggers)
