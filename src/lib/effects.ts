// Active Effects System for D&D 5e
// Handles buffs, debuffs, conditions, and ongoing effects

import { AbilityScore, Condition, DamageType } from '@/types';

export type EffectType =
    | 'buff'
    | 'debuff'
    | 'healing'
    | 'damage'
    | 'condition'
    | 'resistance'
    | 'immunity';

export interface ActiveEffect {
    id: string;
    name: string;
    type: EffectType;
    source: string; // Who/what caused this effect
    sourceId?: string; // Character/spell ID
    targetId: string; // Who has this effect

    // Duration
    durationRounds?: number; // Combat rounds remaining
    durationMinutes?: number; // Real-time or exploration
    isPermanent?: boolean;
    concentration?: boolean; // Ends if caster loses concentration
    concentratorId?: string; // Who is concentrating

    // Stat Modifications
    statModifiers?: StatModifier[];

    // Healing/Damage over time
    healingPerRound?: string; // e.g., "1d6" 
    damagePerRound?: { dice: string; type: DamageType };

    // Conditions applied
    conditionsApplied?: Condition[];

    // Resistances/Immunities granted
    resistances?: DamageType[];
    immunities?: DamageType[];

    // Extra dice to rolls
    bonusDice?: {
        attacks?: string; // e.g., "1d4" for Bless
        savingThrows?: string;
        damage?: string;
        healing?: string;
    };

    // Display
    description: string;
    iconEmoji?: string;
    color?: string;

    appliedAt: number; // Timestamp
}

export interface StatModifier {
    stat: 'ac' | 'speed' | 'attackBonus' | 'saveDC' | AbilityScore | 'maxHP' | 'tempHP';
    value: number;
    type: 'bonus' | 'penalty' | 'set'; // +X, -X, or set to exactly X
}

// Common D&D buffs/effects as templates
export const EFFECT_TEMPLATES: Record<string, Partial<ActiveEffect>> = {
    // === HEALING SPELLS ===
    'cure-wounds': {
        name: 'Cure Wounds',
        type: 'healing',
        description: 'Magical healing energy restores hit points.',
        iconEmoji: '💚',
        color: '#22c55e',
    },

    'healing-word': {
        name: 'Healing Word',
        type: 'healing',
        description: 'A word of power heals a creature.',
        iconEmoji: '🗣️',
        color: '#22c55e',
    },

    // === BUFF SPELLS ===
    'bless': {
        name: 'Bless',
        type: 'buff',
        durationRounds: 10, // 1 minute
        concentration: true,
        description: 'Divine favor grants +1d4 to attack rolls and saving throws.',
        iconEmoji: '✨',
        color: '#fbbf24',
        bonusDice: {
            attacks: '1d4',
            savingThrows: '1d4',
        },
    },

    'shield-of-faith': {
        name: 'Shield of Faith',
        type: 'buff',
        durationRounds: 100, // 10 minutes
        concentration: true,
        description: 'A shimmering field grants +2 AC.',
        iconEmoji: '🛡️',
        color: '#3b82f6',
        statModifiers: [{ stat: 'ac', value: 2, type: 'bonus' }],
    },

    'haste': {
        name: 'Haste',
        type: 'buff',
        durationRounds: 10, // 1 minute
        concentration: true,
        description: 'Incredible speed grants +2 AC, doubled speed, and an extra action.',
        iconEmoji: '⚡',
        color: '#f59e0b',
        statModifiers: [
            { stat: 'ac', value: 2, type: 'bonus' },
            { stat: 'speed', value: 2, type: 'bonus' }, // Doubled
        ],
    },

    'barkskin': {
        name: 'Barkskin',
        type: 'buff',
        durationRounds: 10,
        concentration: true,
        description: 'Skin becomes bark-like, AC cannot be less than 16.',
        iconEmoji: '🌳',
        color: '#84cc16',
        statModifiers: [{ stat: 'ac', value: 16, type: 'set' }],
    },

    'heroism': {
        name: 'Heroism',
        type: 'buff',
        durationRounds: 10,
        concentration: true,
        description: 'Immune to frightened, gain temp HP equal to caster\'s spellcasting modifier each turn.',
        iconEmoji: '🦸',
        color: '#f97316',
        conditionsApplied: [], // Removes frightened
        immunities: [],
    },

    'guidance': {
        name: 'Guidance',
        type: 'buff',
        durationRounds: 1, // Until used
        concentration: true,
        description: 'Add 1d4 to one ability check.',
        iconEmoji: '🙏',
        color: '#8b5cf6',
    },

    // === DEBUFF SPELLS ===
    'bane': {
        name: 'Bane',
        type: 'debuff',
        durationRounds: 10,
        concentration: true,
        description: 'Enemies subtract 1d4 from attack rolls and saving throws.',
        iconEmoji: '💀',
        color: '#7c3aed',
        bonusDice: {
            attacks: '-1d4',
            savingThrows: '-1d4',
        },
    },

    'hex': {
        name: 'Hex',
        type: 'debuff',
        durationRounds: 10,
        concentration: true,
        description: 'Extra 1d6 necrotic damage on hits, disadvantage on one ability check.',
        iconEmoji: '🔮',
        color: '#6b21a8',
        bonusDice: {
            damage: '1d6',
        },
    },

    'hunters-mark': {
        name: "Hunter's Mark",
        type: 'debuff',
        durationRounds: 10,
        concentration: true,
        description: 'Extra 1d6 damage against marked target.',
        iconEmoji: '🎯',
        color: '#16a34a',
        bonusDice: {
            damage: '1d6',
        },
    },

    // === CONDITIONS ===
    'frightened': {
        name: 'Frightened',
        type: 'condition',
        description: 'Disadvantage on ability checks and attack rolls while source is in sight.',
        iconEmoji: '😨',
        color: '#7c3aed',
        conditionsApplied: ['frightened'],
    },

    'poisoned': {
        name: 'Poisoned',
        type: 'condition',
        description: 'Disadvantage on attack rolls and ability checks.',
        iconEmoji: '🤢',
        color: '#22c55e',
        conditionsApplied: ['poisoned'],
    },

    'paralyzed': {
        name: 'Paralyzed',
        type: 'condition',
        description: 'Cannot move or speak, auto-fail STR/DEX saves, attacks have advantage.',
        iconEmoji: '🧊',
        color: '#06b6d4',
        conditionsApplied: ['paralyzed'],
    },

    // === RESISTANCE EFFECTS ===
    'protection-from-energy': {
        name: 'Protection from Energy',
        type: 'resistance',
        durationRounds: 10,
        concentration: true,
        description: 'Resistance to one damage type (acid, cold, fire, lightning, or thunder).',
        iconEmoji: '🔰',
        color: '#0ea5e9',
    },

    'rage': {
        name: 'Rage (Barbarian)',
        type: 'buff',
        durationRounds: 10,
        description: 'Advantage on STR checks, bonus melee damage, resistance to physical damage.',
        iconEmoji: '😤',
        color: '#dc2626',
        resistances: ['bludgeoning', 'piercing', 'slashing'],
        statModifiers: [
            { stat: 'attackBonus', value: 2, type: 'bonus' }, // Rage damage at level 1-8
        ],
    },
};

// Calculate healing amount based on spell and caster
export function calculateHealing(
    spellName: string,
    spellLevel: number,
    spellcastingModifier: number
): { dice: string; modifier: number; formula: string } {
    // Common healing spells
    const healingFormulas: Record<string, (level: number) => string> = {
        'cure-wounds': (lvl) => `${lvl}d8`,
        'healing-word': (lvl) => `${lvl}d4`,
        'mass-cure-wounds': (lvl) => `${lvl}d8`,
        'heal': () => '70', // Fixed amount at base
        'prayer-of-healing': (lvl) => `${lvl}d8`,
    };

    const formulaFn = healingFormulas[spellName];
    const dice = formulaFn ? formulaFn(spellLevel) : `${spellLevel}d8`;

    return {
        dice,
        modifier: spellcastingModifier,
        formula: `${dice}+${spellcastingModifier}`,
    };
}

// Generate unique effect ID
export function generateEffectId(): string {
    return `effect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Create an active effect from a template
export function createEffect(
    templateId: string,
    sourceId: string,
    sourceName: string,
    targetId: string,
    overrides?: Partial<ActiveEffect>
): ActiveEffect {
    const template = EFFECT_TEMPLATES[templateId] || {};

    return {
        id: generateEffectId(),
        name: template.name || 'Unknown Effect',
        type: template.type || 'buff',
        source: sourceName,
        sourceId,
        targetId,
        description: template.description || '',
        appliedAt: Date.now(),
        ...template,
        ...overrides,
    };
}

// Check if effect has expired
export function isEffectExpired(effect: ActiveEffect, currentRound: number, startRound: number): boolean {
    if (effect.isPermanent) return false;
    if (effect.durationRounds !== undefined) {
        const roundsElapsed = currentRound - startRound;
        return roundsElapsed >= effect.durationRounds;
    }
    return false;
}

// Calculate total stat modifiers from all effects
export function calculateTotalModifiers(
    effects: ActiveEffect[],
    stat: StatModifier['stat']
): number {
    let total = 0;
    let setTo: number | null = null;

    for (const effect of effects) {
        if (!effect.statModifiers) continue;

        for (const mod of effect.statModifiers) {
            if (mod.stat !== stat) continue;

            if (mod.type === 'set') {
                // "Set" overrides, but take highest if multiple
                if (setTo === null || mod.value > setTo) {
                    setTo = mod.value;
                }
            } else if (mod.type === 'bonus') {
                total += mod.value;
            } else if (mod.type === 'penalty') {
                total -= mod.value;
            }
        }
    }

    // If there's a "set to" value, that becomes the base
    // Bonuses/penalties still apply on top
    return setTo !== null ? setTo + total : total;
}
