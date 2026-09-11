interface Props {
  shoeCount: number
  running: boolean
  onShoeCountChange: (
    value: number,
  ) => void
  onRun: () => void
}

export default function SimulationControls({
  shoeCount,
  running,
  onShoeCountChange,
  onRun,
}: Props) {
  return (
    <section className="control-panel">
      <div>
        <span className="eyebrow">
          SIMULATION ENGINE
        </span>

        <h2>Run Controlled Experiment</h2>

        <p>
          Compare a statistically random shoe
          against the simulated adversarial
          model.
        </p>
      </div>

      <div className="control-actions">
        <label>
          Shoes
          <input
            type="number"
            min="1"
            max="10000"
            value={shoeCount}
            onChange={(e) =>
              onShoeCountChange(
                Math.max(
                  1,
                  Number(e.target.value),
                ),
              )
            }
          />
        </label>

        <button
          className="primary-button"
          onClick={onRun}
          disabled={running}
        >
          {running
            ? 'Running Simulation...'
            : 'Run Both Models'}
        </button>
      </div>
    </section>
  )
}
