import { seededRandomRange } from './hashFunction'
import type { Shape } from '../types/gameTypes'

/**
 * Function 1: Increases color similarity as levels progress
 * Higher colorLikeness means colors are more similar (harder to distinguish)
 * @param level - Current level number (1-100)
 * @returns colorLikeness value between 0 and 1
 */
export function increaseColorSimilarity(level: number): number {
  // Start with very low similarity (very easy) and gradually increase
  // Level 1: 0.0 (very different colors), Level 50: ~0.5, Level 100: ~0.85
  const baseSimilarity = 0.0
  const maxSimilarity = 0.85
  const progression = (level - 1) / 99 // 0 to 1 over 100 levels

  return Math.min(
    maxSimilarity,
    baseSimilarity + progression * (maxSimilarity - baseSimilarity)
  )
}

/**
 * Function 2: Increases grid size and/or number of different colors
 * @param level - Current level number (1-100)
 * @returns Object with size and differentColors
 */
export function increaseGridComplexity(level: number): {
  size: number
  differentColors: number
} {
  // Grid size progression: 2→3→4→5→6→7
  // Size increases quickly in first 10 levels, then more gradually
  let size = 2
  if (level >= 3) size = 3 // Level 3-4: 3x3
  if (level >= 5) size = 4 // Level 5-7: 4x4
  if (level >= 8) size = 5 // Level 8-10: 5x5
  if (level > 60) size = 6 // Level 61+: 6x6
  if (level > 85) size = 7 // Level 86+: 7x7

  // Number of different colors: starts at 1, increases later
  let differentColors = 1
  if (level > 50) differentColors = 2
  if (level > 85) differentColors = 3

  return { size, differentColors }
}

/**
 * Determines timer duration based on grid size
 * @param size - Grid size (2-7)
 * @returns Timer duration in seconds
 */
export function getTimerForSize(size: number): number {
  // 2x2 and 3x3 get 10 seconds, others get 15
  return size <= 3 ? 10 : 15
}

/**
 * Selects a random shape for the level using seeded random
 * @param level - Level number for seeding
 * @returns Shape type
 */
export function selectShape(level: number): Shape {
  const shapes: Shape[] = ['box', 'heart', 'circle', 'star']
  const randomIndex = seededRandomRange(level, 100, 0, shapes.length - 1)
  return shapes[randomIndex]
}
