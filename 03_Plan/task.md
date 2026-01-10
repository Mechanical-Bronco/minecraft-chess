# Minecraft Chess Game - Project Task List

## Phase 0: Project Initialization

- [x] Set up numbered directory structure (01-05)
- [x] Initialize Next.js project with TypeScript
- [x] Install core dependencies (chess.js, Three.js)
- [x] Create initial requirements document
- [x] Research and finalize tech stack

## Phase 1: Basic Chess Board Rendering

- [x] Set up project architecture and design system
- [x] Create 3D board component with Minecraft textures
- [x] Implement 8x8 grid layout with alternating textures
- [x] Add basic camera controls and lighting
- [x] Verify board renders correctly in browser

## Phase 2: Chess Piece Models

- [x] Design Minecraft-style 3D piece models (voxel-based)
- [x] Create component for rendering individual pieces
- [x] Implement piece positioning on board
- [x] Add piece texture mapping (grass/dirt/stone)
- [x] Test all 12 piece types render correctly

## Phase 3: Game Logic Integration

- [x] Integrate chess.js for move validation
- [x] Implement click-to-select piece interaction
- [x] Show valid move indicators when piece selected
- [x] Implement click-to-move mechanics
- [x] Add move animation with easing transitions
- [x] Refactor for high-performance rendering (geometry merging)

## Phase 4: Chess Rules Enforcement & Special Moves (Polish)

- [x] Implement pawn promotion UI and logic
- [x] Support castling and en passant animations/updates
- [x] **Visual Polish**: Ensure castling rook slides smoothly (Verified ID stability)
- [x] **Sound Effects**: Implement Minecraft-themed sounds (Move, Capture, Castle)
- [x] **Game Over**: Add a dedicated Modal (not just HUD text) for clearer end-state
- [x] Verify all chess.js rules are strictly enforced in UI

## Phase 8: Testing & Documentation (Integrated)

- [x] Setup Jest/Vitest for unit testing
- [x] Write unit tests for `useChessGame` (AI & Undo logic)
- [x] Document code architecture for learning

## Phase 5: AI Opponent (Novice & Refined Undo)

- [x] Design AI architecture (Material evaluation + Minimax depth 2)
- [x] Implement `noviceAI.ts` service
- [x] Integrate AI turn trigger in `useChessGame.ts`
- [x] Refine `undoMove` to handle AI move rollback (double undo)
- [x] **Unified Undo**: Implement single-button context-aware undo (2 plies vs AI, 1 ply vs PvP)
- [x] Add AI toggle in HUD
- [x] Verify stability during style/graphics toggles

## Phase 6: UI/UX Polish & Teaching Features

- [x] Create game controls (New Game, Undo, Reset)
- [x] Add status display (turn indicator, check warnings)
- [x] Implement move history panel
- [x] Add sound effects (Minecraft-themed)
- [ ] Create main menu and settings screen
- [ ] **Teaching Enhancement**: Top 3 moves with annotated rationale
  - [ ] Design move annotation system
  - [ ] Integrate with AI evaluation
  - [ ] Add strategic explanations (pattern-based)
  - [ ] Create hint toggle UI
- [ ] **Famous Games Database**: Load and replay instructive games
  - [ ] Add 5-10 famous games (Opera, Evergreen, Game of Century)
  - [ ] Create game browser/selector UI
  - [ ] Implement move-by-move playback with annotations

## Phase 7: Responsive Design & Mobile

- [ ] Test layout on desktop (1920x1080, 1366x768)
- [ ] Test on tablet (iPad, Surface)
- [ ] Test on mobile (iPhone, Android)
- [ ] Implement touch controls for mobile
- [ ] Optimize 3D rendering performance

## Phase 8: Testing & Documentation

- [ ] Write unit tests for game logic
- [ ] Test all chess rules edge cases
- [ ] Create README.md with setup instructions
- [ ] Document code architecture for learning
- [ ] Record walkthrough video for your son

## Phase 9: Final Polish & Migration

- [x] **Migration**: Prepare project for export to permanent folder
- [ ] Add loading screen with Minecraft theme
- [ ] Implement smooth transitions between states
- [ ] Add keyboard shortcuts (arrow keys, undo)
- [ ] Optimize bundle size and load times
- [ ] Final cross-browser testing
