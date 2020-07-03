export const range = n =>
  Array.from(Array(n).keys())

export const flatten = xss =>
  [].concat(...xss)

export const countWithPredicate = (xs, p) =>
  xs.reduce((acc, x) => acc + (p(x) ? 1 : 0), 0)

export const makeLogger = outputElement => message => {
  const timestamp = new Date().toLocaleTimeString()
  const timestampedMessage = `${timestamp}: ${message}`
  const existingText = outputElement.innerText
  outputElement.innerText = existingText
    ? [existingText, timestampedMessage].join('\n')
    : timestampedMessage
  console.log(timestampedMessage)
}

export const makeLoggerNoTimestamp = outputElement => message => {
  const existingText = outputElement.innerText
  outputElement.innerText = existingText
    ? [existingText, message].join('\n')
    : message
  console.log(message)
}

export const defer = thunk =>
  deferFor(0, thunk)

export const deferFor = (ms, thunk) =>
  setTimeout(thunk, ms)
