import { runBasicExample } from './basicExample'
import { generateRandomCode } from './mastermindCommon'
import { mastermindCpu } from './mastermindCpu'
import { mastermindGpu } from './mastermindGpu'

runBasicExample()

const secret = generateRandomCode()

console.log('-'.repeat(80))
mastermindCpu(secret)

console.log('-'.repeat(80))
mastermindGpu(secret)
