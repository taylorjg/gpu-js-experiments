# Description

Experiment to see how fast we can solve Mastermind using [Donald Knuth's Five-guess algorithm](https://en.wikipedia.org/wiki/Mastermind_(board_game)#Worst_case:_Five-guess_algorithm) in JavaScript and [gpu.js](http://gpu.rocks/).

# TODO

* [x] Use web workers to run CPU and GPU modes simultaneously

# Timings

In Chrome on my MacBook Pro, typcical timings are roughly:

| Mode | Run | Duration |
| ---- | --- | -- |
| CPU | Any | 600ms |
| GPU | First | 300ms |
| GPU | Subsequent | 60ms |

I think the first GPU run has to compile the kernel so it takes longer than subsequent runs.
Other than that, it looks like the GPU mode runs about 10 times quicker than the CPU mode.

# Browsers

It works fine in Chrome and Firefox on my MacBook Pro. However, it fails in Safari:

```
Error: argument bit ratio not found
lookupFunctionArgumentBitRatio@http://localhost:8082/bundle.js:7651:22
astMemberExpression@http://localhost:8082/bundle.js:13602:48
astCallExpression@http://localhost:8082/bundle.js:13728:30
astVariableDeclaration@http://localhost:8082/bundle.js:13240:26
astBlockStatement@http://localhost:8082/bundle.js:13166:24
astForStatement@http://localhost:8082/bundle.js:13066:22
astBlockStatement@http://localhost:8082/bundle.js:13166:24
astForStatement@http://localhost:8082/bundle.js:13066:22
astFunction@http://localhost:8082/bundle.js:12576:22
toString@http://localhost:8082/bundle.js:8020:42
traceFunctionCalls@http://localhost:8082/bundle.js:7460:30
traceFunctionCalls@http://localhost:8082/bundle.js:7462:34
getPrototypes@http://localhost:8082/bundle.js:7482:73
getPrototypeString@http://localhost:8082/bundle.js:7474:30
translateSource@http://localhost:8082/bundle.js:15749:63
build@http://localhost:8082/bundle.js:15641:25
run@http://localhost:8082/bundle.js:19167:23
shortcut@http://localhost:8082/bundle.js:19187:21
calculateNewGuess@http://localhost:8082/bundle.js:29592:23
recursiveSolveStep@http://localhost:8082/bundle.js:29422:58
solve@http://localhost:8082/bundle.js:29433:37
mastermindGpu@http://localhost:8082/bundle.js:29602:82
http://localhost:8082/bundle.js:29283:75
```

# Links

* [Donald Knuth's Five-guess algorithm](https://en.wikipedia.org/wiki/Mastermind_(board_game)#Worst_case:_Five-guess_algorithm)
* [gpu.js - GPU Accelerated JavaScript](http://gpu.rocks/)
* [Implementation of Five-guess algorithm in Swift/Metal](https://github.com/taylorjg/mastermind-swift)
* [Mastermind web app using SVG and Vue.js](https://mastermind-svg-vue.herokuapp.com)
  * [Autosolve mode (using a web worker)](https://mastermind-svg-vue.herokuapp.com?autosolve)
  * [Code repo](https://github.com/taylorjg/mastermind-svg-vue)
