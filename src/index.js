import { runBasicExample } from './basicExample'
import { generateRandomCode } from './mastermindCommon'
// import { mastermindWithoutGpu } from './mastermindWithoutGpu'
import { mastermindWithGpu } from './mastermindWithGpu'

runBasicExample()

const secret = generateRandomCode()

// console.log('-'.repeat(80))
// mastermindWithoutGpu(secret)

console.log('-'.repeat(80))
mastermindWithGpu(secret)
