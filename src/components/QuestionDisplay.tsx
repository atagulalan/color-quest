import React, { useState, useEffect } from 'react'
import './QuestionDisplay.css'

interface QuestionDisplayProps {
  question: string
  onComplete: () => void
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  onComplete
}) => {
  const [isFullScreen, setIsFullScreen] = useState(true)

  useEffect(() => {
    // After 2 seconds, transition from full screen to top bar
    const timer = setTimeout(() => {
      setIsFullScreen(false)
      // After animation completes, notify parent
      setTimeout(onComplete, 300)
    }, 2000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className={`question-display ${isFullScreen ? 'fullscreen' : 'topbar'}`}>
      <div className="question-content">
        <p className="question-text">{question}</p>
      </div>
    </div>
  )
}

