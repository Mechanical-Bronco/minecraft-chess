# Phase 5 Refinement: Unified Undo Logic

## Goal Description

Simplify the Undo user experience by merging the "Undo" and "Undo x2" buttons. The single "Undo" button will now be intelligent: context-aware enough to roll back a full turn (User + AI) when playing against the computer, or a single move when playing PvP.

## Proposed Changes

### 1. Refined Undo Logic (Context-Aware)

#### [MODIFY] [useChessGame.ts](file:///Users/djacobsohn/Projects/brain/minecraft-chess/04_Code/chess_game/src/hooks/useChessGame.ts)

- Update `undoMove` to handle the logic internally:
  - **AI Enabled**: Undo 2 plies (User's move + AI's response).
  - **AI Disabled**: Undo 1 ply (Single move).
- Ensure the function accepts an optional `override` or works sequentially so users can mash "Undo" to go back multiple turns.

### 2. UI Simplification

#### [MODIFY] [Scene.tsx](file:///Users/djacobsohn/Projects/brain/minecraft-chess/04_Code/chess_game/src/components/Scene.tsx)

- Remove the `Undo x2` button entirely.
- Update the main `Undo` button to call the new smart `undoMove`.
- Update tooltip to reflect behavior ("Undo last turn" vs "Undo last move").

## Verification Plan

### Manual Verification

1. **AI Match**:
    - Make a move (White). Wait for AI (Black).
    - Click "Undo".
    - **Expectation**: Board reverts to state *before* White's move.
2. **PvP Match**:
    - Disable AI. make a move.
    - Click "Undo".
    - **Expectation**: Board reverts 1 move (User's move).
3. **Sequential Undo**:
    - Play 3 full turns against AI.
    - Click Undo 3 times.
    - **Expectation**: Board reverts 3 full turns to start.
