import { DiceRoll, DiceType, SingleDieRoll } from '@/types';

// Get maximum value for a die type
export function getDieMax(die: DiceType): number {
    const dieValues: Record<DiceType, number> = {
        d4: 4,
        d6: 6,
        d8: 8,
        d10: 10,
        d12: 12,
        d20: 20,
        d100: 100,
    };
    return dieValues[die];
}

// Roll a single die
export function rollDie(die: DiceType): SingleDieRoll {
    const max = getDieMax(die);
    const result = Math.floor(Math.random() * max) + 1;

    return {
        type: die,
        result,
        max,
        isCritical: die === 'd20' && result === 20,
        isFumble: die === 'd20' && result === 1,
    };
}

// Roll multiple dice of the same type
export function rollDice(die: DiceType, count: number): SingleDieRoll[] {
    return Array.from({ length: count }, () => rollDie(die));
}

// Parse dice notation like "2d6+4", "1d20", "4d6k3" (keep 3 highest)
export interface ParsedDiceFormula {
    count: number;
    die: DiceType;
    modifier: number;
    keep?: number;
    drop?: number;
    keepLowest?: boolean;
}

export function parseDiceNotation(notation: string): ParsedDiceFormula | null {
    // Match patterns like: 2d6, 1d20+5, 4d6k3, 2d10-2, d20
    const regex = /^(\d*)d(\d+)(?:k(\d+))?(?:kl(\d+))?(?:([+-])(\d+))?$/i;
    const match = notation.trim().toLowerCase().match(regex);

    if (!match) return null;

    const count = match[1] ? parseInt(match[1]) : 1;
    const dieSize = parseInt(match[2]);
    const keep = match[3] ? parseInt(match[3]) : undefined;
    const keepLowest = match[4] ? parseInt(match[4]) : undefined;
    const modifierSign = match[5];
    const modifierValue = match[6] ? parseInt(match[6]) : 0;

    // Validate die type
    const validDice = [4, 6, 8, 10, 12, 20, 100];
    if (!validDice.includes(dieSize)) return null;

    const die = `d${dieSize}` as DiceType;
    const modifier = modifierSign === '-' ? -modifierValue : modifierValue;

    return {
        count,
        die,
        modifier,
        keep,
        keepLowest: keepLowest !== undefined,
        drop: keepLowest,
    };
}

// Execute a dice roll from a formula
export function executeRoll(
    formula: string,
    rolledBy: string,
    reason?: string,
    type: 'normal' | 'advantage' | 'disadvantage' = 'normal'
): DiceRoll {
    const parsed = parseDiceNotation(formula);

    if (!parsed) {
        // Return a default d20 roll if parsing fails
        const roll = rollDie('d20');
        return {
            id: generateRollId(),
            formula: 'd20',
            dice: [roll],
            modifier: 0,
            total: roll.result,
            type,
            timestamp: Date.now(),
            rolledBy,
            reason,
        };
    }

    let dice: SingleDieRoll[];

    if (type === 'advantage' && parsed.die === 'd20' && parsed.count === 1) {
        // Roll twice, keep higher
        const roll1 = rollDie('d20');
        const roll2 = rollDie('d20');
        dice = roll1.result >= roll2.result ? [roll1, roll2] : [roll2, roll1];
    } else if (type === 'disadvantage' && parsed.die === 'd20' && parsed.count === 1) {
        // Roll twice, keep lower
        const roll1 = rollDie('d20');
        const roll2 = rollDie('d20');
        dice = roll1.result <= roll2.result ? [roll1, roll2] : [roll2, roll1];
    } else {
        dice = rollDice(parsed.die, parsed.count);
    }

    // Handle keep highest/lowest
    let keptDice = [...dice];
    if (parsed.keep && parsed.keep < dice.length) {
        keptDice.sort((a, b) => b.result - a.result);
        keptDice = keptDice.slice(0, parsed.keep);
    } else if (parsed.drop && parsed.drop < dice.length) {
        keptDice.sort((a, b) => a.result - b.result);
        keptDice = keptDice.slice(0, parsed.drop);
    }

    const diceTotal = keptDice.reduce((sum, d) => sum + d.result, 0);
    const total = diceTotal + parsed.modifier;

    return {
        id: generateRollId(),
        formula,
        dice,
        modifier: parsed.modifier,
        total,
        type,
        timestamp: Date.now(),
        rolledBy,
        reason,
    };
}

// Quick roll a specific die type
export function quickRoll(die: DiceType, modifier: number = 0, rolledBy: string): DiceRoll {
    const roll = rollDie(die);
    return {
        id: generateRollId(),
        formula: modifier !== 0 ? `1${die}${modifier >= 0 ? '+' : ''}${modifier}` : `1${die}`,
        dice: [roll],
        modifier,
        total: roll.result + modifier,
        type: 'normal',
        timestamp: Date.now(),
        rolledBy,
    };
}

// Roll for initiative
export function rollInitiative(dexModifier: number, rolledBy: string): DiceRoll {
    return executeRoll(`1d20+${dexModifier}`, rolledBy, 'Initiative');
}

// Roll for attack
export function rollAttack(
    attackBonus: number,
    rolledBy: string,
    advantage: boolean = false,
    disadvantage: boolean = false
): DiceRoll {
    const type = advantage && !disadvantage ? 'advantage' : disadvantage && !advantage ? 'disadvantage' : 'normal';
    return executeRoll(`1d20+${attackBonus}`, rolledBy, 'Attack Roll', type);
}

// Roll for damage
export function rollDamage(damageFormula: string, rolledBy: string, isCritical: boolean = false): DiceRoll {
    if (isCritical) {
        // Double the dice on critical hit
        const parsed = parseDiceNotation(damageFormula);
        if (parsed) {
            const critFormula = `${parsed.count * 2}${parsed.die}${parsed.modifier >= 0 ? '+' : ''}${parsed.modifier}`;
            return executeRoll(critFormula, rolledBy, 'Critical Damage!');
        }
    }
    return executeRoll(damageFormula, rolledBy, 'Damage');
}

// Roll a saving throw
export function rollSavingThrow(
    modifier: number,
    rolledBy: string,
    advantage: boolean = false,
    disadvantage: boolean = false
): DiceRoll {
    const type = advantage && !disadvantage ? 'advantage' : disadvantage && !advantage ? 'disadvantage' : 'normal';
    return executeRoll(`1d20+${modifier}`, rolledBy, 'Saving Throw', type);
}

// Roll ability check
export function rollAbilityCheck(
    modifier: number,
    skillName: string,
    rolledBy: string,
    advantage: boolean = false,
    disadvantage: boolean = false
): DiceRoll {
    const type = advantage && !disadvantage ? 'advantage' : disadvantage && !advantage ? 'disadvantage' : 'normal';
    return executeRoll(`1d20+${modifier}`, rolledBy, `${skillName} Check`, type);
}

// Generate unique roll ID
function generateRollId(): string {
    return `roll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Format roll result for display
export function formatRollResult(roll: DiceRoll): string {
    const diceResults = roll.dice.map((d) => {
        if (d.isCritical) return `**${d.result}**`;
        if (d.isFumble) return `~~${d.result}~~`;
        return d.result.toString();
    }).join(' + ');

    const modifierStr = roll.modifier !== 0
        ? `${roll.modifier >= 0 ? ' + ' : ' - '}${Math.abs(roll.modifier)}`
        : '';

    return `[${diceResults}]${modifierStr} = **${roll.total}**`;
}

// Check if roll is a natural 20 or natural 1
export function checkNatural(roll: DiceRoll): 'nat20' | 'nat1' | null {
    if (roll.dice.length === 0) return null;
    const firstD20 = roll.dice.find(d => d.type === 'd20');
    if (!firstD20) return null;

    if (firstD20.isCritical) return 'nat20';
    if (firstD20.isFumble) return 'nat1';
    return null;
}

// Roll 4d6 drop lowest for ability score generation
export function rollAbilityScore(): { rolls: number[]; dropped: number; total: number } {
    const dice = rollDice('d6', 4);
    const results = dice.map(d => d.result).sort((a, b) => b - a);
    const dropped = results.pop()!;
    const total = results.reduce((sum, n) => sum + n, 0);

    return { rolls: results, dropped, total };
}

// Generate a full set of ability scores
export function generateAbilityScores(): number[] {
    return Array.from({ length: 6 }, () => rollAbilityScore().total);
}

// Standard array for ability scores
export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

// Point buy costs
export const POINT_BUY_COSTS: Record<number, number> = {
    8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9,
};

export const POINT_BUY_TOTAL = 27;
