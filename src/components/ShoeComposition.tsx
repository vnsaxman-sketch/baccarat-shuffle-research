import type { ShoeComposition as Composition } from '../types'

interface Props {
  composition: Composition
}

export default function ShoeComposition({
  composition,
}: Props) {
  const values = Object.entries(
    composition.valueCounts,
  )
    .sort(
      ([a], [b]) =>
        Number(a) - Number(b),
    )

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            SHOE STATE
          </span>

          <h2>Remaining Composition</h2>
        </div>

        <strong>
          {composition.cardsRemaining} / 416
        </strong>
      </div>

      <div className="composition-list">
        {values.map(([value, count]) => {
          const percentage =
            composition.cardsRemaining > 0
              ? (count /
                  composition.cardsRemaining) *
                100
              : 0

          return (
            <div
              className="composition-row"
              key={value}
            >
              <span>
                Value {value}
              </span>

              <div className="composition-bar">
                <div
                  className="composition-fill"
                  style={{
                    width: `${Math.min(
                      percentage * 2,
                      100,
                    )}%`,
                  }}
                />
              </div>

              <strong>{count}</strong>
            </div>
          )
        })}
      </div>
    </section>
  )
}
