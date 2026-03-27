# Changelog

## [1.1.0] - 2026-03-26

### Features
- **Engine**: Replaced streak-based progression with a cumulative score system.
- **Engine**: Implemented quadratic scoring curve (`(L-1)² × 50 + (L-1) × 100`) for progressively challenging level-ups.
- **Engine**: Mixed-level problem generation (40% current level, 60% weighted lower levels) ensuring constant review of past material.
- **Logic**: Proportional points awarding based on problem level (`Level × 10`).
- **Logic**: Soft penalty on incorrect answers (-25% points) to maintain stakes without excessive frustration.
- **Logic**: Automatic backward-compatible score migration for existing persistent saves.

### Styling & UI
- **Components**: New `LevelProgressBar` with dynamic CSS gradients representing level-to-level transitions.
- **Animations**: `framer-motion` powered progress fill and glow-pulse tip for immediate visual feedback.
- **UI**: Redesigned Play top-bar to integrate the progress system and seeds status into a single cohesive unit.
- **Theme**: Curated 15-level palette ensuring unique visual identity for each progression milestone.

### [1.0.0] - 2026-03-25

### Features
- **Engine**: Dynamic problem generation scaling correctly into 5 progression bounds.
- **Game Loop**: Persistent timer-based game logic matching attempts natively via React hooks.
- **Storage**: Offline-first progress bridging via localized persistence.
- **Gamification**: Interactive, physics-based `GardenView` granting rewards procedurally via `framer-motion`.
- **Dashboard**: Panel detailing parent metrics (total counts, precision accuracy %).
- **Logic**: Intelligent Retry mechanism and contextual "Saltar" skip bounds minimizing friction sequentially.
- **Overrides**: Forced difficulty lock bounds isolating children within targeted ranges manually over `mathEngine`.

### Styling & UI
- **Design System**: Global CSS tokens rendering modern glassmorphism elements securely without 3rd party bloat.
- **Aesthetics**: Native colors conveying peace/flow avoiding red "wrong" aggressive feedbacks entirely.
- **Animations**: Fluid component mounting/unmounting preventing UI blockages.
