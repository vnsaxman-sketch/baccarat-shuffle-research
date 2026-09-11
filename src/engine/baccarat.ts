import type {
  BaccaratOutcome,
  BettingPreference,
  Card,
  HandResult,
} from '../types'

function baccaratTotal(cards: Card[]): number {
  return cards.reduce((sum, card) => sum + card.value, 0) % 10
}

function shouldPlayerDraw(total: number): boolean {
  return total <= 5
}

function shouldBankerDraw(
  bankerTotal: number,
  playerThirdCard: Card | undefined,
): boolean {
  if (!playerThirdCard) {
    return bankerTotal <= 5
  }

  const third = playerThirdCard.value

  if (bankerTotal <= 2) return true
  if (bankerTotal === 3) return third !== 8
  if (bankerTotal === 4) return third >= 2 && third <= 7
  if (bankerTotal === 5) return third >= 4 && third <= 7
  if (bankerTotal === 6) return third === 6 || third === 7

  return false
}

export function dealBaccaratHand(
  shoe: Card[],
  handNumber: number,
  bet: BettingPreference,
  wager: number,
): HandResult {
  const playerCards: Card[] = []
  const bankerCards: Card[] = []

  const draw = (): Card => {
    const card = shoe.shift()

    if (!card) {
      throw new Error('Shoe exhausted')
    }

    return card
  }

  playerCards.push(draw())
  bankerCards.push(draw())
  playerCards.push(draw())
  bankerCards.push(draw())

  let playerTotal = baccaratTotal(playerCards)
  let bankerTotal = baccaratTotal(bankerCards)

  const natural =
    playerTotal >= 8 ||
    bankerTotal >= 8

  let playerThirdCard: Card | undefined

  if (!natural) {
    if (shouldPlayerDraw(playerTotal)) {
      playerThirdCard = draw()
      playerCards.push(playerThirdCard)
      playerTotal = baccaratTotal(playerCards)
    }

    if (shouldBankerDraw(bankerTotal, playerThirdCard)) {
      bankerCards.push(draw())
      bankerTotal = baccaratTotal(bankerCards)
    }
  }

  let outcome: BaccaratOutcome

  if (playerTotal > bankerTotal) {
    outcome = 'PLAYER'
  } else if (bankerTotal > playerTotal) {
    outcome = 'BANKER'
  } else {
    outcome = 'TIE'
  }

  const profit = calculateProfit(outcome, bet, wager)

  return {
    handNumber,
    outcome,
    playerTotal,
    bankerTotal,
    playerCards,
    bankerCards,
    bet,
    wager,
    profit,
  }
}

export function calculateProfit(
  outcome: BaccaratOutcome,
  bet: BettingPreference,
  wager: number,
): number {
  if (outcome === 'TIE') {
    if (bet === 'TIE') {
      return wager * 8
    }

    return 0
  }

  if (bet === outcome) {
    return wager
  }

  if (
    bet === 'FOLLOW_STREAK' ||
    bet === 'FOLLOW_ZIGZAG'
  ) {
    return outcome === 'PLAYER' || outcome === 'BANKER'
      ? wager
      : -wager
  }

  if (bet === 'RANDOM') {
    return outcome === 'PLAYER' || outcome === 'BANKER'
      ? wager * 0.95
      : -wager
  }

  return -wager
}
