import type {
  PlayerProfile,
  SimulationSummary,
} from '../types'
import { runFairModel } from './fairModel'
import { runAdversarialModel } from './adversarialModel'
import { calculateStandardDeviation } from '../utils/statistics'

export function simulateManyShoes(
  profile: PlayerProfile,
  model: 'fair' | 'adversarial',
  shoeCount: number,
): SimulationSummary {
  let playerCount = 0
  let bankerCount = 0
  let tieCount = 0
  let totalProfit = 0
  let totalHands = 0

  const profits: number[] = []

  for (let i = 0; i < shoeCount; i++) {
    const result =
      model === 'fair'
        ? runFairModel(profile)
        : runAdversarialModel(profile)

    playerCount += result.outcomeCounts.PLAYER
    bankerCount += result.outcomeCounts.BANKER
    tieCount += result.outcomeCounts.TIE

    totalProfit += result.totalProfit
    totalHands += result.hands.length

    profits.push(
      ...result.hands.map(
        (hand) => hand.profit,
      ),
    )
  }

  return {
    shoes: shoeCount,
    hands: totalHands,
    playerCount,
    bankerCount,
    tieCount,
    totalProfit,
    averageProfitPerHand:
      totalHands > 0
        ? totalProfit / totalHands
        : 0,
    standardDeviation:
      calculateStandardDeviation(profits),
    playerRate:
      totalHands > 0
        ? playerCount / totalHands
        : 0,
    bankerRate:
      totalHands > 0
        ? bankerCount / totalHands
        : 0,
    tieRate:
      totalHands > 0
        ? tieCount / totalHands
        : 0,
  }
}
