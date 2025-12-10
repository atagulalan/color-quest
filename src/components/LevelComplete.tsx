import './LevelComplete.css'

interface LevelCompleteProps {
  onNextLevel: () => void
  onMainMenu: () => void
  currentLevel: number
  stars?: number // Number of stars earned (1-3)
}

export function LevelComplete({
  onNextLevel,
  onMainMenu,
  currentLevel,
  stars = 3
}: LevelCompleteProps) {
  const isLastLevel = currentLevel >= 100

  return (
    <div className="level-complete-overlay">
      <div className="level-complete-modal">
        <div className="level-complete-title-container">
          <h2>Level Complete!</h2>
          <div className="level-complete-stars">
            {[1, 2, 3].map((star) => (
              <span
                key={star}
                className={`material-symbols-outlined star ${
                  star <= stars ? 'star-filled' : 'star-empty'
                }`}
              >
                {star <= stars ? 'star' : 'star'}
              </span>
            ))}
          </div>
        </div>
        <div className="level-complete-buttons">
          <button
            className="level-complete-button level-complete-button-primary"
            onClick={onNextLevel}
          >
            <span className="material-symbols-outlined">
              {isLastLevel ? 'home' : 'arrow_forward'}
            </span>
            <span className="level-complete-button-text">
              {isLastLevel ? 'Main Menu' : 'Next Level'}
            </span>
          </button>
          <button
            className="level-complete-button level-complete-button-secondary"
            onClick={onMainMenu}
          >
            <span className="material-symbols-outlined">home</span>
            <span className="level-complete-button-text">
              Back to Main Menu
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
