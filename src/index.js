import { generateRandomCode } from './mastermindCommon'
import { mastermindCpu } from './mastermindCpu'
import { mastermindGpu } from './mastermindGpu'
import * as U from './utils'

const onRun = () => {
  runElement.disabled = true
  cpuOutputElement.innerText = ''
  gpuOutputElement.innerText = ''
  U.deferFor(10, () => {
    try {
      const secret = generateRandomCode()
      mastermindCpu(secret, cpuOutputElement)
      mastermindGpu(secret, gpuOutputElement)
    } catch (error) {
      console.log(error)
    } finally {
      U.defer(() => { runElement.disabled = false })
    }
  })
}

const cpuOutputElement = document.getElementById('cpu-output')
const gpuOutputElement = document.getElementById('gpu-output')
const runElement = document.getElementById('run')
runElement.addEventListener('click', onRun)

onRun()
