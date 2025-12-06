import React from 'react';
import './Timer.css';

interface TimerProps {
  timeLeft: number;
  totalTime: number;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft, totalTime }) => {
  const percentage = (timeLeft / totalTime) * 100;
  const isLowTime = timeLeft <= 5;

  return (
    <div className={`timer ${isLowTime ? 'timer-low' : ''}`}>
      <div className="timer-text">{timeLeft}s</div>
      <div className="timer-bar">
        <div
          className="timer-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

