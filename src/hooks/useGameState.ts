import { useState, useCallback } from 'react'
import type { GameState, GameSettings } from '../types/gameTypes'

const DEFAULT_SETTINGS: GameSettings = {
  vibration: true,
  music: false,
  sound: true
}

export function useGameState() {
  // Initialize currentLevel from localStorage or default to 1
  const [currentLevel, setCurrentLevel] = useState(() => {
    const saved = localStorage.getItem('colorFindHighestUnlockedLevel')
    const unlockedAll = localStorage.getItem('colorFindUnlockedAll')

    // If unlockedAll is enabled, set to max level 100
    if (unlockedAll === 'true') {
      return 100
    }

    return saved ? parseInt(saved, 10) : 1
  })

  // Track the highest unlocked level
  const [highestUnlockedLevel, setHighestUnlockedLevel] = useState(() => {
    const saved = localStorage.getItem('colorFindHighestUnlockedLevel')
    const unlockedAll = localStorage.getItem('colorFindUnlockedAll')

    // If unlockedAll is enabled, unlock all 100 levels
    if (unlockedAll === 'true') {
      return 100
    }

    return saved ? parseInt(saved, 10) : 1
  })

  const [gameState, setGameState] = useState<GameState>({
    currentLevel: currentLevel,
    isPaused: false,
    isGameOver: false,
    isWon: false,
    selectedCell: null
  })
  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = localStorage.getItem('colorFindSettings')
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS
  })

  // Save settings to localStorage
  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings }
      localStorage.setItem('colorFindSettings', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Game state management
  const pauseGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, isPaused: true }))
  }, [])

  const resumeGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, isPaused: false }))
  }, [])

  const startLevel = useCallback((level: number) => {
    setCurrentLevel(level)
    localStorage.setItem('colorFindLastLevel', level.toString())
    setGameState({
      currentLevel: level,
      isPaused: false,
      isGameOver: false,
      isWon: false,
      selectedCell: null
    })
  }, [])

  const nextLevel = useCallback(() => {
    if (currentLevel < 100) {
      const nextLevelNumber = currentLevel + 1

      // Unlock the next level if it's not already unlocked
      if (nextLevelNumber > highestUnlockedLevel) {
        setHighestUnlockedLevel(nextLevelNumber)
        localStorage.setItem(
          'colorFindHighestUnlockedLevel',
          nextLevelNumber.toString()
        )
      }

      startLevel(nextLevelNumber)
    }
  }, [currentLevel, highestUnlockedLevel, startLevel])

  const gameOver = useCallback(
    (won: boolean) => {
      // When player wins, unlock the next level
      if (won && currentLevel < 100) {
        const nextLevelNumber = currentLevel + 1
        if (nextLevelNumber > highestUnlockedLevel) {
          setHighestUnlockedLevel(nextLevelNumber)
          localStorage.setItem(
            'colorFindHighestUnlockedLevel',
            nextLevelNumber.toString()
          )
        }
      }

      setGameState((prev) => ({
        ...prev,
        isGameOver: true,
        isWon: won
      }))
    },
    [currentLevel, highestUnlockedLevel]
  )

  const selectCell = useCallback((cellIndex: number) => {
    setGameState((prev) => ({ ...prev, selectedCell: cellIndex }))
  }, [])

  const resetGame = useCallback(() => {
    startLevel(1)
  }, [startLevel])

  return {
    currentLevel,
    highestUnlockedLevel,
    gameState,
    settings,
    updateSettings,
    pauseGame,
    resumeGame,
    startLevel,
    nextLevel,
    gameOver,
    selectCell,
    resetGame
  }
}
