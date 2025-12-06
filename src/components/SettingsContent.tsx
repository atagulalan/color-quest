import React from 'react'
import type { GameSettings } from '../types/gameTypes'
import './Settings.css'

interface SettingsContentProps {
  settings: GameSettings
  onUpdate: (settings: Partial<GameSettings>) => void
  hideTitle?: boolean
}

export const SettingsContent: React.FC<SettingsContentProps> = ({
  settings,
  onUpdate,
  hideTitle = false,
}) => {
  return (
    <div className="settings-content">
      <div className="settings-section">
        {!hideTitle && <h2 className="settings-section-title">GENERAL</h2>}

        <div className="settings-item">
          <div className="settings-item-icon">
            <span className="material-symbols-outlined">vibration</span>
          </div>
          <span className="settings-item-label">Haptics</span>
          <div className="settings-item-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.vibration}
                onChange={(e) => onUpdate({ vibration: e.target.checked })}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-item">
          <div className="settings-item-icon">
            <span className="material-symbols-outlined">volume_up</span>
          </div>
          <span className="settings-item-label">Sound</span>
          <div className="settings-item-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.sound}
                onChange={(e) => onUpdate({ sound: e.target.checked })}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-item">
          <div className="settings-item-icon">
            <span className="material-symbols-outlined">music_note</span>
          </div>
          <span className="settings-item-label">Music</span>
          <div className="settings-item-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.music}
                onChange={(e) => onUpdate({ music: e.target.checked })}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

