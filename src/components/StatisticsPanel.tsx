import type { ModelResult } from '../types'
import {
  formatMoney,
  formatPercent,
} from '../utils/format'

interface Props {
  fair: ModelResult
  adversarial: ModelResult
}

export default function StatisticsPanel({
  fair,
  adversarial,
}: Props) {
  const profitDifference =
    adversarial.averageProfitPerHand -
    fair.averageProfitPerHand

  const playerDifference =
    adversarial.playerOutcomeRate -
    fair.playerOutcomeRate

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            STATISTICAL SUMMARY
          </span>

          <h2>Fair vs Bias-Adversarial</h2>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Fair</th>
              <th>Adversarial</th>
              <th>Difference</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Player rate</td>
              <td>
                {formatPercent(
                  fair.playerOutcomeRate,
                )}
              </td>
              <td>
                {formatPercent(
                  adversarial.playerOutcomeRate,
                )}
              </td>
              <td>
                {formatPercent(
                  playerDifference,
                )}
              </td>
            </tr>

            <tr>
              <td>Banker rate</td>
              <td>
                {formatPercent(
                  fair.bankerOutcomeRate,
                )}
              </td>
              <td>
                {formatPercent(
                  adversarial.bankerOutcomeRate,
                )}
              </td>
              <td>
                {formatPercent(
                  adversarial.bankerOutcomeRate -
                    fair.bankerOutcomeRate,
                )}
              </td>
            </tr>

            <tr>
              <td>Tie rate</td>
              <td>
                {formatPercent(fair.tieRate)}
              </td>
              <td>
                {formatPercent(
                  adversarial.tieRate,
                )}
              </td>
              <td>
                {formatPercent(
                  adversarial.tieRate -
                    fair.tieRate,
                )}
              </td>
            </tr>

            <tr>
              <td>Average / hand</td>
              <td>
                {formatMoney(
                  fair.averageProfitPerHand,
                )}
              </td>
              <td>
                {formatMoney(
                  adversarial.averageProfitPerHand,
                )}
              </td>
              <td>
                {formatMoney(profitDifference)}
              </td>
            </tr>

            <tr>
              <td>Standard deviation</td>
              <td>
                {formatMoney(
                  fair.standardDeviation,
                )}
              </td>
              <td>
                {formatMoney(
                  adversarial.standardDeviation,
                )}
              </td>
              <td>
                {formatMoney(
                  adversarial.standardDeviation -
                    fair.standardDeviation,
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
