import React, { useMemo, useEffect } from 'react'
import { GameCell } from './GameCell'
import { generateDifferentCellPositions } from '../utils/levelGenerator'
import { generateSimilarColor } from '../utils/colorUtils'
import type { Level, CellData } from '../types/gameTypes'
import './GameBoard.css'

interface GameBoardProps {
  level: Level
  selectedCells: Set<number>
  onCellClick: (index: number) => void
  onWin: () => void
  onLose: () => void
  settings: { vibration: boolean; sound: boolean }
}

export const GameBoard: React.FC<GameBoardProps> = ({
  level,
  selectedCells,
  onCellClick,
  onWin,
  onLose,
  settings
}) => {
  // Generate a random seed once per level for random cell positions
  const randomSeed = useMemo(() => {
    return Math.floor(Math.random() * 1000000)
  }, [level.level])

  // Generate cell positions for different colors with random seed
  const differentPositions = useMemo(() => {
    return generateDifferentCellPositions(level, randomSeed)
  }, [level, randomSeed])

  // Generate cell data
  const cells = useMemo(() => {
    const totalCells = level.size * level.size
    const cellData: CellData[] = []

    // Generate a similar color based on the level color and colorLikeness
    const similarColor = generateSimilarColor(
      level.color,
      level.colorLikeness,
      level.level
    )

    for (let i = 0; i < totalCells; i++) {
      const isDifferent = differentPositions.includes(i)
      cellData.push({
        index: i,
        color: isDifferent ? level.color : similarColor,
        isDifferent
      })
    }

    return cellData
  }, [level, differentPositions])

  // Check win condition
  useEffect(() => {
    if (selectedCells.size === 0) return

    const selectedArray = Array.from(selectedCells)
    const allDifferentSelected = differentPositions.every((pos) =>
      selectedArray.includes(pos)
    )
    const onlyDifferentSelected = selectedArray.every((pos) =>
      differentPositions.includes(pos)
    )

    if (
      allDifferentSelected &&
      onlyDifferentSelected &&
      selectedCells.size === differentPositions.length
    ) {
      // Win!
      if (settings.vibration && 'vibrate' in navigator) {
        navigator.vibrate(200)
      }
      onWin()
    } else if (selectedArray.some((pos) => !differentPositions.includes(pos))) {
      // Wrong cell selected - lose
      if (settings.vibration && 'vibrate' in navigator) {
        navigator.vibrate([100, 50, 100])
      }
      onLose()
    }
  }, [selectedCells, differentPositions, onWin, onLose, settings.vibration])

  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: `repeat(${level.size}, 1fr)`
  }

  return (
    <div className="game-board" style={gridStyle}>
      {cells.map((cell) => (
        <GameCell
          key={cell.index}
          color={cell.color}
          shape={level.shape}
          isDifferent={cell.isDifferent}
          isSelected={selectedCells.has(cell.index)}
          onClick={() => onCellClick(cell.index)}
        />
      ))}
    </div>
  )
}
