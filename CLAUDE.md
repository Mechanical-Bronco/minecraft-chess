# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Minecraft Chess is a 3D chess game with Minecraft-themed voxel graphics, built as a web development teaching project. It features a complete chess engine (via chess.js), AI opponent (minimax), and smooth piece animations.

## Commands

```bash
# Development (from 04_Code/chess_game/)
npm run dev          # Start dev server at http://localhost:3000
npm test             # Run tests in watch mode
npm test -- --run    # Run tests once
npm run build        # Production build
npm run lint         # ESLint
```

## Architecture

### Data Flow
User Interaction → `useChessGame` hook → chess.js validation → piece state update → React re-render → `useFrame` animation

### Key Files

**State Management**: `src/hooks/useChessGame.ts`
- Central game logic hook wrapping chess.js
- Manages persistent `PieceInstance[]` with stable IDs for smooth animations
- Context-aware undo: 2 plies with AI enabled, 1 ply in PvP mode
- Critical: Uses functional state updates (`setMoveHistory(prev => ...)`) to avoid stale closures

**3D Rendering**:
- `src/components/Scene.tsx` - Canvas setup, HUD, providers, keyboard shortcuts (P: toggle style, Ctrl+Z: undo, R: reset)
- `src/components/ChessBoard.tsx` - 8x8 grid with merged geometry for performance, invisible hitbox overlays for raycasting
- `src/components/ChessPiece.tsx` - Voxel piece rendering with `useFrame` + `Vector3.lerp` for smooth movement

**Services**:
- `src/game/aiService.ts` - Minimax with alpha-beta pruning (depth 2), 15% randomization for novice play
- `src/game/soundManager.ts` - Procedural Web Audio API sounds (no audio files)

**Types**: `src/game/types.ts` - Core interfaces including `PieceInstance` for animation tracking

### Directory Structure
```
04_Code/chess_game/src/
├── app/           # Next.js App Router
├── components/    # React + Three.js components
├── game/          # Types, AI, sounds, geometry utils
├── hooks/         # useChessGame (central state)
└── styles/        # CSS Modules
```

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript (strict mode)
- Three.js via React Three Fiber + Drei
- chess.js for move validation
- Vitest + Testing Library for tests

## Key Patterns

**Piece Identity**: Each piece has a stable `id` to preserve React identity during animations. When pieces move, their `square` property updates but `id` remains constant.

**Functional State Updates**: Always use `setState(prev => ...)` pattern in useChessGame to avoid stale closure bugs (documented in `03_Plan/BUGFIX_UNDO.md`).

**Orthographic Camera**: Uses isometric projection (70x zoom) for Minecraft aesthetic.

## Project Documentation

- `03_Plan/task.md` - Phase checklist (Phases 0-5 complete)
- `03_Plan/implementation_plan.md` - Technical specs for features
- `04_Code/chess_game/ARCHITECTURE.md` - Detailed architecture docs
