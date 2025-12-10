/**
 * Script to generate levels.json using the shared level generation utilities
 * This ensures consistency between the generated JSON and runtime level generation
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { generateAllLevels } from '../src/utils/levelGenerator.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate all levels using the shared utility
const levels = generateAllLevels();

// Define output path
const outputPath = path.join(__dirname, '..', 'public', 'assets', 'levels.json');

// Ensure directory exists
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Write levels to file
fs.writeFileSync(outputPath, JSON.stringify(levels, null, 2));
console.log(`Generated ${levels.length} levels to ${outputPath}`);

