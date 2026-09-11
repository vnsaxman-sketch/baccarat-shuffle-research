import type { Card } from '../types'

export function fairShuffle(cards: Card[]): Card[] {
  const result = [...cards]

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }

  return result
}

export function cloneShoe(cards: Card[]): Card[] {
  return cards.map((card) => ({ ...card }))
}

export function cutShoe(cards: Card[], cutPosition = 14): Card[] {
  if (cards.length <= cutPosition) {
    return [...cards]
  }

  return [
    ...cards.slice(cutPosition),
    ...cards.slice(0, cutPosition),
  ]
}
