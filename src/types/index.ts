// D&D 5e Core Types

export type AbilityScore = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

export type Skill =
  | 'acrobatics' | 'animalHandling' | 'arcana' | 'athletics' | 'deception'
  | 'history' | 'insight' | 'intimidation' | 'investigation' | 'medicine'
  | 'nature' | 'perception' | 'performance' | 'persuasion' | 'religion'
  | 'sleightOfHand' | 'stealth' | 'survival';

export type DamageType =
  | 'acid' | 'bludgeoning' | 'cold' | 'fire' | 'force' | 'lightning'
  | 'necrotic' | 'piercing' | 'poison' | 'psychic' | 'radiant' | 'slashing' | 'thunder';

export type Condition =
  | 'blinded' | 'charmed' | 'deafened' | 'frightened' | 'grappled'
  | 'incapacitated' | 'invisible' | 'paralyzed' | 'petrified' | 'poisoned'
  | 'prone' | 'restrained' | 'stunned' | 'unconscious' | 'exhaustion';

export type Size = 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan';

export type Alignment =
  | 'lawful good' | 'neutral good' | 'chaotic good'
  | 'lawful neutral' | 'true neutral' | 'chaotic neutral'
  | 'lawful evil' | 'neutral evil' | 'chaotic evil';

export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Race {
  id: string;
  name: string;
  description: string;
  abilityScoreIncreases: Partial<AbilityScores>;
  size: Size;
  speed: number;
  traits: RacialTrait[];
  languages: string[];
  subraces?: Subrace[];
  darkvision?: number;
}

export interface Subrace {
  id: string;
  name: string;
  description: string;
  abilityScoreIncreases: Partial<AbilityScores>;
  traits: RacialTrait[];
}

export interface RacialTrait {
  name: string;
  description: string;
}

export interface Class {
  id: string;
  name: string;
  description: string;
  hitDie: DiceType;
  primaryAbility: AbilityScore[];
  savingThrowProficiencies: AbilityScore[];
  armorProficiencies: string[];
  weaponProficiencies: string[];
  skillChoices: Skill[];
  numSkillChoices: number;
  features: ClassFeature[];
  spellcasting?: SpellcastingInfo;
  subclasses: Subclass[];
  equipment: EquipmentChoice[];
}

export interface ClassFeature {
  name: string;
  level: number;
  description: string;
}

export interface Subclass {
  id: string;
  name: string;
  description: string;
  features: ClassFeature[];
}

export interface SpellcastingInfo {
  ability: AbilityScore;
  spellList: string;
  cantripsKnown: number[];
  spellsKnown?: number[];
  spellSlots: number[][];
}

export interface EquipmentChoice {
  options: string[][];
}

export interface Background {
  id: string;
  name: string;
  description: string;
  skillProficiencies: Skill[];
  toolProficiencies?: string[];
  languages?: number;
  equipment: string[];
  feature: BackgroundFeature;
  personalityTraits: string[];
  ideals: string[];
  bonds: string[];
  flaws: string[];
}

export interface BackgroundFeature {
  name: string;
  description: string;
}

export interface Character {
  id: string;
  name: string;
  playerName: string;
  race: string;
  subrace?: string;
  class: string;
  subclass?: string;
  level: number;
  experiencePoints: number;
  background: string;
  alignment: Alignment;
  abilityScores: AbilityScores;
  maxHitPoints: number;
  currentHitPoints: number;
  temporaryHitPoints: number;
  armorClass: number;
  initiative: number;
  speed: number;
  proficiencyBonus: number;
  skillProficiencies: Skill[];
  savingThrowProficiencies: AbilityScore[];
  languages: string[];
  features: CharacterFeature[];
  equipment: CharacterEquipment[];
  inventory: InventoryItem[];
  currency: Currency;
  spellSlots?: SpellSlots;
  spellsKnown?: string[];
  preparedSpells?: string[];
  spellcastingAbility?: AbilityScore;
  conditions: Condition[];
  deathSaves: DeathSaves;
  portrait?: string;
  backstory?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CharacterFeature {
  name: string;
  description: string;
  source?: string;
}

export interface CharacterEquipment {
  name: string;
  quantity: number;
  equipped?: boolean;
}

export interface Currency {
  copper: number;
  silver: number;
  electrum: number;
  gold: number;
  platinum: number;
}

export interface SpellSlots {
  1: { max: number; used: number };
  2: { max: number; used: number };
  3: { max: number; used: number };
  4: { max: number; used: number };
  5: { max: number; used: number };
  6: { max: number; used: number };
  7: { max: number; used: number };
  8: { max: number; used: number };
  9: { max: number; used: number };
}

export interface DeathSaves {
  successes: number;
  failures: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  weight: number;
  description: string;
  type: ItemType;
  equipped: boolean;
  attuned?: boolean;
  rarity?: ItemRarity;
}

export type ItemType = 'weapon' | 'armor' | 'potion' | 'scroll' | 'wondrous' | 'tool' | 'adventuring' | 'other';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'very rare' | 'legendary' | 'artifact';

export interface Spell {
  id: string;
  name: string;
  level: number;
  school: SpellSchool;
  castingTime: string;
  range: string;
  components: SpellComponents;
  duration: string;
  concentration?: boolean;
  ritual?: boolean;
  description: string;
  higherLevels?: string;
  classes: string[];
  damage?: SpellDamage;
  healing?: string;
  savingThrow?: AbilityScore;
}

export type SpellSchool =
  | 'abjuration' | 'conjuration' | 'divination' | 'enchantment'
  | 'evocation' | 'illusion' | 'necromancy' | 'transmutation';

export interface SpellComponents {
  verbal?: boolean;
  somatic?: boolean;
  material?: boolean;
  materialDescription?: string;
}

export interface SpellDamage {
  type: DamageType;
  dice: string;
}

export interface Monster {
  id: string;
  name: string;
  size: Size;
  type: CreatureType;
  alignment: Alignment | 'unaligned';
  armorClass: number;
  armorType?: string;
  hitPoints: number;
  hitDice: string;
  speed: MonsterSpeed;
  abilityScores: AbilityScores;
  savingThrows?: Partial<AbilityScores>;
  skills?: Partial<Record<Skill, number>> | Record<string, number>;
  damageVulnerabilities?: DamageType[];
  damageResistances?: DamageType[];
  damageImmunities?: DamageType[];
  conditionImmunities?: Condition[] | string[];
  senses?: MonsterSenses;
  languages?: string[];
  challengeRating: number;
  experiencePoints: number;
  traits?: MonsterTrait[];
  actions: MonsterAction[];
  legendaryActions?: MonsterAction[];
  reactions?: MonsterAction[];
}

export interface MonsterSenses {
  darkvision?: number;
  blindsight?: number;
  tremorsense?: number;
  truesight?: number;
  passivePerception: number;
}

export type CreatureType =
  | 'aberration' | 'beast' | 'celestial' | 'construct' | 'dragon'
  | 'elemental' | 'fey' | 'fiend' | 'giant' | 'humanoid'
  | 'monstrosity' | 'ooze' | 'plant' | 'undead';

export interface MonsterSpeed {
  walk?: number;
  fly?: number;
  swim?: number;
  burrow?: number;
  climb?: number;
}

export interface MonsterTrait {
  name: string;
  description: string;
}

export interface MonsterAction {
  name: string;
  description: string;
  attackBonus?: number;
  damage?: string;
  damageType?: DamageType;
}

// Combat Types
export interface Combatant {
  id: string;
  name: string;
  type: 'player' | 'npc' | 'monster';
  playerId?: string;
  initiative: number;
  initiativeModifier?: number;
  currentHitPoints: number;
  maxHitPoints: number;
  temporaryHitPoints?: number;
  armorClass: number;
  conditions: Condition[] | string[];
  isCurrentTurn?: boolean;
  isConcentrating?: boolean;
  deathSaves?: DeathSaves;
  characterId?: string;
  monsterId?: string;
  color?: string;
}

export interface Combat {
  id: string;
  name: string;
  round: number;
  currentTurnIndex: number;
  combatants: Combatant[];
  isActive: boolean;
  log: CombatLogEntry[];
}

export interface CombatLogEntry {
  id: string;
  timestamp: number;
  type: 'roll' | 'damage' | 'heal' | 'condition' | 'turn' | 'system';
  message: string;
  actor?: string;
  target?: string;
  value?: number;
}

// Dice Types
export interface DiceRoll {
  id: string;
  formula: string;
  dice: SingleDieRoll[];
  modifier: number;
  total: number;
  type?: 'normal' | 'advantage' | 'disadvantage';
  timestamp: number;
  rolledBy: string;
  reason?: string;
}

export interface SingleDieRoll {
  type: DiceType;
  result: number;
  max: number;
  isCritical?: boolean;
  isFumble?: boolean;
}

// Campaign Types
export interface Campaign {
  id: string;
  name: string;
  description: string;
  dungeonMasterId: string;
  players: string[];
  characters: string[];
  sessions: Session[];
  createdAt: number;
  updatedAt: number;
}

export interface Session {
  id: string;
  campaignId: string;
  name: string;
  date: number;
  notes: string;
  isActive: boolean;
}

// Multiplayer Types
export interface GameSession {
  id: string;
  code: string;
  campaignId: string;
  hostId: string;
  players: PlayerConnection[];
  state: GameState;
  chat: ChatMessage[];
  createdAt: number;
}

export interface PlayerConnection {
  id: string;
  name: string;
  isHost: boolean;
  isDM: boolean;
  characterId?: string;
  isOnline: boolean;
  lastSeen: number;
}

export interface GameState {
  currentView: 'tabletop' | 'combat' | 'exploration';
  combat?: Combat;
  map?: MapState;
  sharedRolls: DiceRoll[];
}

export interface MapState {
  id: string;
  imageUrl?: string;
  gridSize: number;
  tokens: MapToken[];
  fogOfWar: boolean[][];
  drawings: MapDrawing[];
}

export interface MapToken {
  id: string;
  name: string;
  x: number;
  y: number;
  size: number;
  color: string;
  imageUrl?: string;
  characterId?: string;
  monsterId?: string;
  isVisible: boolean;
  currentHp?: number;
  maxHp?: number;
}

export interface MapDrawing {
  id: string;
  type: 'line' | 'circle' | 'rectangle' | 'freehand';
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  type: 'message' | 'roll' | 'emote' | 'whisper' | 'system';
  content: string;
  timestamp: number;
  recipientId?: string;
  rollData?: DiceRoll;
}
