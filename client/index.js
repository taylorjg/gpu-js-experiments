import GPU from 'gpu.js';
const gpu = new GPU();

const myFunc = gpu.createKernel(function(x) {
  return x[this.thread.x % 3];
}).setOutput([100]);

const result = myFunc([1, 2, 3]);
console.log(`result: ${JSON.stringify(result)}`);
