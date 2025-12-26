# MVP Feature Implementation Plan

## Features to Implement
1. Condition Tracker
2. Character Sheet Panel
3. Fog of War

---

## Phase 1: Condition Tracker ✅ COMPLETE

### 1.1 Data Layer
- [x] Add condition types to `src/types/index.ts` (already exists, verify)
- [x] Add `conditions` field to `SessionCombatant` in `src/lib/firebase.ts`
- [x] Create `updateCombatantConditions` function in firebase.ts
- [x] Add condition action to `SessionContext.tsx`

### 1.2 UI Components
- [x] Create `src/components/combat/ConditionBadge.tsx` - displays condition icon
- [x] Create `src/components/combat/ConditionPicker.tsx` - modal to add/remove conditions
- [x] Add condition badges to combatant cards in `src/app/play/page.tsx`

### 1.3 Styling
- [x] Create `ConditionBadge.module.css` with icons/colors per condition
- [x] Add condition picker modal styles

### 1.4 Testing
- [x] Navigate to /play, create session
- [x] Add monster via bestiary
- [x] Add condition to combatant
- [ ] Verify condition persists across page refresh
- [ ] Verify other players see the condition (requires 2nd browser)

---

## Phase 2: Character Sheet Panel ✅ COMPLETE

### 2.1 Component Structure
- [x] Create `src/components/character/CharacterSheetPanel.tsx` - slide-out panel
- [x] Create `src/components/character/CharacterSheetPanel.module.css`

### 2.2 Panel Features
- [x] Display basic info (name, race, class, level)
- [x] Show ability scores with modifiers
- [x] Show HP bar (current/max)
- [x] Show AC, speed, initiative
- [x] Show proficiencies and skills
- [x] Show spell slots (if caster)

### 2.3 Integration
- [x] Add "View Sheet" button to game view in `src/app/play/page.tsx`
- [x] Pass `myCharacter` state to panel
- [x] Add toggle state for panel visibility

### 2.4 Testing
- [ ] Join session with a character selected
- [ ] Open character sheet panel
- [ ] Verify all stats display correctly
- [ ] Test on different screen sizes

---

## Phase 3: Fog of War ✅ COMPLETE

### 3.1 Data Layer
- [x] Add `MapState` interface to types (grid, revealed cells)
- [x] Add `map` field to `GameSession` in firebase.ts
- [x] Create `updateMapState` function in firebase.ts
- [x] Add map actions to `SessionContext.tsx`

### 3.2 Map Component
- [x] Create `src/components/map/BattleMap.tsx` - main map canvas
- [x] Create `src/components/map/BattleMap.module.css`
- [x] Implement grid rendering (canvas or CSS grid)
- [x] Add fog overlay (hidden cells are black/semi-transparent)

### 3.3 DM Controls
- [x] Create `src/components/map/MapControls.tsx`
- [x] Add reveal/hide tools (brush sizes 1x1, 2x2, 3x3)
- [x] Add "Reveal All" / "Hide All" buttons
- [x] Add grid size controls

### 3.4 Player View
- [x] Show only revealed cells to non-DM players
- [x] Sync fog state via Firebase in real-time

### 3.5 Testing
- [ ] DM creates session with map
- [ ] DM reveals portions of map
- [ ] Player joins and sees only revealed areas
- [ ] Verify real-time sync when DM changes fog

---

## Implementation Order

1. **Condition Tracker** (simplest, builds on existing combat)
2. **Character Sheet Panel** (medium, mostly UI)
3. **Fog of War** (complex, new subsystem)

---

## Notes
- Use Chrome DevTools MCP for testing UI changes
- Use Context7 for React/Firebase documentation
- Use sub-agents for isolated implementation tasks
- Commit after each phase completion
