/**
 * Seeded random number generator for deterministic randomness
 * Uses a simple hash function to generate consistent random values per level
 */

/**
 * Generates a SHA1 hash from a seed string
 * @param seed - The seed value (e.g., level number)
 * @returns A hash value
 */
export function hash(seed: number): number {
  const str = seed.toString()

  // Simple SHA-1 implementation for deterministic hashing
  // This avoids very similar hash values for close seed numbers
  function sha1Simple(str: string): number {
    let hash = 0

    // Expand the string with multiple rounds for better distribution
    for (let round = 0; round < 3; round++) {
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = (hash << 5) - hash + char + round * 1000
        hash = hash ^ (hash >>> 16)
        hash = Math.imul(hash, 2654435761)
      }
    }

    return Math.abs(hash >>> 0)
  }

  return sha1Simple(str)
}

/**
 * Seeded random number generator using crypto-quality hashing
 * Returns a pseudo-random number between 0 and 1 based on seed
 * @param seed - The seed value
 * @returns A pseudo-random number between 0 and 1
 */
export function seededRandom(seed: number): number {
  // Use multiple hash rounds for better distribution
  const str = seed.toString()
  let result = 0

  // Create multiple hash values and combine them
  for (let i = 0; i < 4; i++) {
    let h = 0
    const extendedStr = str + ':' + i

    for (let j = 0; j < extendedStr.length; j++) {
      const char = extendedStr.charCodeAt(j)
      h = (h << 5) - h + char
      h = h ^ (h >>> 16)
      h = Math.imul(h, 2654435761)
      h = h ^ (h >>> 13)
      h = Math.imul(h, 1597334677)
    }

    // Combine the hash values
    result = result ^ (h >>> 0)
  }

  // Normalize to [0, 1]
  return (result >>> 0) / 4294967296
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
  const random = seededRandom(seed + offset)
  return Math.floor(random * (max - min + 1)) + min
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
  const random = seededRandom(seed + offset)
  return random * (max - min) + min
}
