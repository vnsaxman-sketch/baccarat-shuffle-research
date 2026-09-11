import type {
  BettingPreference,
  PlayerProfile as Profile,
} from '../types'

interface Props {
  profile: Profile
  onChange: (profile: Profile) => void
}

export default function PlayerProfile({
  profile,
  onChange,
}: Props) {
  function update(
    field: keyof Profile,
    value: string | number,
  ) {
    onChange({
      ...profile,
      [field]: value,
    })
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            INPUT LAYER
          </span>

          <h2>Player Behavioral Profile</h2>
        </div>

        <span className="info-pill">
          Synthetic / Anonymous
        </span>
      </div>

      <div className="form-grid">
        <label>
          Player label
          <input
            value={profile.name}
            onChange={(e) =>
              update('name', e.target.value)
            }
          />
        </label>

        <label>
          Preferred strategy
          <select
            value={profile.preferredBet}
            onChange={(e) =>
              update(
                'preferredBet',
                e.target
                  .value as BettingPreference,
              )
            }
          >
            <option value="PLAYER">
              Player
            </option>

            <option value="BANKER">
              Banker
            </option>

            <option value="TIE">
              Tie
            </option>

            <option value="FOLLOW_STREAK">
              Follow Streak
            </option>

            <option value="FOLLOW_ZIGZAG">
              Follow Zigzag
            </option>

            <option value="RANDOM">
              Random
            </option>
          </select>
        </label>

        <label>
          Player betting %
          <input
            type="number"
            min="0"
            max="100"
            value={profile.playerBetPercent}
            onChange={(e) =>
              update(
                'playerBetPercent',
                Number(e.target.value),
              )
            }
          />
        </label>

        <label>
          Banker betting %
          <input
            type="number"
            min="0"
            max="100"
            value={profile.bankerBetPercent}
            onChange={(e) =>
              update(
                'bankerBetPercent',
                Number(e.target.value),
              )
            }
          />
        </label>

        <label>
          Tie betting %
          <input
            type="number"
            min="0"
            max="100"
            value={profile.tieBetPercent}
            onChange={(e) =>
              update(
                'tieBetPercent',
                Number(e.target.value),
              )
            }
          />
        </label>

        <label>
          Average wager ($)
          <input
            type="number"
            min="1"
            value={profile.averageWager}
            onChange={(e) =>
              update(
                'averageWager',
                Number(e.target.value),
              )
            }
          />
        </label>

        <label>
          Aggression
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={profile.aggression}
            onChange={(e) =>
              update(
                'aggression',
                Number(e.target.value),
              )
            }
          />

          <small>
            {(profile.aggression * 100).toFixed(
              0,
            )}
            %
          </small>
        </label>

        <label>
          Streak following
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={profile.streakFollowing}
            onChange={(e) =>
              update(
                'streakFollowing',
                Number(e.target.value),
              )
            }
          />

          <small>
            {(
              profile.streakFollowing * 100
            ).toFixed(0)}
            %
          </small>
        </label>

        <label>
          Zigzag following
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={profile.zigzagFollowing}
            onChange={(e) =>
              update(
                'zigzagFollowing',
                Number(e.target.value),
              )
            }
          />

          <small>
            {(
              profile.zigzagFollowing * 100
            ).toFixed(0)}
            %
          </small>
        </label>

        <label>
          Typical session hands
          <input
            type="number"
            min="1"
            max="1000"
            value={profile.sessionHands}
            onChange={(e) =>
              update(
                'sessionHands',
                Number(e.target.value),
              )
            }
          />
        </label>
      </div>
    </section>
  )
}
