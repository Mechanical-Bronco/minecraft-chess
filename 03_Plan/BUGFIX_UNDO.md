# Undo Bug Fix - Stale Closure Issue

## Problem

The undo function was not working correctly because of a **stale closure bug**. When the undo button was clicked, the callback would read an outdated value of `moveHistory` from its closure scope, causing it to undo the wrong number of moves or fail entirely.

## Root Cause

```typescript
// BEFORE (Buggy):
const undoMove = useCallback(() => {
    setGame(prevGame => {
        // ❌ BUG: Reading moveHistory from closure - could be stale!
        const newHistory = moveHistory.slice(0, -pliesToUndo);
        // ...
    });
}, [moveHistory, ...]); // ❌ Causes callback to recreate frequently
```

The issue:

1. `moveHistory` is captured in the closure when `undoMove` is created
2. If the callback is not recreated (due to React's optimization), it reads the old value
3. This causes incorrect undo behavior, especially after multiple moves

## Solution

Use **functional state updates** to always read the current state value:

```typescript
// AFTER (Fixed):
const undoMove = useCallback(() => {
    // ✅ Use functional update to get current history
    setMoveHistory(prevHistory => {
        const pliesToUndo = isAiEnabled && prev History.length >= 2 ? 2 : 1;
        const newHistory = prevHistory.slice(0, -pliesToUndo);
        
        // Rebuild game from new history
        setGame(() => {
            const nextGame = new Chess();
            for (const move of newHistory) {
                nextGame.move(move);
            }
            syncPieces(nextGame.board());
            return nextGame;
        });
        
        return newHistory;
    });
}, [isAiEnabled, isAiThinking, syncPieces]); // ✅ No moveHistory dependency
```

## Benefits of This Fix

1. **Always reads current state**: Functional updates guarantee we get the latest `moveHistory`
2. **Fewer re-renders**: Removed `moveHistory` from dependencies, reducing callback recreation
3. **Atomic updates**: Both `moveHistory` and `game` state update together
4. **Type-safe**: No risk of reading stale values

## Testing

Added comprehensive test case:

- ✅ Undo after capture (e4, d5, exd5, undo)
- ✅ Verifies piece count restoration
- ✅ Verifies board state correctness
- ✅ All 6 tests passing

## Files Changed

- `src/hooks/useChessGame.ts` (lines 253-287)
- `src/hooks/__tests__/useChessGame.test.ts` (added capture undo test)
