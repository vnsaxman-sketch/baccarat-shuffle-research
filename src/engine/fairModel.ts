import { createEightDeckShoe, getShoeComposition } from '../data/baccarat'
import type {
  BettingPreference,
  HandResult,
  ModelResult,
  PlayerProfile,
} from '../types'
import { dealBaccaratHand } from './baccarat'
import { cutShoe, fairShuffle } from './shuffle'
import { calculateStandardDeviation } from '../utils/statistics'

function selectBet(
  profile: PlayerProfile,
  previous: HandResult | undefined,
): BettingPreference {
  if (profile.preferredBet === 'FOLLOW_STREAK' && previous) {
    return previous.outcome === 'TIE'
      ? 'BANKER'
      : previous.outcome
  }

  if (
    profile.preferredBet === 'FOLLOW_ZIGZAG' &&
    previous
  ) {
    return previous.outcome === 'PLAYER'
      ? 'BANKER'
      : 'PLAYER'
  }

  if (profile.preferredBet !== 'RANDOM') {
    return profile.preferredBet
  }

  const random = Math.random() * 100

  if (random < profile.playerBetPercent) {
    return 'PLAYER'
  }

  if (
    random <
    profile.playerBetPercent + profile.bankerBetPercent
  ) {
    return 'BANKER'
  }

  return 'TIE'
}

export function runFairModel(
  profile: PlayerProfile,
  maxHands = 80,
): ModelResult {
  const originalShoe = createEightDeckShoe()
  const shoe = cutShoe(fairShuffle(originalShoe), 14)

  const hands: HandResult[] = []

  for (let i = 1; i <= maxHands && shoe.length >= 12; i++) {
    const previous = hands[hands.length - 1]

    const bet = selectBet(profile, previous)

    const wager =
      profile.averageWager *
      (0.75 + Math.random() * profile.aggression * 0.75)

    hands.push(
      dealBaccaratHand(
        shoe,
        i,
        bet,
        wager,
      ),
    )
  }

  const playerCount = hands.filter(
    (hand) => hand.outcome === 'PLAYER',
  ).length

  const bankerCount = hands.filter(
    (hand) => hand.outcome === 'BANKER',
  ).length

  const tieCount = hands.filter(
    (hand) => hand.outcome === 'TIE',
  ).length

  const totalProfit = hands.reduce(
    (sum, hand) => sum + hand.profit,
    0,
  )

  const profits = hands.map((hand) => hand.profit)

  return {
    modelName: 'Model 1 — Fair Shuffle',
    hands,
    outcomeCounts: {
      PLAYER: playerCount,
      BANKER: bankerCount,
      TIE: tieCount,
    },
    totalProfit,
    averageProfitPerHand:
      hands.length > 0 ? totalProfit / hands.length : 0,
    standardDeviation: calculateStandardDeviation(profits),
    winRate:
      hands.length > 0
        ? hands.filter((hand) => hand.profit > 0).length /
          hands.length
        : 0,
    playerOutcomeRate:
      hands.length > 0 ? playerCount / hands.length : 0,
    bankerOutcomeRate:
      hands.length > 0 ? bankerCount / hands.length : 0,
    tieRate:
      hands.length > 0 ? tieCount / hands.length : 0,
    shoeComposition: getShoeComposition(shoe),
  }
}
