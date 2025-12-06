import { increaseColorSimilarity, increaseGridComplexity, getTimerForSize, selectShape } from './difficultyFunctions';
import { generateColor, generateSimilarColor } from './colorUtils';
import { seededRandomRange } from './hashFunction';
import type { Level } from '../types/gameTypes';

/**
 * Generates a single level with all its properties
 * @param levelNumber - The level number (1-100)
 * @returns Level object
 */
export function generateLevel(levelNumber: number): Level {
  // Get difficulty parameters
  const colorLikeness = increaseColorSimilarity(levelNumber);
  const { size, differentColors } = increaseGridComplexity(levelNumber);
  const timer = getTimerForSize(size);
  const shape = selectShape(levelNumber);

  // Generate base background color using level as seed
  const backgroundColor = generateColor(levelNumber);

  // Generate the different color(s) - slightly modified version
  // For simplicity, we'll use one different color for all different cells
  // but could be extended to have multiple variations
  const differentColor = generateSimilarColor(backgroundColor, colorLikeness, levelNumber + 1000);

  return {
    level: levelNumber,
    size,
    timer,
    colorLikeness,
    color: differentColor,
    backgroundColor,
    differentColors,
    shape,
  };
}

/**
 * Generates all 100 levels
 * @returns Array of Level objects
 */
export function generateAllLevels(): Level[] {
  const levels: Level[] = [];
  for (let i = 1; i <= 100; i++) {
    levels.push(generateLevel(i));
  }
  return levels;
}

/**
 * Generates cell positions for different colored cells
 * @param level - Level object
 * @param randomSeed - Optional random seed for generating different positions each time
 * @returns Array of cell indices (0-based) where different colors should be placed
 */
export function generateDifferentCellPositions(level: Level, randomSeed?: number): number[] {
  const totalCells = level.size * level.size;
  const positions: number[] = [];
  const usedPositions = new Set<number>();

  // Use random seed if provided (for gameplay), otherwise use level number (for consistent generation)
  const baseSeed = randomSeed !== undefined ? randomSeed : level.level;
  let seedOffset = 2000;

  while (positions.length < level.differentColors && positions.length < totalCells) {
    const position = seededRandomRange(baseSeed, seedOffset, 0, totalCells - 1);
    if (!usedPositions.has(position)) {
      usedPositions.add(position);
      positions.push(position);
      seedOffset++;
    }
  }

  return positions.sort((a, b) => a - b);
}

