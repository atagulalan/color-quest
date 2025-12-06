import React, { useImperativeHandle, forwardRef, useRef } from 'react'
import './MainMenu.css'

interface MainMenuProps {
  onStartGame: (level: number) => void
  currentLevel?: number
  highestUnlockedLevel?: number
  totalLevels?: number
}

export interface MainMenuRef {
  scrollToActiveLevel: () => void
}

export const MainMenu = forwardRef<MainMenuRef, MainMenuProps>(
  (
    { onStartGame, currentLevel = 1, highestUnlockedLevel, totalLevels = 100 },
    ref
  ) => {
    const activeLevelRef = useRef<HTMLButtonElement>(null)

    // Use highestUnlockedLevel if provided, otherwise fallback to currentLevel
    const maxUnlockedLevel = highestUnlockedLevel ?? currentLevel

    useImperativeHandle(ref, () => ({
      scrollToActiveLevel: () => {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          if (activeLevelRef.current) {
            activeLevelRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'end',
              inline: 'center'
            })
          }
        }, 400)
      }
    }))

    const isLevelUnlocked = (level: number) => {
      // Check if all levels are unlocked via localStorage
      const unlockedAll = localStorage.getItem('colorFindUnlockedAll')
      if (unlockedAll === 'true') {
        return true
      }
      return level <= maxUnlockedLevel
    }

    const handleLevelClick = (level: number) => {
      if (isLevelUnlocked(level)) {
        onStartGame(level)
      }
    }

    // Show all completed levels and 5 levels ahead
    const getLevelsToShow = () => {
      const start = 1 // Always start from level 1
      const unlockedAll = localStorage.getItem('colorFindUnlockedAll')

      // If all levels are unlocked, show all levels
      const end =
        unlockedAll === 'true'
          ? totalLevels
          : Math.min(totalLevels, maxUnlockedLevel + 6) // Show max unlocked + 8 ahead

      return Array.from(
        { length: end - start + 1 },
        (_, i) => start + i
      ).reverse()
    }

    const levelsToShow = getLevelsToShow()

    // Calculate opacity for levels after current (fade out effect)
    const getOpacity = (levelNum: number) => {
      if (levelNum <= maxUnlockedLevel) {
        return 1 // Full opacity for completed/unlocked levels
      } else {
        // Fade out for future levels
        const distance = levelNum - maxUnlockedLevel
        return Math.max(0.3, 1 - distance * 0.15)
      }
    }

    return (
      <div className="main-menu">
        {/* Sticky Logo Header */}
        <header className="main-menu-header">
          <h1 className="colorquest-logo">ColorQuest</h1>
        </header>

        <main className="main-menu-content">
          {/* Gradient Overlay */}
          <div className="gradient-overlay"></div>

          {/* Scrollable Container */}
          <div className="level-progression-scroll">
            {/* Level Progression */}
            <div className="level-progression">
              {levelsToShow.map((levelNum, index) => {
                const isUnlocked = isLevelUnlocked(levelNum)
                const isActive = levelNum === maxUnlockedLevel

                // Size calculation based on level position
                let sizeClass = 'level-indicator-small'

                if (isActive) {
                  // Active level - largest
                  sizeClass = 'level-indicator-large'
                } else if (levelNum < maxUnlockedLevel) {
                  // Previous/completed levels - medium
                  sizeClass = 'level-indicator-medium'
                }

                // Calculate opacity with fade out for future levels
                const opacity = getOpacity(levelNum)

                return (
                  <React.Fragment key={levelNum}>
                    {/* Connector (shown above each level except the last one in the array) */}
                    {index > 0 && (
                      <div
                        className={`level-connector ${
                          isActive && index === levelsToShow.length - 1
                            ? 'connector-active'
                            : ''
                        }`}
                      ></div>
                    )}

                    {/* Level Indicator */}
                    <div className="level-indicator-wrapper">
                      <button
                        ref={isActive ? activeLevelRef : null}
                        className={`level-indicator ${sizeClass} ${
                          isActive
                            ? 'level-active'
                            : isUnlocked
                            ? 'level-unlocked'
                            : 'level-inactive'
                        }`}
                        onClick={() => handleLevelClick(levelNum)}
                        disabled={!isUnlocked}
                        style={{ opacity }}
                      >
                        <span className="level-number">
                          {levelNum.toString().padStart(2, '0')}
                        </span>
                      </button>
                    </div>
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    )
  }
)
