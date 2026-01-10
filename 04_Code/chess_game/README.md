# Minecraft Chess Game

A single-player chess game with Minecraft-themed 3D graphics, built as a web development teaching project.

## Project Status

**Current Phase**: Phase 1 - Basic Chess Board Rendering (Planning)

## Tech Stack

- **Framework**: Next.js 15 with TypeScript (App Router)
- **3D Rendering**: Three.js via React Three Fiber
- **Chess Logic**: chess.js
- **Styling**: Vanilla CSS with CSS Modules
- **Package Manager**: npm

## Quick Start

```bash
# Install dependencies (already done)
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
04_Code/chess_game/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components (Scene, ChessBoard, etc.)
│   ├── game/             # Chess logic and AI
│   └── styles/           # CSS Modules
├── public/               # Static assets
└── package.json
```

## Development Methodology

This project follows an artifact-driven development workflow:

1. **task.md** - Detailed checklist of features and milestones
2. **implementation_plan.md** - Technical plans requiring approval before execution
3. **walkthrough.md** - Post-implementation verification and documentation

## Learning Objectives

- React & TypeScript component architecture
- 3D graphics with Three.js/WebGL
- Game logic and AI algorithms
- Web performance optimization
- Professional project structure

## Features Roadmap

- ✅ Phase 0: Project Initialization
- 🔄 Phase 1: Basic Chess Board Rendering
- ⏳ Phase 2: Chess Piece Models
- ⏳ Phase 3: Game Logic Integration
- ⏳ Phase 4: Chess Rules Enforcement
- ⏳ Phase 5: AI Opponent
- ⏳ Phase 6: UI/UX Polish
- ⏳ Phase 7: Responsive Design & Mobile
- ⏳ Phase 8: Testing & Documentation
- ⏳ Phase 9: Final Polish

## Documentation

See the numbered directories at project root:

- `01_Requirements/` - Project brief and goals
- `02_Research/` - Tech stack research and decisions
- `03_Plan/` - Architecture and task planning
- `05_Deploy/` - Deployment notes

---

**Created**: December 25, 2024  
**Purpose**: Teaching web development through game creation  
**Learner**: Son (with guidance)
