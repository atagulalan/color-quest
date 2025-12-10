export type Shape = 'box' | 'heart' | 'circle' | 'star';

export interface Level {
  level: number;
  size: number; // 2-7
  timer: number; // 10 for 2x2/3x3, 15 for others
  colorLikeness: number; // 0-1, higher = more similar
  color: string; // hex color
  backgroundColor: string; // hex color
  differentColors: number; // number of different colored cells
  shape: Shape;
  askQuestion?: string; // optional question to display
}

export interface GameSettings {
  vibration: boolean;
  music: boolean;
  sound: boolean;
}

export interface GameState {
  currentLevel: number;
  isPaused: boolean;
  isGameOver: boolean;
  isWon: boolean;
  selectedCell: number | null;
}

export interface CellData {
  index: number;
  color: string;
  isDifferent: boolean;
}

