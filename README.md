# Description

I created a Mastermind web app using Vue.js (code repo [here](https://github.com/taylorjg/mastermind-svg-vue) and play it live [here](https://mastermind-svg-vue.herokuapp.com/)) including an [autosolve](https://mastermind-svg-vue.herokuapp.com?autosolve) mode which is an implementation of 
[Donald Knuth's Five-guess algorithm](https://en.wikipedia.org/wiki/Mastermind_(board_game)#Worst_case:_Five-guess_algorithm). I used [Hamsters.js](https://gitlab.com/hordesolutions/Hamsters.js) to try to speed up the algorithm. The idea of this repo is to experiment with [gpu.js](http://gpu.rocks/) with a view to speeding up the implementation of the algorithm even further.

# TODO

* Run cpu/gpu solve on web workers
* Make a nicer UI

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
