import type { ModelResult } from '../types'
import { formatPercent } from '../utils/format'

interface Props {
  fair: ModelResult
  adversarial: ModelResult
}

export default function OutcomeChart({
  fair,
  adversarial,
}: Props) {
  const rows = [
    {
      name: 'Player',
      fair: fair.playerOutcomeRate,
      adversarial:
        adversarial.playerOutcomeRate,
    },
    {
      name: 'Banker',
      fair: fair.bankerOutcomeRate,
      adversarial:
        adversarial.bankerOutcomeRate,
    },
    {
      name: 'Tie',
      fair: fair.tieRate,
      adversarial: adversarial.tieRate,
    },
  ]

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            MODEL COMPARISON
          </span>

          <h2>Outcome Distribution</h2>
        </div>
      </div>

      <div className="comparison-chart">
        {rows.map((row) => (
          <div
            className="chart-row"
            key={row.name}
          >
            <div className="chart-label">
              {row.name}
            </div>

            <div className="chart-track">
              <div className="chart-model fair-bar">
                <span>
                  Fair
                </span>

                <div
                  className="chart-value"
                  style={{
                    width: `${row.fair * 100}%`,
                  }}
                >
                  {formatPercent(row.fair)}
                </div>
              </div>

              <div className="chart-model adversarial-bar">
                <span>
                  AI
                </span>

                <div
                  className="chart-value"
                  style={{
                    width: `${row.adversarial * 100}%`,
                  }}
                >
                  {formatPercent(
                    row.adversarial,
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
