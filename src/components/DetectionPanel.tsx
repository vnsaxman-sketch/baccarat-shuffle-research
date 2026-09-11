import type { DetectionResult } from '../types'
import {
  formatNumber,
  formatPercent,
} from '../utils/format'

interface Props {
  result: DetectionResult | null
}

export default function DetectionPanel({
  result,
}: Props) {
  if (!result) {
    return (
      <section className="panel detection-panel">
        <span className="eyebrow">
          AUDITOR
        </span>

        <h2>Detection Engine</h2>

        <p>
          Run the experiment to compare the
          simulated biased(adversarial) model against the
          fair baseline.
        </p>
      </section>
    )
  }

  return (
    <section
      className={`panel detection-panel ${
        result.suspicious
          ? 'detection-warning'
          : 'detection-clear'
      }`}
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            AUDITOR
          </span>

          <h2>Statistical Detection</h2>
        </div>

        <span className="detection-status">
          {result.suspicious
            ? 'DEVIATION DETECTED'
            : 'NO STRONG DEVIATION'}
        </span>
      </div>

      <div className="detection-grid">
        <div>
          <span>Chi-square</span>
          <strong>
            {formatNumber(
              result.chiSquare,
            )}
          </strong>
        </div>

        <div>
          <span>Degrees of freedom</span>
          <strong>
            {result.degreesOfFreedom}
          </strong>
        </div>

        <div>
          <span>Approx. p-value</span>
          <strong>
            {formatNumber(
              result.pApproximation,
              4,
            )}
          </strong>
        </div>

        <div>
          <span>Outcome difference</span>
          <strong>
            {formatPercent(
              result.outcomeDifference,
            )}
          </strong>
        </div>

        <div>
          <span>Serial correlation</span>
          <strong>
            {formatNumber(
              result.serialCorrelation,
              4,
            )}
          </strong>
        </div>

        <div>
          <span>Runs statistic</span>
          <strong>
            {formatNumber(
              result.runsStatistic,
              0,
            )}
          </strong>
        </div>
      </div>

      <div className="detection-explanation">
        <strong>Interpretation</strong>

        <p>
          {result.explanation}
        </p>
      </div>

      <div className="research-warning">
        This detection result is educational and
        simulation-based. A statistical deviation
        does not establish that a real casino,
        shuffler, dealer, or gaming system is
        manipulating cards.
      </div>
    </section>
  )
}
