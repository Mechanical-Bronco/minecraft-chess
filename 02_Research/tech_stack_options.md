# Tech Stack Research - Minecraft Chess Game

## Framework: Next.js 14+ with TypeScript

### Why Next.js?

- **App Router**: Modern React patterns with server/client components
- **TypeScript Integration**: First-class TS support out of the box
- **Performance**: Automatic code splitting, optimized bundling
- **Developer Experience**: Fast Refresh, excellent error messages
- **Static Export**: Can export as static site for simple hosting

### Configuration

```bash
npx create-next-app@latest chess_game \
  --typescript \
  --app \
  --no-tailwind \
  --eslint \
  --src-dir \
  --import-alias "@/*"
```

## Chess Logic Library

### Option 1: chess.js ✅ RECOMMENDED

- **Repo**: <https://github.com/jhlywa/chess.js>
- **Size**: ~30KB minified
- **Features**:
  - Complete chess rules validation
  - Move generation and validation
  - FEN/PGN support
  - Check/checkmate detection
  - Move history with undo
- **TypeScript**: Community types via `@types/chess.js`
- **Why**: Battle-tested, lightweight, perfect for our needs

### Option 2: chessboardjsx

- Less suitable (includes UI we'll build ourselves)

### Option 3: Stockfish.js

- Overkill for this project (UCI chess engine)
- Better for advanced AI analysis

**Decision**: Use `chess.js` for game logic

## 3D Rendering Library

### Option 1: Three.js ✅ RECOMMENDED

- **Repo**: <https://github.com/mrdoob/three.js>
- **Size**: ~600KB minified (tree-shakeable)
- **Features**:
  - Complete WebGL abstraction
  - Built-in geometry (BoxGeometry for voxels)
  - Lighting and materials
  - Animation system
  - OrbitControls for camera
- **TypeScript**: Official @types/three
- **React Integration**: @react-three/fiber, @react-three/drei
- **Why**: Industry standard, excellent docs, perfect for blocky Minecraft style

### Option 2: Babylon.js

- More game-engine focused (heavier)
- Steeper learning curve

### Option 3: PlayCanvas

- Requires external editor

**Decision**: Use Three.js with React Three Fiber

## React Three Fiber Ecosystem

### @react-three/fiber

- React renderer for Three.js
- Declarative 3D scene composition
- Hooks for animations and interactions

### @react-three/drei

- Helper components and utilities
- OrbitControls, Camera helpers
- Texture loading utilities
- Performance optimization tools

### @react-three/postprocessing

- (Optional) For visual effects
- Bloom, outline effects for selection

## Styling Approach

### Vanilla CSS with CSS Modules ✅ RECOMMENDED

```
src/styles/
├── globals.css          # CSS variables, reset, fonts
├── Board.module.css     # Board-specific styles
├── Controls.module.css  # UI controls
└── theme.css            # Minecraft theme tokens
```

**Why**: Full control, predictable, easy to learn

### CSS Variables for Theming

```css
:root {
  --mc-grass: #7cbd6b;
  --mc-dirt: #8b6e4e;
  --mc-stone: #7f7f7f;
  --mc-wood: #9c7853;
  --font-minecraft: 'Minecraft', monospace;
}
```

## AI Algorithm

### Minimax with Alpha-Beta Pruning

- **Algorithm**: Standard game tree search
- **Optimization**: Alpha-beta pruning (reduce search space)
- **Evaluation**: Material count + position scoring
- **Depth**: Adjustable (3-5 ply for Easy, 6-8 for Medium, 9+ for Hard)

### Libraries Considered

- **Option 1**: Implement from scratch ✅ RECOMMENDED (educational)
- **Option 2**: Use lozza (chess engine) - overkill
- **Option 3**: Stockfish.js - too heavy

**Decision**: Custom minimax implementation using chess.js move generation

## State Management

### React Hooks ✅ RECOMMENDED

```typescript
// Game state
const [game, setGame] = useState(new Chess());
const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
const [validMoves, setValidMoves] = useState<string[]>([]);

// Or useReducer for complex state
const [gameState, dispatch] = useReducer(gameReducer, initialState);
```

**Why**: Built-in, no extra dependencies, sufficient for single-player game

### Alternatives Considered

- Zustand: Unnecessary for this scope
- Redux: Overkill for local state
- Jotai/Recoil: Not needed

## Font & Assets

### Minecraft Font

- **Source**: Google Fonts or self-hosted
- **Alternative**: "Press Start 2P" (similar pixel font)
- **Fallback**: Monospace system font

### Textures

- **Generate**: Use your `generate_image` tool for Minecraft-style textures
- **Format**: PNG with transparency
- **Optimization**: Compress with Squoosh/TinyPNG
- **Storage**: `public/textures/` directory

### 3D Models

- **Approach**: Procedural generation with Three.js BoxGeometry
- **Alternative**: Load .glb files if needed (overkill)
- **Voxel Style**: Stack cubes to create blocky pieces

## Development Tools

### Package Manager

```bash
npm install chess.js
npm install three @types/three
npm install @react-three/fiber @react-three/drei
npm install --save-dev @types/chess.js
```

### TypeScript Configuration

- Strict mode enabled
- Path aliases (@/components, @/game, @/styles)
- ESLint with TypeScript rules

### Development Server

```bash
npm run dev  # Runs on http://localhost:3000
```

## Final Recommended Stack

| Category | Technology | Version | Rationale |
|----------|-----------|---------|-----------|
| Framework | Next.js | 14+ | Modern React, App Router, TS support |
| Language | TypeScript | 5+ | Type safety, better DX |
| Chess Logic | chess.js | Latest | Lightweight, complete rules |
| 3D Rendering | Three.js | r160+ | Industry standard, well-documented |
| React 3D | @react-three/fiber | 8+ | Declarative Three.js in React |
| Utilities | @react-three/drei | 9+ | Helper components |
| Styling | CSS Modules | Built-in | Full control, scoped styles |
| AI | Custom Minimax | N/A | Educational value |
| State | React Hooks | Built-in | Sufficient for scope |
| Testing | Jest + RTL | Built-in | Standard Next.js setup |

## Installation Commands

```bash
# Navigate to project location
cd /Users/djacobsohn/.gemini/antigravity/playground/spinning-feynman/04_Code

# Create Next.js app
npx create-next-app@latest chess_game \
  --typescript \
  --app \
  --no-tailwind \
  --eslint \
  --src-dir \
  --import-alias "@/*"

# Navigate into project
cd chess_game

# Install chess logic
npm install chess.js
npm install --save-dev @types/chess.js

# Install 3D rendering
npm install three @types/three
npm install @react-three/fiber @react-three/drei

# Optional: Install leva for dev controls
npm install --save-dev leva
```

---

**Total Bundle Estimate**: ~650KB (before tree-shaking and compression)  
**Expected Gzipped**: ~180KB  
**Load Time (3G)**: ~2 seconds  
**Development Start**: Ready to proceed with Phase 1
