// Simple script to generate levels.json
// This will be run with Node to generate the levels file

// Copy the hash function logic
function hash(seed) {
  const str = seed.toString();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function seededRandom(seed) {
  const h = hash(seed);
  const a = 1664525;
  const c = 1013904223;
  const m = Math.pow(2, 32);
  return ((a * h + c) % m) / m;
}

function seededRandomRange(seed, offset, min, max) {
  const random = seededRandom(seed + offset);
  return Math.floor(random * (max - min + 1)) + min;
}

function seededRandomFloat(seed, offset, min, max) {
  const random = seededRandom(seed + offset);
  return random * (max - min) + min;
}

// HSL to RGB conversion
function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
      default: h = 0;
    }
  }
  return [h, s, l];
}

function generateColor(seed) {
  const h = seededRandomFloat(seed, 0, 0, 1);
  const s = seededRandomFloat(seed, 1, 0.4, 0.9);
  const l = seededRandomFloat(seed, 2, 0.3, 0.7);
  const [r, g, b] = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

function generateSimilarColor(baseColor, colorLikeness, seed) {
  const [r, g, b] = hexToRgb(baseColor);
  const [h, s, l] = rgbToHsl(r, g, b);
  const variation = (1 - colorLikeness) * 0.3;
  const hueVariation = seededRandomFloat(seed, 10, -variation, variation);
  let newH = (h + hueVariation) % 1;
  if (newH < 0) newH += 1;
  const satVariation = seededRandomFloat(seed, 11, -variation * 0.5, variation * 0.5);
  const newS = Math.max(0.1, Math.min(1, s + satVariation));
  const lightVariation = seededRandomFloat(seed, 12, -variation * 0.3, variation * 0.3);
  const newL = Math.max(0.1, Math.min(0.9, l + lightVariation));
  const [newR, newG, newB] = hslToRgb(newH, newS, newL);
  return rgbToHex(newR, newG, newB);
}

function increaseColorSimilarity(level) {
  const baseSimilarity = 0.0;
  const maxSimilarity = 0.85;
  const progression = (level - 1) / 99;
  return Math.min(maxSimilarity, baseSimilarity + progression * (maxSimilarity - baseSimilarity));
}

function increaseGridComplexity(level) {
  let size = 2;
  if (level >= 3) size = 3;   // Level 3-4: 3x3
  if (level >= 5) size = 4;   // Level 5-7: 4x4
  if (level >= 8) size = 5;   // Level 8-10: 5x5
  if (level > 60) size = 6;   // Level 61+: 6x6
  if (level > 85) size = 7;   // Level 86+: 7x7
  let differentColors = 1;
  if (level > 50) differentColors = 2;
  if (level > 85) differentColors = 3;
  return { size, differentColors };
}

function getTimerForSize(size) {
  return size <= 3 ? 10 : 15;
}

function selectShape(level) {
  const shapes = ['box', 'heart', 'circle', 'star'];
  const randomIndex = seededRandomRange(level, 100, 0, shapes.length - 1);
  return shapes[randomIndex];
}

function generateLevel(levelNumber) {
  const colorLikeness = increaseColorSimilarity(levelNumber);
  const { size, differentColors } = increaseGridComplexity(levelNumber);
  const timer = getTimerForSize(size);
  const shape = selectShape(levelNumber);
  const backgroundColor = generateColor(levelNumber);
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

function generateAllLevels() {
  const levels = [];
  for (let i = 1; i <= 100; i++) {
    levels.push(generateLevel(i));
  }
  return levels;
}

// Generate and write levels
const fs = require('fs');
const path = require('path');

const levels = generateAllLevels();
const outputPath = path.join(__dirname, '..', 'public', 'assets', 'levels.json');

// Ensure directory exists
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(levels, null, 2));
console.log(`Generated ${levels.length} levels to ${outputPath}`);

