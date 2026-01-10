# Minecraft Chess - Architecture Documentation

## Overview

This project is a 3D Chess game built with **Next.js**, **React Three Fiber (R3F)**, and **chess.js**. It features a Minecraft-inspired voxel aesthetic, a robust state management system, and an integrated AI opponent.

## Core Architecture

The application follows a unidirectional data flow pattern, separating **Game Logic**, **Rendering**, and **Interaction**.

### 1. Game State Management (`GameProvider` & `useChessGame`)

The heart of the application is the `useChessGame` hook (located in `src/hooks/useChessGame.ts`). It manages:

- **Chess Rules**: Wraps `chess.js` to validate moves, checking, and game-over states.
- **Move History**: Maintains a custom move history stack to support detailed Undo/Redo operations, including AI move rollbacks.
- **Piece Persistence**: Maps ephemeral chess board states to persistent `PieceInstance` objects with stable IDs. This is critical for animating pieces (React needs stable keys to tween positions instead of unmounting/remounting).
- **AI Integration**: Triggers the `getAiMove` service when it's Black's turn.

**Key Hook: `useChessGame`**

```typescript
interface UseChessGameReturn {
  game: Chess;             // Raw chess.js instance
  pieces: PieceInstance[]; // Animated 3D piece data
  makeMove: (move: Move) => void;
  undoMove: () => void;    // Context-aware undo
  isAiEnabled: boolean;
  // ...
}
```

### 2. 3D Rendering Layer (`Scene.tsx`, `ChessBoard.tsx`)

Visuals are handled by React Three Fiber components. We use an **Orthographic Camera** to achieve the distinct "isometric" Minecraft look.

- **Scene**: Sets up lighting, camera, and the generic environment.
- **ChessBoard**: Renders the 8x8 grid. It separates the "visual" blocks (merged geometry) from the "interactive" hitboxes (invisible meshes for raycasting).
- **ChessPiece**: A memoized component that renders an individual piece.
  - *Optimization*: Uses `StandardMaterial` with vertex colors to render complex voxel models efficiently.
  - *Animation*: Uses `useFrame` and `Vector3.lerp` to smoothly slide pieces to their new coordinates whenever the `position` prop changes.

### 3. Services

#### AI Service (`aiService.ts`)

A decoupled module performing move calculation.

- **Algorithm**: Minimax with Alpha-Beta pruning (depth 2 for "Novice").
- **Evaluation**: Material-heavy heuristic with slight positional bias (center control).
- **Input/Output**: Receives a FEN string/Chess object, returns a `Move` object.

#### Sound Manager (`soundManager.ts`)

A procedural audio generator using the Web Audio API.

- **No Assets**: Generates 8-bit style "bleeps" and "bloops" on the fly (square waves, noise buffers) to match the retro aesthetic without loading mp3 files.

## Directory Structure

```
src/
├── app/                 # Next.js App Router entry points
├── components/          # React Components
│   ├── Scene.tsx        # Main 3D Canvas wrapper
│   ├── ChessBoard.tsx   # Board logic & rendering
│   ├── ChessPiece.tsx   # Individual piece rendering
│   └── ...
├── game/                # Game Logic & Utilities
│   ├── constants.ts     # Configuration (colors, sizes)
│   ├── types.ts         # TypeScript interfaces
│   ├── aiService.ts     # Minimax Logic
│   ├── soundManager.ts  # Web Audio API wrapper
│   └── geometryUtils.ts # Three.js optimization tools
├── hooks/               # Custom React Hooks
│   └── useChessGame.ts  # CENTRAL GAME LOGIC
└── styles/              # CSS Modules
```

## Data Flow Example: Making a Move

1. **User Interaction**: User clicks e2, then e4 on `ChessBoard`.
2. **Event**: `onClick` calls `selectSquare` -> `makeMove`.
3. **Logic Update**:
   - `chess.js` validates move.
   - `moveHistory` updates.
   - `pieces` state updates (e2 pawn's target square becomes e4).
   - `soundManager` triggers "Move" sound.
4. **Render Update**:
   - React re-renders `ChessPiece`.
   - `useFrame` inside `ChessPiece` sees new `position` prop.
   - Piece smoothly lerps from e2 to e4 over ~300ms.
5. **AI Trigger**: `useEffect` detects Black's turn + AI Enabled -> calls `getAiMove`.
