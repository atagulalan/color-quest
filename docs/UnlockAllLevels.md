# Unlock All Levels Feature

## Overview
This feature allows you to unlock all levels in the game using localStorage.

## How to Use

### Enable All Levels
To unlock all levels, open your browser's console (F12) and run:

```javascript
localStorage.setItem('colorFindUnlockedAll', 'true');
```

Then refresh the page. All 100 levels will now be visible and playable.

### Disable and Return to Normal
To disable this feature and return to normal progression:

```javascript
localStorage.removeItem('colorFindUnlockedAll');
```

Or set it to false:

```javascript
localStorage.setItem('colorFindUnlockedAll', 'false');
```

Then refresh the page.

## Technical Details

- **localStorage Key**: `colorFindUnlockedAll`
- **Value**: `'true'` to enable, `'false'` or removed to disable
- **Effect**: 
  - All levels become visible in the main menu
  - All levels become playable
  - Current level is set to 100 when first enabled
  - Normal level progression is restored when disabled

## Implementation

The feature is implemented in:
- `src/hooks/useGameState.ts`: Checks for the flag on initialization
- `src/components/MainMenu.tsx`: Uses the flag to determine which levels to show and unlock

