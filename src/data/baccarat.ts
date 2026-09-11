import type { Card, ShoeComposition } from '../types'

export const RANKS = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
] as const

const SUITS = ['♠', '♥', '♦', '♣']

export function baccaratValue(rank: string): number {
  if (rank === 'A') return 1
  if (['10', 'J', 'Q', 'K'].includes(rank)) return 0

  return Number(rank)
}

export function createEightDeckShoe(): Card[] {
  const shoe: Card[] = []

  for (let deckId = 1; deckId <= 8; deckId++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        shoe.push({
          rank: `${rank}${suit}`,
          value: baccaratValue(rank),
          deckId,
        })
      }
    }
  }

  return shoe
}

export function getShoeComposition(shoe: Card[]): ShoeComposition {
  const rankCounts: Record<string, number> = {}
  const valueCounts: Record<number, number> = {}

  for (const card of shoe) {
    rankCounts[card.rank] = (rankCounts[card.rank] ?? 0) + 1
    valueCounts[card.value] = (valueCounts[card.value] ?? 0) + 1
  }

  return {
    totalCards: 416,
    cardsRemaining: shoe.length,
    rankCounts,
    valueCounts,
  }
}
