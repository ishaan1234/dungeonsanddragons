# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
pnpm dev      # Start development server (kills port 3000 first, then runs Next.js with Turbopack)
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

**Important**: Always use `pnpm` instead of npm.

## AI Assistant Instructions

- Always use **Context7 MCP** tools when generating code, implementing setup/configuration, or referencing library/API documentation. Automatically resolve library IDs and fetch docs without explicit user request.
- Use **Chrome DevTools MCP** to test features in the browser, inspect elements, debug JavaScript, and verify UI changes.
- After completing changes and receiving user approval, push commits to GitHub.

## Architecture Overview

This is a D&D 5e campaign manager built with Next.js 16 (App Router), React 18, TypeScript, and Firebase. It supports real-time multiplayer sessions.

### Key Directories

- `src/types/index.ts` - All D&D 5e type definitions (Character, Spell, Monster, Combat, etc.)
- `src/stores/appStore.ts` - Zustand store with persist middleware for global state
- `src/contexts/SessionContext.tsx` - React context for real-time multiplayer session management
- `src/lib/firebase.ts` - Firebase Firestore integration for multiplayer sync
- `src/lib/dice.ts` - Dice rolling engine with D&D notation parsing (e.g., "2d6+4", "4d6k3")
- `src/data/` - Static D&D data (races, classes, spells, monsters)

### State Management

Two-layer state approach:
1. **Zustand store** (`useAppStore`) - Local persistent state: characters, campaigns, settings, roll history
2. **Session context** (`useSession`) - Real-time multiplayer state synced via Firebase: combat, chat, player connections

### Multiplayer Session Flow

1. DM creates session via `createSession()` → generates 6-char code
2. Players join via `joinSession()` with session code
3. `subscribeToSession()` provides real-time Firestore updates
4. Combat state and chat messages sync across all connected clients

### Component Patterns

- Page components in `src/app/*/page.tsx` with co-located CSS modules
- Feature components in `src/components/[feature]/`
- All components use client-side rendering (`'use client'`)
- Three.js/React Three Fiber used for 3D dice animations (`Dice3D.tsx`)

### Firebase Configuration

Requires environment variables (NEXT_PUBLIC_FIREBASE_*). Falls back to demo values for local development without Firebase.

### Path Aliases

Use `@/` prefix for imports (maps to `./src/*`)
