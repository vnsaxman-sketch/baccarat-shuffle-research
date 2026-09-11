import { useMemo, useState } from 'react'

import Header from './components/Header'
import ModelCard from './components/ModelCard'
import PlayerProfile from './components/PlayerProfile'
import ShoeComposition from './components/ShoeComposition'
import OutcomeChart from './components/OutcomeChart'
import SimulationControls from './components/SimulationControls'
import StatisticsPanel from './components/StatisticsPanel'
import DetectionPanel from './components/DetectionPanel'

import { runFairModel } from './engine/fairModel'
import { runAdversarialModel } from './engine/adversarialModel'
import { simulateManyShoes } from './engine/simulation'
import { detectDeviation } from './engine/detection'

import type {
  DetectionResult,
  ModelResult,
  PlayerProfile as Profile,
  SimulationSummary,
} from './types'

const DEFAULT_PROFILE: Profile = {
  name: 'Player A',
  preferredBet: 'PLAYER',
  playerBetPercent: 50,
  bankerBetPercent: 45,
  tieBetPercent: 5,
  averageWager: 100,
  aggression: 0.5,
  streakFollowing: 0.5,
  zigzagFollowing: 0.3,
  sessionHands: 80,
}

function createInitialFair(): ModelResult {
  return runFairModel(
    DEFAULT_PROFILE,
    80,
  )
}

function createInitialAdversarial(): ModelResult {
  return runAdversarialModel(
    DEFAULT_PROFILE,
    80,
  )
}

function App() {
  const [profile, setProfile] =
    useState<Profile>(DEFAULT_PROFILE)

  const [fair, setFair] =
    useState<ModelResult>(
      createInitialFair,
    )

  const [adversarial, setAdversarial] =
    useState<ModelResult>(
      createInitialAdversarial,
    )

  const [detection, setDetection] =
    useState<DetectionResult | null>(null)

  const [shoeCount, setShoeCount] =
    useState(100)

  const [running, setRunning] =
    useState(false)

  const [batchFair, setBatchFair] =
    useState<SimulationSummary | null>(null)

  const [batchAdversarial, setBatchAdversarial] =
    useState<SimulationSummary | null>(null)

  const totalHands = useMemo(
    () =>
      fair.hands.length +
      adversarial.hands.length,
    [fair, adversarial],
  )

  function runModels() {
    setRunning(true)

    setTimeout(() => {
      const fairResult =
        runFairModel(
          profile,
          Math.min(
            100,
            profile.sessionHands,
          ),
        )

      const adversarialResult =
        runAdversarialModel(
          profile,
          Math.min(
            100,
            profile.sessionHands,
          ),
        )

      setFair(fairResult)
      setAdversarial(adversarialResult)

      setDetection(
        detectDeviation(
          fairResult.hands,
          adversarialResult.hands,
        ),
      )

      setBatchFair(
        simulateManyShoes(
          profile,
          'fair',
          shoeCount,
        ),
      )

      setBatchAdversarial(
        simulateManyShoes(
          profile,
          'adversarial',
          shoeCount,
        ),
      )

      setRunning(false)
    }, 50)
  }

  return (
    <div className="app">
      <Header />

      <main>
        <section className="hero-panel">
          <div>
            <span className="eyebrow">
              EXPERIMENTAL FRAMEWORK
            </span>

            <h2>
              Can player-specific information
              change the statistical behavior of
              a simulated shoe?
            </h2>

            <p>
              Model 1 establishes a random-shuffle
              baseline. Model 2 creates an
              artificial biased or adversarial ordering using
              a synthetic behavioral profile.
            </p>
	   
          </div>

          <div className="hero-stats">
            <div>
              <strong>416</strong>
              <span>
                cards / 8 decks
              </span>
            </div>

            <div>
              <strong>
                {totalHands}
              </strong>
              <span>
                comparison hands
              </span>
            </div>

            <div>
              <strong>
                {shoeCount}
              </strong>
              <span>
                batch shoes
              </span>
            </div>
          </div>
        </section>

        <PlayerProfile
          profile={profile}
          onChange={setProfile}
        />

        <SimulationControls
          shoeCount={shoeCount}
          running={running}
          onShoeCountChange={
            setShoeCount
          }
          onRun={runModels}
        />

        <div className="model-grid">
          <ModelCard
            result={fair}
            type="fair"
          />

          <ModelCard
            result={adversarial}
            type="adversarial"
          />
        </div>

        <OutcomeChart
          fair={fair}
          adversarial={adversarial}
        />

        <StatisticsPanel
          fair={fair}
          adversarial={adversarial}
        />

        <DetectionPanel
          result={detection}
        />

        <div className="two-column">
          <ShoeComposition
            composition={
              fair.shoeComposition
            }
          />

          <ShoeComposition
            composition={
              adversarial.shoeComposition
            }
          />
        </div>

        {batchFair &&
          batchAdversarial && (
            <section className="panel">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    LARGE SAMPLE
                  </span>

                  <h2>
                    {shoeCount.toLocaleString()}{' '}
                    Shoe Experiment
                  </h2>
                </div>
              </div>

              <div className="batch-grid">
                <div className="batch-card">
                  <span>
                    Fair Model
                  </span>

                  <strong>
                    {(
                      batchFair.playerRate *
                      100
                    ).toFixed(3)}
                    %
                  </strong>

                  <small>
                    Player outcome rate
                  </small>

                  <strong>
                    $
                    {batchFair.averageProfitPerHand.toFixed(
                      2,
                    )}
                  </strong>

                  <small>
                    Average profit / hand
                  </small>
                </div>

                <div className="batch-card">
                  <span>
                    Bias or Adversarial Model
                  </span>

                  <strong>
                    {(
                      batchAdversarial.playerRate *
                      100
                    ).toFixed(3)}
                    %
                  </strong>

                  <small>
                    Player outcome rate
                  </small>

                  <strong>
                    $
                    {batchAdversarial.averageProfitPerHand.toFixed(
                      2,
                    )}
                  </strong>

                  <small>
                    Average profit / hand
                  </small>
                </div>
              </div>
            </section>
          )}

        <section className="research-notice">
          <strong>
            Research / simulation notice
          </strong>

          <p>
            Model 2 is an artificial biased or adversarial 
            simulation. It does not represent how
            any particular casino operates and does
            not provide a method for modifying,
            hacking, or controlling real casino
            shuffling equipment.
          </p>

          <p>
            The purpose of the application is to
            study how behavioral information,
            shoe composition, probability and
            statistical detection interact in a
            controlled environment.
          </p>
        </section>
      </main>
    </div>
  )
}

export default App
