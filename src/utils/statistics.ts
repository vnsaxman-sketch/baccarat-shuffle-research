export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0

  return (
    values.reduce((sum, value) => sum + value, 0) /
    values.length
  )
}

export function calculateVariance(values: number[]): number {
  if (values.length === 0) return 0

  const mean = calculateMean(values)

  return (
    values.reduce(
      (sum, value) =>
        sum + Math.pow(value - mean, 2),
      0,
    ) / values.length
  )
}

export function calculateStandardDeviation(
  values: number[],
): number {
  return Math.sqrt(calculateVariance(values))
}

export function calculateCorrelation(
  x: number[],
  y: number[],
): number {
  const n = Math.min(x.length, y.length)

  if (n < 2) return 0

  const xValues = x.slice(0, n)
  const yValues = y.slice(0, n)

  const xMean = calculateMean(xValues)
  const yMean = calculateMean(yValues)

  let numerator = 0
  let xDenominator = 0
  let yDenominator = 0

  for (let i = 0; i < n; i++) {
    const dx = xValues[i] - xMean
    const dy = yValues[i] - yMean

    numerator += dx * dy
    xDenominator += dx * dx
    yDenominator += dy * dy
  }

  const denominator =
    Math.sqrt(xDenominator * yDenominator)

  if (denominator === 0) return 0

  return numerator / denominator
}

export function chiSquareStatistic(
  observed: number[],
  expected: number[],
): number {
  let statistic = 0

  for (let i = 0; i < observed.length; i++) {
    if (expected[i] <= 0) continue

    statistic +=
      Math.pow(observed[i] - expected[i], 2) /
      expected[i]
  }

  return statistic
}

export function approximatePValue(
  chiSquare: number,
  degreesOfFreedom: number,
): number {
  if (degreesOfFreedom <= 0) return 1

  /*
   * Lightweight approximation suitable for this
   * browser-based educational simulator.
   */

  const x = Math.max(0, chiSquare)

  const scale = degreesOfFreedom * 2

  return Math.exp(-x / scale)
}

export function runsStatistic(
  sequence: number[],
): number {
  if (sequence.length < 2) return 0

  let runs = 1

  for (let i = 1; i < sequence.length; i++) {
    if (sequence[i] !== sequence[i - 1]) {
      runs++
    }
  }

  return runs
}
