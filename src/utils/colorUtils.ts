import { seededRandomFloat } from './hashFunction'

/**
 * Converts HSL to RGB
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

/**
 * Converts RGB to hex string
 */
function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

/**
 * Converts hex to RGB
 */
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ]
    : [0, 0, 0]
}

/**
 * Converts RGB to HSL
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h: number, s: number
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
      default:
        h = 0
    }
  }

  return [h, s, l]
}

/**
 * Generates a random color using seeded random
 * @param seed - Level number for seeding
 * @returns Hex color string
 */
export function generateColor(seed: number): string {
  const h = seededRandomFloat(seed, 0, 0, 1) // Hue: 0-1
  const s = seededRandomFloat(seed, 1, 0.4, 0.9) // Saturation: 0.4-0.9
  const l = seededRandomFloat(seed, 2, 0.3, 0.7) // Lightness: 0.3-0.7

  const [r, g, b] = hslToRgb(h, s, l)
  return rgbToHex(r, g, b)
}

/**
 * Generates a similar color based on colorLikeness
 * Higher colorLikeness (closer to 1) means colors are more similar
 * @param baseColor - Base hex color
 * @param colorLikeness - Similarity factor (0-1)
 * @param seed - Seed for randomness
 * @returns Hex color string
 */
export function generateSimilarColor(
  baseColor: string,
  colorLikeness: number,
  seed: number
): string {
  console.log(
    'baseColor',
    baseColor,
    'colorLikeness',
    colorLikeness,
    'seed',
    seed
  )
  const [r, g, b] = hexToRgb(baseColor)
  const [h, s, l] = rgbToHsl(r, g, b)

  // Calculate how much to vary the color
  // Higher colorLikeness = less variation
  const variation = (1 - colorLikeness) * 0.3 // Max 30% variation

  // Vary hue slightly
  const hueVariation = seededRandomFloat(
    seed,
    10,
    -variation * 0.4,
    variation * 0.4
  )
  let newH = (h + hueVariation) % 1
  if (newH < 0) newH += 1

  // Vary saturation slightly
  const satVariation = seededRandomFloat(
    seed,
    11,
    -variation * 0.5,
    variation * 0.5
  )
  const newS = Math.max(0.1, Math.min(1, s + satVariation))

  // Vary lightness slightly
  const lightVariation = seededRandomFloat(
    seed,
    12,
    -variation * 0.3,
    variation * 0.3
  )
  const newL = Math.max(0.1, Math.min(0.9, l + lightVariation))

  const [newR, newG, newB] = hslToRgb(newH, newS, newL)
  return rgbToHex(newR, newG, newB)
}

/**
 * Calculates color similarity between two colors
 * Returns a value between 0 (completely different) and 1 (identical)
 * @param color1 - First hex color
 * @param color2 - Second hex color
 * @returns Similarity value (0-1)
 */
export function calculateColorSimilarity(
  color1: string,
  color2: string
): number {
  const [r1, g1, b1] = hexToRgb(color1)
  const [r2, g2, b2] = hexToRgb(color2)

  // Calculate Euclidean distance in RGB space
  const distance = Math.sqrt(
    Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2)
  )

  // Normalize to 0-1 (max distance in RGB is sqrt(3 * 255^2) ≈ 441.67)
  const maxDistance = Math.sqrt(3 * Math.pow(255, 2))
  const similarity = 1 - distance / maxDistance

  return Math.max(0, Math.min(1, similarity))
}
