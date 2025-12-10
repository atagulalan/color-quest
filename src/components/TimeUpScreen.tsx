import './TimeUpScreen.css'

interface TimeUpScreenProps {
  onRestart: () => void
  onMainMenu: () => void
  onLeaderboard?: () => void
}

export function TimeUpScreen({
  onRestart,
  onMainMenu,
  onLeaderboard
}: TimeUpScreenProps) {
  return (
    <div className="time-up-overlay">
      <div className="time-up-container">
        <div className="time-up-content">
          <h1 className="time-up-title">Time's Up!</h1>
        </div>
        <div className="time-up-buttons">
          <button
            className="time-up-button time-up-button-primary"
            onClick={onRestart}
          >
            <span className="material-symbols-outlined">replay</span>
            <span className="time-up-button-text">Restart</span>
          </button>
          <button
            className="time-up-button time-up-button-secondary"
            onClick={onMainMenu}
          >
            <span className="material-symbols-outlined">home</span>
            <span className="time-up-button-text">Back to Main Menu</span>
          </button>
          {onLeaderboard && (
            <button
              className="time-up-button time-up-button-secondary"
              onClick={onLeaderboard}
            >
              <span className="material-symbols-outlined">leaderboard</span>
              <span className="time-up-button-text">Leaderboard</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
