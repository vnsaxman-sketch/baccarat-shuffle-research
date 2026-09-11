import type { ModelResult } from '../types'
import {
  formatMoney,
  formatPercent,
} from '../utils/format'

interface Props {
  result: ModelResult
  type: 'fair' | 'adversarial'
}

export default function ModelCard({
  result,
  type,
}: Props) {
  return (
    <section
      className={`model-card ${
        type === 'fair'
          ? 'fair-model'
          : 'adversarial-model'
      }`}
    >
      <div className="model-title-row">
        <div>
          <span className="model-label">
            {type === 'fair'
              ? 'MODEL 1'
              : 'MODEL 2'}
          </span>

          <h2>{result.modelName}</h2>
        </div>

        <div className="model-status">
          {type === 'fair'
            ? 'BASELINE'
            : 'SIMULATED'}
        </div>
      </div>

      <div className="metric-grid">
        <div className="metric">
          <span>Player</span>
          <strong>
            {formatPercent(
              result.playerOutcomeRate,
            )}
          </strong>
        </div>

        <div className="metric">
          <span>Banker</span>
          <strong>
            {formatPercent(
              result.bankerOutcomeRate,
            )}
          </strong>
        </div>

        <div className="metric">
          <span>Tie</span>
          <strong>
            {formatPercent(result.tieRate)}
          </strong>
        </div>

        <div className="metric">
          <span>Win Rate</span>
          <strong>
            {formatPercent(result.winRate)}
          </strong>
        </div>

        <div className="metric">
          <span>Avg / Hand</span>
          <strong>
            {formatMoney(
              result.averageProfitPerHand,
            )}
          </strong>
        </div>

        <div className="metric">
          <span>Std Dev</span>
          <strong>
            {formatMoney(
              result.standardDeviation,
            )}
          </strong>
        </div>
      </div>

      <div className="model-footer">
        <span>
          Hands: {result.hands.length}
        </span>

        <span>
          Net: {formatMoney(result.totalProfit)}
        </span>
      </div>
    </section>
  )
}
