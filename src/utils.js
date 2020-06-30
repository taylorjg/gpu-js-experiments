export const range = n =>
  Array.from(Array(n).keys())

export const countWithPredicate = (xs, p) =>
  xs.reduce((acc, x) => acc + (p(x) ? 1 : 0), 0)
