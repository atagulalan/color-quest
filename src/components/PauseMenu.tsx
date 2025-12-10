import React, { useState } from 'react'
import type { GameSettings } from '../types/gameTypes'
import { SettingsContent } from './SettingsContent'
import './PauseMenu.css'

interface PauseMenuProps {
  onResume: () => void
  onRestart: () => void
  onMainMenu: () => void
  settings: GameSettings
  onUpdateSettings: (settings: Partial<GameSettings>) => void
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onRestart,
  onMainMenu,
  settings,
  onUpdateSettings
}) => {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="pause-overlay">
      <div className="pause-modal">
        {!showSettings ? (
          <>
            <div className="pause-header">
              <button className="pause-back-button" onClick={onMainMenu}>
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
            </div>
            <div className="pause-title-container">
              <h2>Paused</h2>
            </div>
            <div className="pause-buttons">
              <button
                className="pause-button pause-button-primary"
                onClick={onResume}
              >
                <span className="material-symbols-outlined">play_arrow</span>
                <span className="pause-button-text">Resume</span>
              </button>
              <button
                className="pause-button pause-button-secondary"
                onClick={onRestart}
              >
                <span className="material-symbols-outlined">replay</span>
                <span className="pause-button-text">Restart</span>
              </button>
              <button
                className="pause-button pause-button-secondary"
                onClick={() => setShowSettings(true)}
              >
                <span className="material-symbols-outlined">settings</span>
                <span className="pause-button-text">Settings</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="pause-header">
              <button
                className="pause-back-button"
                onClick={() => setShowSettings(false)}
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
            </div>
            <div className="pause-title-container">
              <h2>Settings</h2>
            </div>
            <div className="pause-settings-content">
              <SettingsContent
                settings={settings}
                onUpdate={onUpdateSettings}
                hideTitle={true}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
