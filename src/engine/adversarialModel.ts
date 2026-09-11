import {
  createEightDeckShoe,
  getShoeComposition,
} from '../data/baccarat'
import type {
  BettingPreference,
  Card,
  HandResult,
  ModelResult,
  PlayerProfile,
} from '../types'
import { dealBaccaratHand } from './baccarat'
import { fairShuffle, cutShoe } from './shuffle'
import { calculateStandardDeviation } from '../utils/statistics'

function estimateCardImpact(card: Card): number {
  if (card.value === 0) return 0.15
  if (card.value === 1) return -0.05
  if (card.value >= 7) return 0.08

  return 0
}

function scoreCardForPlayer(
  card: Card,
  profile: PlayerProfile,
): number {
  let score = estimateCardImpact(card)

  if (profile.preferredBet === 'PLAYER') {
    score += card.value >= 6 ? 0.18 : 0
  }

  if (profile.preferredBet === 'BANKER') {
    score += card.value <= 5 ? 0.12 : 0
  }

  if (profile.preferredBet === 'TIE') {
    score += card.value === 0 ? 0.05 : 0
  }

  score +=
    profile.streakFollowing * 0.02 *
    (card.value >= 7 ? 1 : 0)

  return score
}

function simulatedAdversarialOrdering(
  shoe: Card[],
  profile: PlayerProfile,
): Card[] {
  const randomized = fairShuffle(shoe)

  /*
   * RESEARCH-ONLY SIMULATION:
   *
   * We are modeling an artificial adversarial system that
   * scores cards based on a synthetic player profile.
   *
   * This does not connect to casino hardware and should not
   * be interpreted as a method for manipulating a real shoe.
   */

  const strength = Math.min(
    1,
    Math.max(
      0,
      profile.aggression * 0.5 +
        profile.streakFollowing * 0.3 +
        profile.zigzagFollowing * 0.2,
    ),
  )

  return randomized.sort((a, b) => {
    const aScore =
      scoreCardForPlayer(a, profile) * strength

    const bScore =
      scoreCardForPlayer(b, profile) * strength

    const noise =
      (Math.random() - 0.5) * 0.5

    return bScore - aScore + noise
  })
}

function chooseBet(
  profile: PlayerProfile,
  previous: HandResult | undefined,
): BettingPreference {
  if (
    profile.preferredBet === 'FOLLOW_STREAK' &&
    previous
  ) {
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

  return profile.preferredBet
}

export function runAdversarialModel(
  profile: PlayerProfile,
  maxHands = 80,
): ModelResult {
  const originalShoe = createEightDeckShoe()

  const biasedShoe = simulatedAdversarialOrdering(
    originalShoe,
    profile,
  )

  const shoe = cutShoe(biasedShoe, 14)

  const hands: HandResult[] = []

  for (
    let i = 1;
    i <= maxHands && shoe.length >= 12;
    i++
  ) {
    const previous = hands[hands.length - 1]

    const bet = chooseBet(profile, previous)

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

  return {
    modelName: 'Model 2 — Biased or Adversarial Simulation',
    hands,
    outcomeCounts: {
      PLAYER: playerCount,
      BANKER: bankerCount,
      TIE: tieCount,
    },
    totalProfit,
    averageProfitPerHand:
      hands.length > 0 ? totalProfit / hands.length : 0,
    standardDeviation: calculateStandardDeviation(
      hands.map((hand) => hand.profit),
    ),
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
