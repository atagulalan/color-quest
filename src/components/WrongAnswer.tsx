import './WrongAnswer.css'

interface WrongAnswerProps {
  onRestart: () => void
  onMainMenu: () => void
}

export function WrongAnswer({ onRestart, onMainMenu }: WrongAnswerProps) {
  return (
    <div className="wrong-answer-overlay">
      <div className="wrong-answer-container">
        <div className="wrong-answer-content">
          <div className="wrong-answer-icon-circle">
            <span className="material-symbols-outlined wrong-answer-icon">
              close
            </span>
          </div>
          <h1 className="wrong-answer-title">Wrong!</h1>
        </div>
        <div className="wrong-answer-buttons">
          <button
            className="wrong-answer-button wrong-answer-button-primary"
            onClick={onRestart}
          >
            <span className="material-symbols-outlined">replay</span>
            <span className="wrong-answer-button-text">Try Again</span>
          </button>
          <button
            className="wrong-answer-button wrong-answer-button-secondary"
            onClick={onMainMenu}
          >
            <span className="material-symbols-outlined">home</span>
            <span className="wrong-answer-button-text">Back to Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  )
}
