import { useState, useEffect, useRef, useCallback } from 'react'
import { GameBoard } from './components/GameBoard'
import { Timer } from './components/Timer'
import { PauseMenu } from './components/PauseMenu'
import { Settings } from './components/Settings'
import { MainMenu, MainMenuRef } from './components/MainMenu'
import { DocumentViewer } from './components/DocumentViewer'
import { Store } from './components/Store'
import { TimeUpScreen } from './components/TimeUpScreen'
import { WrongAnswer } from './components/WrongAnswer'
import { LevelComplete } from './components/LevelComplete'
import { QuestionDisplay } from './components/QuestionDisplay'
import { useTimer } from './hooks/useTimer'
import { useGameState } from './hooks/useGameState'
import {
  playTickSound,
  playWinSound,
  playLoseSound,
  initializeAudio,
  playBackgroundMusic,
  cleanupAudio
} from './utils/audioManager'
import type { Level } from './types/gameTypes'
import './App.css'

type GameScreen =
  | 'menu'
  | 'game'
  | 'gameOver'
  | 'wrongAnswer'
  | 'settings'
  | 'document'
  | 'store'

type DocumentType = 'privacy' | 'terms'

function App() {
  const [screen, setScreen] = useState<GameScreen>('menu')
  const [documentType, setDocumentType] = useState<DocumentType>('privacy')
  const [currentLevelData, setCurrentLevelData] = useState<Level | null>(null)
  const [selectedCells, setSelectedCells] = useState<Set<number>>(new Set())
  const [levels, setLevels] = useState<Level[]>([])
  const [isLoadingLevels, setIsLoadingLevels] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const mainMenuRef = useRef<MainMenuRef>(null)
  const [showQuestion, setShowQuestion] = useState(false)
  const [questionCompleted, setQuestionCompleted] = useState(false)

  const {
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
    resetGame
  } = useGameState()

  // Load levels on mount
  useEffect(() => {
    const loadLevels = async () => {
      setIsLoadingLevels(true)
      setLoadError(null)

      try {
        const response = await fetch('/assets/levels.json')

        if (!response.ok) {
          throw new Error(
            `Failed to load levels: ${response.status} ${response.statusText}`
          )
        }

        const data = await response.json()

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Invalid levels data: expected non-empty array')
        }

        setLevels(data)

        // Set initial level data
        if (currentLevel <= data.length) {
          setCurrentLevelData(data[currentLevel - 1])
        }

        setIsLoadingLevels(false)
      } catch (err) {
        console.error('Failed to load levels:', err)
        setLoadError(
          err instanceof Error ? err.message : 'Failed to load levels'
        )
        setIsLoadingLevels(false)
      }
    }

    loadLevels()
    initializeAudio()

    // Cleanup audio on unmount
    return () => {
      cleanupAudio()
    }
  }, [])

  // Control background music based on settings
  useEffect(() => {
    playBackgroundMusic(settings.music)
  }, [settings.music])

  // Update current level data when level changes
  useEffect(() => {
    if (levels.length > 0 && currentLevel <= levels.length) {
      setCurrentLevelData(levels[currentLevel - 1])
      setSelectedCells(new Set())
    }
  }, [currentLevel, levels])

  // Auto-scroll to active level when menu screen is shown
  useEffect(() => {
    if (screen === 'menu') {
      mainMenuRef.current?.scrollToActiveLevel()
    }
  }, [screen])

  // Timer setup
  const timer = useTimer({
    initialTime: currentLevelData?.timer || 15,
    enabled:
      screen === 'game' &&
      !gameState.isPaused &&
      !gameState.isGameOver &&
      !showQuestion,
    onComplete: () => {
      gameOver(false)
      playLoseSound(settings.sound)
      setScreen('gameOver')
    },
    onTick: (timeLeft) => {
      if (timeLeft <= 5 && timeLeft > 0) {
        playTickSound(settings.sound)
      }
    }
  })

  // Reset timer when level changes or screen changes to game
  useEffect(() => {
    if (currentLevelData && screen === 'game') {
      timer.reset()
      // Check if level has a question
      if (currentLevelData.askQuestion) {
        setShowQuestion(true)
        setQuestionCompleted(false)
      } else {
        setShowQuestion(false)
        setQuestionCompleted(false)
      }
    }
  }, [currentLevelData?.level, screen])

  // Handle question completion
  const handleQuestionComplete = () => {
    setShowQuestion(false)
    setQuestionCompleted(true)
  }

  const handleStartGame = (level: number) => {
    if (isLoadingLevels) return // Prevent starting game while loading

    startLevel(level)
    if (levels.length > 0 && level <= levels.length) {
      setCurrentLevelData(levels[level - 1])
      setScreen('game')
      setSelectedCells(new Set())
      timer.reset()
    }
  }

  const handleCellClick = (index: number) => {
    if (gameState.isPaused || gameState.isGameOver || screen !== 'game') return

    const newSelected = new Set(selectedCells)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedCells(newSelected)
  }

  const handleWin = useCallback(() => {
    if (!gameState.isGameOver) {
      gameOver(true)
      playWinSound(settings.sound)
      timer.pause()
      setScreen('gameOver')
    }
  }, [gameState, gameOver, settings.sound, timer])

  const handleLose = useCallback(() => {
    if (!gameState.isGameOver) {
      gameOver(false)
      playLoseSound(settings.sound)
      timer.pause()
      setScreen('wrongAnswer')
    }
  }, [gameState, gameOver, settings.sound, timer])

  const handlePause = () => {
    pauseGame()
    timer.pause()
  }

  const handleResume = () => {
    resumeGame()
    timer.resume()
  }

  const handleMainMenu = () => {
    setScreen('menu')
    timer.pause()
    resetGame()
    setSelectedCells(new Set())
  }

  const handleScreenChange = (newScreen: GameScreen) => {
    setScreen(newScreen)
  }

  const handleNextLevel = () => {
    // Redirect to Google link after level 52
    if (currentLevel === 52) {
      window.location.href = 'https://miew.xava.me/'
      return
    }

    if (currentLevel < 100) {
      nextLevel()
      setScreen('game')
      setSelectedCells(new Set())
      timer.reset()
    } else {
      // Game complete!
      handleMainMenu()
    }
  }

  const handleRetry = () => {
    startLevel(currentLevel)
    setScreen('game')
    setSelectedCells(new Set())
    timer.reset()
  }

  // Swipe handling
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    const clientX = e.targetTouches[0].clientX
    setTouchStart(clientX)
    setTouchEnd(clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swiped left
      if (screen === 'menu') {
        handleScreenChange('settings')
      } else if (screen === 'store') {
        handleScreenChange('menu')
      }
    }

    if (touchStart - touchEnd < -75) {
      // Swiped right
      if (screen === 'menu') {
        handleScreenChange('store')
      } else if (screen === 'settings') {
        handleScreenChange('menu')
      }
    }
  }

  // For menu-store-settings navigation, render all screens side by side
  if (screen === 'menu' || screen === 'store' || screen === 'settings') {
    // Calculate translate position based on active screen
    // Each page is 33.333% of slider, so we move by that amount
    const getTranslateX = () => {
      if (screen === 'store') return '0%'
      if (screen === 'menu') return '-33.333%'
      if (screen === 'settings') return '-66.666%'
      return '-33.333%'
    }

    return (
      <div className="app">
        <div
          className="page-slider-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="page-slider"
            style={{ transform: `translateX(${getTranslateX()})` }}
          >
            {/* Store - Left page */}
            <div className="page-slide">
              <Store />
            </div>

            {/* Menu - Center page */}
            <div className="page-slide">
              <MainMenu
                ref={mainMenuRef}
                key={`menu-${screen}-${currentLevel}`}
                onStartGame={handleStartGame}
                currentLevel={currentLevel}
                highestUnlockedLevel={highestUnlockedLevel}
                totalLevels={levels.length}
              />
            </div>

            {/* Settings - Right page */}
            <div className="page-slide">
              <Settings
                settings={settings}
                onUpdate={updateSettings}
                onOpenDocument={(type: DocumentType) => {
                  setDocumentType(type)
                  handleScreenChange('document')
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Navigation Bar - Fixed outside of slider */}
        <nav className="bottom-nav-fixed">
          <button
            className={`nav-item ${
              screen === 'store' ? 'nav-item-active' : ''
            }`}
            onClick={() => handleScreenChange('store')}
          >
            <span className="material-symbols-outlined nav-icon">
              storefront
            </span>
            <span className="nav-label">Store</span>
          </button>
          <button
            className={`nav-item ${screen === 'menu' ? 'nav-item-active' : ''}`}
            onClick={() => {
              handleScreenChange('menu')
              // Scroll to active level when home button is clicked
              setTimeout(() => {
                mainMenuRef.current?.scrollToActiveLevel()
              }, 100)
            }}
          >
            <span className="material-symbols-outlined nav-icon">home</span>
            <span className="nav-label">Home</span>
          </button>
          <button
            className={`nav-item ${
              screen === 'settings' ? 'nav-item-active' : ''
            }`}
            onClick={() => handleScreenChange('settings')}
          >
            <span className="material-symbols-outlined nav-icon">settings</span>
            <span className="nav-label">Settings</span>
          </button>
        </nav>
      </div>
    )
  }

  if (screen === 'document') {
    const documentUrl =
      documentType === 'privacy'
        ? '/assets/documents/privacy-policy.json'
        : '/assets/documents/terms-of-service.json'
    const documentTitle =
      documentType === 'privacy' ? 'Privacy Policy' : 'Terms of Service'

    return (
      <div className="app">
        <DocumentViewer
          documentUrl={documentUrl}
          title={documentTitle}
          onClose={() => setScreen('settings')}
        />
      </div>
    )
  }

  if (!currentLevelData) {
    return (
      <div className="app">
        <div className="loading">
          {isLoadingLevels ? (
            <>
              <span className="material-symbols-outlined loading-icon">
                progress_activity
              </span>
              <p>Loading levels...</p>
            </>
          ) : loadError ? (
            <>
              <span className="material-symbols-outlined error-icon">
                error
              </span>
              <p>Error loading levels</p>
              <p className="error-message">{loadError}</p>
              <button
                className="retry-button"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined error-icon">
                error
              </span>
              <p>No levels available</p>
            </>
          )}
        </div>
      </div>
    )
  }

  const handlePowerUp = (type: 'hourglass' | 'magnify' | 'bomb') => {
    // Placeholder for power-up functionality
    console.log(`Power-up clicked: ${type}`)
  }

  return (
    <div className="app">
      <div className="game-container">
        {/* Show question if level has one */}
        {currentLevelData.askQuestion && showQuestion && (
          <QuestionDisplay
            question={currentLevelData.askQuestion}
            onComplete={handleQuestionComplete}
          />
        )}

        {/* Show question in top bar after animation completes */}
        {currentLevelData.askQuestion && questionCompleted && (
          <div className="question-topbar">
            <p className="question-topbar-text">
              {currentLevelData.askQuestion}
            </p>
          </div>
        )}

        <div className="game-card">
          <div className="game-header">
            <div className="game-header-top">
              <button className="header-button" onClick={handlePause}>
                <span className="material-symbols-outlined">pause</span>
              </button>
            </div>
            <div className="game-header-timer">
              <Timer
                timeLeft={timer.timeLeft}
                totalTime={currentLevelData.timer}
              />
            </div>
          </div>

          <div className="game-content">
            <GameBoard
              level={currentLevelData}
              selectedCells={selectedCells}
              onCellClick={handleCellClick}
              onWin={handleWin}
              onLose={handleLose}
              settings={settings}
            />
          </div>

          {/* <div className="powerup-buttons">
            <button
              className="powerup-button"
              onClick={() => handlePowerUp('hourglass')}
              title="Hourglass"
            >
              <span className="material-symbols-outlined">hourglass_empty</span>
            </button>
            <button
              className="powerup-button"
              onClick={() => handlePowerUp('magnify')}
              title="Magnify"
            >
              <span className="material-symbols-outlined">search</span>
            </button>
            <button
              className="powerup-button"
              onClick={() => handlePowerUp('bomb')}
              title="Bomb"
            >
              <span className="material-symbols-outlined">bomb</span>
            </button>
          </div> */}
        </div>

        {gameState.isPaused && (
          <PauseMenu
            onResume={handleResume}
            onRestart={handleRetry}
            onMainMenu={handleMainMenu}
            settings={settings}
            onUpdateSettings={updateSettings}
          />
        )}

        {screen === 'gameOver' && !gameState.isWon && (
          <TimeUpScreen onRestart={handleRetry} onMainMenu={handleMainMenu} />
        )}

        {screen === 'wrongAnswer' && (
          <WrongAnswer onRestart={handleRetry} onMainMenu={handleMainMenu} />
        )}

        {screen === 'gameOver' && gameState.isWon && (
          <LevelComplete
            onNextLevel={handleNextLevel}
            onMainMenu={handleMainMenu}
            currentLevel={currentLevel}
            stars={3}
          />
        )}
      </div>
    </div>
  )
}

export default App
