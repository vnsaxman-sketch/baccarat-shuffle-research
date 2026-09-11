export type BaccaratOutcome = 'PLAYER' | 'BANKER' | 'TIE'

export type BettingPreference =
  | 'PLAYER'
  | 'BANKER'
  | 'TIE'
  | 'FOLLOW_STREAK'
  | 'FOLLOW_ZIGZAG'
  | 'RANDOM'

export interface Card {
  rank: string
  value: number
  deckId: number
}

export interface ShoeComposition {
  totalCards: number
  cardsRemaining: number
  rankCounts: Record<string, number>
  valueCounts: Record<number, number>
}

export interface PlayerProfile {
  name: string
  preferredBet: BettingPreference
  playerBetPercent: number
  bankerBetPercent: number
  tieBetPercent: number
  averageWager: number
  aggression: number
  streakFollowing: number
  zigzagFollowing: number
  sessionHands: number
}

export interface HandResult {
  handNumber: number
  outcome: BaccaratOutcome
  playerTotal: number
  bankerTotal: number
  playerCards: Card[]
  bankerCards: Card[]
  bet: BettingPreference
  wager: number
  profit: number
}

export interface ModelResult {
  modelName: string
  hands: HandResult[]
  outcomeCounts: Record<BaccaratOutcome, number>
  totalProfit: number
  averageProfitPerHand: number
  winRate: number
  standardDeviation: number
  playerOutcomeRate: number
  bankerOutcomeRate: number
  tieRate: number
  shoeComposition: ShoeComposition
}

export interface SimulationSummary {
  shoes: number
  hands: number
  playerCount: number
  bankerCount: number
  tieCount: number
  totalProfit: number
  averageProfitPerHand: number
  standardDeviation: number
  playerRate: number
  bankerRate: number
  tieRate: number
}

export interface DetectionResult {
  chiSquare: number
  degreesOfFreedom: number
  pApproximation: number
  suspicious: boolean
  outcomeDifference: number
  serialCorrelation: number
  runsStatistic: number
  explanation: string
}
