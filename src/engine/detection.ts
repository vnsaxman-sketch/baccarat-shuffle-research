import type {
  DetectionResult,
  HandResult,
} from '../types'
import {
  approximatePValue,
  chiSquareStatistic,
  calculateCorrelation,
  runsStatistic,
} from '../utils/statistics'

export function detectDeviation(
  fairHands: HandResult[],
  testHands: HandResult[],
): DetectionResult {
  const fairCounts = [
    fairHands.filter(
      (hand) => hand.outcome === 'PLAYER',
    ).length,

    fairHands.filter(
      (hand) => hand.outcome === 'BANKER',
    ).length,

    fairHands.filter(
      (hand) => hand.outcome === 'TIE',
    ).length,
  ]

  const testCounts = [
    testHands.filter(
      (hand) => hand.outcome === 'PLAYER',
    ).length,

    testHands.filter(
      (hand) => hand.outcome === 'BANKER',
    ).length,

    testHands.filter(
      (hand) => hand.outcome === 'TIE',
    ).length,
  ]

  const totalFair = Math.max(
    1,
    fairCounts.reduce((a, b) => a + b, 0),
  )

  const totalTest = Math.max(
    1,
    testCounts.reduce((a, b) => a + b, 0),
  )

  const expected = fairCounts.map(
    (count) => (count / totalFair) * totalTest,
  )

  const chiSquare = chiSquareStatistic(
    testCounts,
    expected,
  )

  const pApproximation = approximatePValue(
    chiSquare,
    2,
  )

  const fairSequence = fairHands.map((hand) =>
    hand.outcome === 'PLAYER'
      ? 1
      : hand.outcome === 'BANKER'
        ? 2
        : 3,
  )

  const testSequence = testHands.map((hand) =>
    hand.outcome === 'PLAYER'
      ? 1
      : hand.outcome === 'BANKER'
        ? 2
        : 3,
  )

  const serialCorrelation =
    fairSequence.length > 1 &&
    testSequence.length > 1
      ? calculateCorrelation(
          testSequence.slice(0, -1),
          testSequence.slice(1),
        )
      : 0

  const runs = runsStatistic(testSequence)

  const fairPlayerRate =
    fairCounts[0] / totalFair

  const testPlayerRate =
    testCounts[0] / totalTest

  const outcomeDifference =
    Math.abs(testPlayerRate - fairPlayerRate)

  const suspicious =
    pApproximation < 0.05 ||
    outcomeDifference > 0.08

  let explanation =
    'The simulated test does not show a strong deviation from the fair baseline.'

  if (suspicious) {
    explanation =
      'The simulated test shows a statistical deviation from the fair baseline. This does not prove real-world manipulation; it indicates that the simulated sample deserves further investigation.'
  }

  return {
    chiSquare,
    degreesOfFreedom: 2,
    pApproximation,
    suspicious,
    outcomeDifference,
    serialCorrelation,
    runsStatistic: runs,
    explanation,
  }
}
