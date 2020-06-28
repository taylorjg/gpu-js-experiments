import { GPU } from 'gpu.js'
const gpu = new GPU()

const f = gpu.createKernel(function (x) {
  return x[this.thread.x % 3]
}).setOutput([100])

export const runBasicExample = () => {
  const result = f([1, 2, 3])
  console.log(`result: ${JSON.stringify(result)}`)
}
