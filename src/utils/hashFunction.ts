/**
 * Seeded random number generator for deterministic randomness
 * Uses a simple hash function to generate consistent random values per level
 */

/**
 * Generates a hash from a seed string
 * @param seed - The seed value (e.g., level number)
 * @returns A hash value
 */
export function hash(seed: number): number {
  const str = seed.toString();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Seeded random number generator
 * Returns a pseudo-random number between 0 and 1 based on seed
 * @param seed - The seed value
 * @returns A pseudo-random number between 0 and 1
 */
export function seededRandom(seed: number): number {
  const h = hash(seed);
  // Use a simple linear congruential generator
  const a = 1664525;
  const c = 1013904223;
  const m = Math.pow(2, 32);
  return ((a * h + c) % m) / m;
}

/**
 * Generates a random number in a range using a seed
 * @param seed - Base seed value
 * @param offset - Additional offset for different sequences
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns A random number in the specified range
 */
export function seededRandomRange(
  seed: number,
  offset: number,
  min: number,
  max: number
): number {
  const random = seededRandom(seed + offset);
  return Math.floor(random * (max - min + 1)) + min;
}

/**
 * Generates a random float in a range using a seed
 * @param seed - Base seed value
 * @param offset - Additional offset for different sequences
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (exclusive)
 * @returns A random float in the specified range
 */
export function seededRandomFloat(
  seed: number,
  offset: number,
  min: number,
  max: number
): number {
  const random = seededRandom(seed + offset);
  return random * (max - min) + min;
}

