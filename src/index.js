import { generateRandomCode } from './mastermindCommon'
import { mastermindCpu } from './mastermindCpu'
import { mastermindGpu } from './mastermindGpu'

const secret = generateRandomCode()

console.log('-'.repeat(80))
mastermindCpu(secret)

console.log('-'.repeat(80))
mastermindGpu(secret)
