import React from 'react'
import type { GameSettings } from '../types/gameTypes'
import { SettingsContent } from './SettingsContent'
import './Settings.css'

interface SettingsProps {
  settings: GameSettings
  onUpdate: (settings: Partial<GameSettings>) => void
  onOpenDocument: (type: 'privacy' | 'terms') => void
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onUpdate,
  onOpenDocument
}) => {
  const handleTermsClick = () => {
    onOpenDocument('terms')
  }

  const handlePrivacyClick = () => {
    onOpenDocument('privacy')
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
      </div>

      <div className="settings-wrapper">
        <div>
          <SettingsContent settings={settings} onUpdate={onUpdate} />

          <div className="settings-content">
            <div className="settings-section">
              <h2 className="settings-section-title">LEGAL DOCUMENTS</h2>

              <button className="settings-nav-item" onClick={handleTermsClick}>
                <div className="settings-item-icon">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <span className="settings-item-label">Terms of Service</span>
                <span className="material-symbols-outlined settings-nav-arrow">
                  chevron_right
                </span>
              </button>

              <button
                className="settings-nav-item"
                onClick={handlePrivacyClick}
              >
                <div className="settings-item-icon">
                  <span className="material-symbols-outlined">shield</span>
                </div>
                <span className="settings-item-label">Privacy Policy</span>
                <span className="material-symbols-outlined settings-nav-arrow">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <p className="settings-copyright">
            © 2024 ColorQuest. All rights reserved.
          </p>
          <p className="settings-version">Version 1.0.0</p>
        </div>
      </div>
    </div>
  )
}
