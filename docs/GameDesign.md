# Game Design Document
## Color Find Game

### 1. Game Overview

**Genre**: Puzzle, Skill-based
**Platform**: Web (Desktop & Mobile)
**Target Audience**: Casual puzzle game players
**Core Mechanic**: Identify the differently colored cell(s) in a grid before time runs out

### 2. Core Gameplay

#### 2.1 Objective
Players must identify and click/tap on the cell(s) that have a different color from the rest of the grid within the time limit.

#### 2.2 Basic Rules
1. A grid of cells is displayed with a background color
2. Most cells share the same color (background color)
3. One or more cells have a slightly different color
4. Player must identify and select the different colored cell(s)
5. Success: Select all different cells before timer expires
6. Failure: Timer expires or wrong cell selected

#### 2.3 Win Condition
- All different colored cells are correctly identified
- Timer has not expired

#### 2.4 Lose Condition
- Timer expires
- Wrong cell is selected

### 3. Level Progression

#### 3.1 Level Structure
- **Total Levels**: 100
- **Early Levels (1-20)**: 2x2 and 3x3 grids
- **Mid Levels (21-60)**: 4x4 and 5x5 grids
- **Late Levels (61-100)**: 6x6 and 7x7 grids

#### 3.2 Difficulty Progression

**Function 1: Color Similarity Increase**
- Starts with easily distinguishable colors (colorLikeness: 0.1-0.3)
- Gradually increases similarity (colorLikeness: 0.3-0.7)
- End levels have very similar colors (colorLikeness: 0.7-0.95)
- Formula: `colorLikeness = min(0.95, 0.1 + (level / 100) * 0.85)`

**Function 2: Grid Complexity Increase**
- Grid size progression: 2→3→4→5→6→7
- Number of different colors: Starts at 1, increases to 2-3 in later levels
- Formula: 
  - Size: `2 + floor((level - 1) / 20)` capped at 7
  - Different colors: `1 + floor((level - 1) / 50)` capped at 3

#### 3.3 Timer System
- **2x2 and 3x3 grids**: 10 seconds
- **4x4 and above**: 15 seconds
- **Audio feedback**: Clock tick sound plays in last 5 seconds
- Timer pauses when game is paused

### 4. Visual Design

#### 4.1 Grid Layout
- Centered on screen
- Responsive sizing for mobile/desktop
- Cells arranged in perfect grid
- Spacing between cells for clarity

#### 4.2 Shapes
- **Box**: Square/rectangle (default)
- **Heart**: Heart shape
- **Circle**: Circular shape
- **Star**: Star shape
- Shape selection uses seeded random per level

#### 4.3 Color System
- Background color: Base color for most cells
- Different color: Slightly modified version of background
- Color modification based on colorLikeness value
- Colors generated using HSL color space for better control

#### 4.4 UI Layout
```
┌─────────────────────────────────┐
│ [Pause]    [Timer]    [Settings]│
│                                 │
│         [Game Grid]             │
│                                 │
└─────────────────────────────────┘
```

### 5. Audio Design

#### 5.1 Sound Effects
- **Clock Tick**: Plays every second in last 5 seconds
- **Correct Selection**: Positive feedback sound
- **Wrong Selection**: Negative feedback sound
- **Level Complete**: Success sound
- **Game Over**: Failure sound

#### 5.2 Music
- Optional background music
- Can be toggled in settings
- Looping ambient track

### 6. User Interface

#### 6.1 Main Menu
- Start Game button
- Settings access
- Level selection (optional, for future)

#### 6.2 Game Screen
- Top bar: Pause (left), Timer (center), Settings (right)
- Game grid (center)
- Visual feedback on cell selection

#### 6.3 Pause Menu
- Resume button
- Main Menu button
- Semi-transparent overlay

#### 6.4 Settings Menu
- Vibration toggle (mobile)
- Music toggle
- Sound effects toggle
- Close button

#### 6.5 Game Over Screen
- Win/Lose message
- Next Level button (if won)
- Retry button
- Main Menu button

### 7. Technical Design

#### 7.1 Color Generation
- Use HSL color space for color manipulation
- Seeded random number generator based on level number
- Generate base color from seed
- Modify lightness/saturation for different color based on colorLikeness

#### 7.2 Level Generation Algorithm
1. Use level number as seed for random generator
2. Generate base background color
3. Calculate colorLikeness from difficulty function
4. Generate different color(s) based on colorLikeness
5. Randomly place different colored cells
6. Select shape using seeded random
7. Store level data in levels.json

#### 7.3 State Management
- Current level number
- Game state (playing, paused, game over)
- Timer state
- Settings state
- Selected cells

### 8. Mobile Considerations

#### 8.1 Touch Interactions
- Large touch targets (minimum 44x44px)
- Visual feedback on touch
- Haptic feedback (vibration) on correct/wrong selection

#### 8.2 Responsive Design
- Grid scales to fit screen
- Font sizes adapt to screen size
- Buttons sized for touch
- Landscape and portrait support

#### 8.3 Performance
- Optimize rendering for mobile devices
- Efficient color calculations
- Smooth animations (60fps target)

### 9. Progression Curve

#### 9.1 Early Levels (1-20)
- Easy color distinction
- Small grids (2x2, 3x3)
- Single different color
- 10-second timer
- Learning phase

#### 9.2 Mid Levels (21-60)
- Moderate color similarity
- Medium grids (4x4, 5x5)
- 1-2 different colors
- 15-second timer
- Skill building

#### 9.3 Late Levels (61-100)
- High color similarity
- Large grids (6x6, 7x7)
- 2-3 different colors
- 15-second timer
- Expert challenge

### 10. Future Enhancements (Optional)

- Level editor
- Custom color palettes
- Achievement system
- Leaderboards
- Daily challenges
- Hint system
- Power-ups

