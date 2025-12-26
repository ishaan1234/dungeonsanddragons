# Character Sheet Management - Play Online Enhancement Plan

## Overview
Enhance the play online section with comprehensive character sheet management, enabling players to view, edit, and manage their characters during live sessions with real-time synchronization.

---

## Phase 1: Enhanced Character Sheet Panel (Edit Mode)

### Current State
- CharacterSheetPanel exists but is **read-only**
- Shows basic stats, abilities, skills, spell slots
- No way to modify character during play

### 1.1 Editable Character Sheet Component
- [ ] Create `src/components/character/EditableCharacterSheet.tsx`
- [ ] Add edit mode toggle (view/edit switch)
- [ ] Implement inline editing for all fields:
  - HP adjustment (damage/heal buttons with number input)
  - Temporary HP management
  - Spell slot usage tracking (clickable pips)
  - Condition toggles
  - Equipment equipped/unequipped toggles
  - Currency adjustments
  - Notes field editing

### 1.2 HP Management Widget
- [ ] Create `src/components/character/HPManager.tsx`
- [ ] Quick damage/heal buttons (+1, +5, +10, custom)
- [ ] Temporary HP input with visual distinction
- [ ] HP history log (recent changes)
- [ ] Max HP override for level-ups or effects

### 1.3 Spell Slot Tracker
- [ ] Create `src/components/character/SpellSlotTracker.tsx`
- [ ] Visual slot pips (filled/empty circles) for levels 1-9
- [ ] Click to expend/restore slots
- [ ] Warlock pact slot separate tracking
- [ ] Short/long rest slot recovery buttons

### 1.4 Styling
- [ ] Create `EditableCharacterSheet.module.css`
- [ ] Responsive design (modal on mobile, sidebar on desktop)
- [ ] Dark mode support
- [ ] Visual feedback for unsaved changes

---

## Phase 2: Quick Action Toolbar

### 2.1 Combat Quick Actions Panel
- [ ] Create `src/components/play/QuickActionsBar.tsx`
- [ ] Persistent toolbar in play view with:
  - Mini HP bar with +/- buttons
  - Current AC display
  - Active conditions badges (clickable to remove)
  - Spell slot summary (e.g., "3/4 L1 | 2/2 L2")
  - Death saves tracker (3 success/fail boxes)

### 2.2 Floating Action Button (Mobile)
- [ ] Create `src/components/play/CharacterFAB.tsx`
- [ ] Expandable FAB with quick actions
- [ ] Roll initiative, take damage, cast spell shortcuts
- [ ] Swipe gestures for common actions

### 2.3 Integration
- [ ] Add QuickActionsBar to play page game view
- [ ] Position below/beside chat panel
- [ ] Collapsible for more screen space
- [ ] Sync state with full character sheet

---

## Phase 3: Character-Combat Synchronization

### 3.1 Data Sync Layer
- [ ] Update `SessionCombatant` type to link to Character ID
- [ ] Create `syncCharacterToCombat()` function
- [ ] Auto-sync these fields bidirectionally:
  - HP (currentHitPoints ↔ combatant.hp)
  - AC (armorClass ↔ combatant.ac)
  - Conditions (conditions ↔ combatant.conditions)
  - Initiative (initiative modifier for rolls)

### 3.2 Combat Integration
- [ ] When character takes damage in combat tracker → update character HP
- [ ] When character HP changes in sheet → update combatant
- [ ] Death saves sync between character and combat
- [ ] Concentration tracking for spellcasters

### 3.3 Firebase Real-time Sync
- [ ] Add `characterState` field to session player data
- [ ] Sync character modifications to Firebase
- [ ] Other players see updated stats in real-time
- [ ] DM can view all character states

---

## Phase 4: Inventory & Equipment Management

### 4.1 Inventory Panel
- [ ] Create `src/components/character/InventoryPanel.tsx`
- [ ] Sortable/filterable item list
- [ ] Item categories (weapons, armor, consumables, misc)
- [ ] Weight tracking with encumbrance indicator
- [ ] Quick-use buttons for consumables (potions, scrolls)

### 4.2 Equipment Slots
- [ ] Visual equipment slots (head, armor, hands, etc.)
- [ ] Drag-and-drop equipping
- [ ] Attunement tracking (max 3 items)
- [ ] Equipment effects on stats (AC bonus, etc.)

### 4.3 Item Management
- [ ] Add item modal (name, description, quantity, weight)
- [ ] Edit/delete existing items
- [ ] Item templates from D&D SRD data
- [ ] Currency conversion helpers (GP to SP, etc.)

### 4.4 Loot Distribution (Multiplayer)
- [ ] DM can add items to shared loot pool
- [ ] Players can claim items from pool
- [ ] Split currency evenly option
- [ ] Trade items between characters

---

## Phase 5: DM Character Management Tools

### 5.1 Party Overview Dashboard
- [ ] Create `src/components/dm/PartyOverview.tsx`
- [ ] Grid/list view of all player characters
- [ ] At-a-glance stats (HP bars, AC, conditions)
- [ ] Click to expand full character sheet
- [ ] Passive perception/investigation display

### 5.2 DM Character Controls
- [ ] DM can edit any player character (with toggle)
- [ ] Apply damage/healing to multiple characters
- [ ] Add conditions to entire party
- [ ] Give items/gold to characters
- [ ] Secret notes visible only to DM

### 5.3 NPC/Monster Quick Stats
- [ ] Create `src/components/dm/QuickStatBlock.tsx`
- [ ] Simplified stat block for NPCs
- [ ] Quick HP tracking
- [ ] Ability check shortcuts
- [ ] Reusable NPC templates

---

## Phase 6: Character Progression & Leveling

### 6.1 Level Up Flow
- [ ] Create `src/components/character/LevelUpWizard.tsx`
- [ ] Step-by-step level up process:
  1. HP increase (roll or average)
  2. New features/abilities from class
  3. Ability score improvement (at appropriate levels)
  4. New spells (for casters)
  5. Proficiency bonus update

### 6.2 Experience Tracking
- [ ] XP display in character sheet
- [ ] XP-to-next-level progress bar
- [ ] DM can award XP to party
- [ ] Milestone leveling option (no XP tracking)

### 6.3 Multiclassing Support
- [ ] Add secondary class option
- [ ] Track levels per class
- [ ] Combined spell slot calculation
- [ ] Feature stacking from multiple classes

---

## Phase 7: Session Character State

### 7.1 Session Snapshots
- [ ] Save character state at session start
- [ ] Track all changes during session
- [ ] Session changelog (what changed)
- [ ] Option to revert to session start state

### 7.2 Post-Session Review
- [ ] Summary of HP lost/regained
- [ ] Spell slots used
- [ ] Items gained/lost
- [ ] XP earned
- [ ] Option to apply or discard changes

### 7.3 Long/Short Rest Integration
- [ ] Short rest button (recover some resources)
- [ ] Long rest button (full recovery)
- [ ] Hit dice tracking and spending
- [ ] Class-specific rest features (Warlock slots, etc.)

---

## Phase 8: Import/Export & Sharing

### 8.1 Character Export
- [ ] Export to JSON file
- [ ] Generate shareable character code
- [ ] PDF character sheet generation (optional)
- [ ] D&D Beyond format compatibility

### 8.2 Character Import
- [ ] Import from JSON file
- [ ] Paste character code to import
- [ ] Import from D&D Beyond (if API available)
- [ ] Validate imported data

### 8.3 Character Templates
- [ ] Save character as template
- [ ] Pre-built templates (Fighter L1, Wizard L5, etc.)
- [ ] Quick NPC generation from templates

---

## Suggested Implementation Order

| Priority | Phase | Effort | Impact |
|----------|-------|--------|--------|
| 1 | Phase 1 - Edit Mode | Medium | High |
| 2 | Phase 2 - Quick Actions | Medium | High |
| 3 | Phase 3 - Combat Sync | Medium | High |
| 4 | Phase 4 - Inventory | High | Medium |
| 5 | Phase 5 - DM Tools | Medium | Medium |
| 6 | Phase 7 - Session State | Low | Medium |
| 7 | Phase 6 - Leveling | High | Medium |
| 8 | Phase 8 - Import/Export | Low | Low |

---

## Technical Considerations

### State Management
- Character edits update Zustand store (persists to localStorage)
- Session-specific state syncs via Firebase
- Debounce frequent updates (HP changes) to reduce Firebase writes

### Performance
- Lazy load inventory for characters with many items
- Virtualize long skill/spell lists
- Optimistic UI updates with rollback on sync failure

### Mobile Responsiveness
- Touch-friendly controls (larger tap targets)
- Swipe gestures for common actions
- Bottom sheet modals instead of side panels on mobile

---

## Files to Create/Modify

### New Components
```
src/components/character/
├── EditableCharacterSheet.tsx
├── EditableCharacterSheet.module.css
├── HPManager.tsx
├── SpellSlotTracker.tsx
├── InventoryPanel.tsx
├── InventoryPanel.module.css
├── LevelUpWizard.tsx
└── LevelUpWizard.module.css

src/components/play/
├── QuickActionsBar.tsx
├── QuickActionsBar.module.css
└── CharacterFAB.tsx

src/components/dm/
├── PartyOverview.tsx
├── PartyOverview.module.css
└── QuickStatBlock.tsx
```

### Modifications
```
src/app/play/page.tsx - Add quick actions, enhanced sheet integration
src/stores/appStore.ts - Add session character state actions
src/contexts/SessionContext.tsx - Add character sync functions
src/lib/firebase.ts - Add character state sync to sessions
src/types/index.ts - Extend types for session character state
```

---

## Notes
- Use Chrome DevTools MCP for testing UI changes
- Use Context7 for React/Firebase documentation
- Commit after each phase completion
- Test multiplayer sync with multiple browser windows
