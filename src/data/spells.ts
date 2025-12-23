import { Spell, SpellSchool, DiceType } from '@/types';

// D&D 5e SRD Spells Database
export const spells: Spell[] = [
    // Cantrips (Level 0)
    {
        id: 'fire-bolt',
        name: 'Fire Bolt',
        level: 0,
        school: 'evocation',
        castingTime: '1 action',
        range: '120 feet',
        components: { verbal: true, somatic: true },
        duration: 'Instantaneous',
        description: 'You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn\'t being worn or carried.',
        higherLevels: 'This spell\'s damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).',
        classes: ['sorcerer', 'wizard'],
        damage: { dice: '1d10', type: 'fire' },
    },
    {
        id: 'light',
        name: 'Light',
        level: 0,
        school: 'evocation',
        castingTime: '1 action',
        range: 'Touch',
        components: { verbal: true, material: true, materialDescription: 'a firefly or phosphorescent moss' },
        duration: '1 hour',
        description: 'You touch one object that is no larger than 10 feet in any dimension. Until the spell ends, the object sheds bright light in a 20-foot radius and dim light for an additional 20 feet.',
        classes: ['bard', 'cleric', 'sorcerer', 'wizard'],
    },
    {
        id: 'mage-hand',
        name: 'Mage Hand',
        level: 0,
        school: 'conjuration',
        castingTime: '1 action',
        range: '30 feet',
        components: { verbal: true, somatic: true },
        duration: '1 minute',
        description: 'A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action.',
        classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
    },
    {
        id: 'prestidigitation',
        name: 'Prestidigitation',
        level: 0,
        school: 'transmutation',
        castingTime: '1 action',
        range: '10 feet',
        components: { verbal: true, somatic: true },
        duration: 'Up to 1 hour',
        description: 'This spell is a minor magical trick that novice spellcasters use for practice.',
        classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
    },
    {
        id: 'sacred-flame',
        name: 'Sacred Flame',
        level: 0,
        school: 'evocation',
        castingTime: '1 action',
        range: '60 feet',
        components: { verbal: true, somatic: true },
        duration: 'Instantaneous',
        description: 'Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 radiant damage.',
        classes: ['cleric'],
        damage: { dice: '1d8', type: 'radiant' },
    },
    {
        id: 'eldritch-blast',
        name: 'Eldritch Blast',
        level: 0,
        school: 'evocation',
        castingTime: '1 action',
        range: '120 feet',
        components: { verbal: true, somatic: true },
        duration: 'Instantaneous',
        description: 'A beam of crackling energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 force damage.',
        higherLevels: 'The spell creates more beams at higher levels: two beams at 5th level, three at 11th, and four at 17th.',
        classes: ['warlock'],
        damage: { dice: '1d10', type: 'force' },
    },

    // 1st Level Spells
    {
        id: 'magic-missile',
        name: 'Magic Missile',
        level: 1,
        school: 'evocation',
        castingTime: '1 action',
        range: '120 feet',
        components: { verbal: true, somatic: true },
        duration: 'Instantaneous',
        description: 'You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target.',
        higherLevels: 'When you cast this spell using a spell slot of 2nd level or higher, the spell creates one more dart for each slot level above 1st.',
        classes: ['sorcerer', 'wizard'],
        damage: { dice: '1d4+1', type: 'force' },
    },
    {
        id: 'shield',
        name: 'Shield',
        level: 1,
        school: 'abjuration',
        castingTime: '1 reaction',
        range: 'Self',
        components: { verbal: true, somatic: true },
        duration: '1 round',
        description: 'An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack.',
        classes: ['sorcerer', 'wizard'],
    },
    {
        id: 'cure-wounds',
        name: 'Cure Wounds',
        level: 1,
        school: 'evocation',
        castingTime: '1 action',
        range: 'Touch',
        components: { verbal: true, somatic: true },
        duration: 'Instantaneous',
        description: 'A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier.',
        higherLevels: 'When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st.',
        classes: ['bard', 'cleric', 'druid', 'paladin', 'ranger'],
        healing: '1d8',
    },
    {
        id: 'burning-hands',
        name: 'Burning Hands',
        level: 1,
        school: 'evocation',
        castingTime: '1 action',
        range: 'Self (15-foot cone)',
        components: { verbal: true, somatic: true },
        duration: 'Instantaneous',
        description: 'As you hold your hands with thumbs touching and fingers spread, a thin sheet of flames shoots forth from your outstretched fingertips. Each creature in a 15-foot cone must make a Dexterity saving throw.',
        classes: ['sorcerer', 'wizard'],
        damage: { dice: '3d6', type: 'fire' },
        savingThrow: 'dexterity',
    },
    {
        id: 'sleep',
        name: 'Sleep',
        level: 1,
        school: 'enchantment',
        castingTime: '1 action',
        range: '90 feet',
        components: { verbal: true, somatic: true, material: true, materialDescription: 'a pinch of fine sand, rose petals, or a cricket' },
        duration: '1 minute',
        description: 'This spell sends creatures into a magical slumber. Roll 5d8; the total is how many hit points of creatures this spell can affect.',
        classes: ['bard', 'sorcerer', 'wizard'],
    },
    {
        id: 'thunderwave',
        name: 'Thunderwave',
        level: 1,
        school: 'evocation',
        castingTime: '1 action',
        range: 'Self (15-foot cube)',
        components: { verbal: true, somatic: true },
        duration: 'Instantaneous',
        description: 'A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw.',
        classes: ['bard', 'druid', 'sorcerer', 'wizard'],
        damage: { dice: '2d8', type: 'thunder' },
        savingThrow: 'constitution',
    },
    {
        id: 'healing-word',
        name: 'Healing Word',
        level: 1,
        school: 'evocation',
        castingTime: '1 bonus action',
        range: '60 feet',
        components: { verbal: true },
        duration: 'Instantaneous',
        description: 'A creature of your choice that you can see within range regains hit points equal to 1d4 + your spellcasting ability modifier.',
        classes: ['bard', 'cleric', 'druid'],
        healing: '1d4',
    },

    // 2nd Level Spells
    {
        id: 'scorching-ray',
        name: 'Scorching Ray',
        level: 2,
        school: 'evocation',
        castingTime: '1 action',
        range: '120 feet',
        components: { verbal: true, somatic: true },
        duration: 'Instantaneous',
        description: 'You create three rays of fire and hurl them at targets within range. You can hurl them at one target or several. Make a ranged spell attack for each ray. On a hit, the target takes 2d6 fire damage.',
        classes: ['sorcerer', 'wizard'],
        damage: { dice: '2d6', type: 'fire' },
    },
    {
        id: 'misty-step',
        name: 'Misty Step',
        level: 2,
        school: 'conjuration',
        castingTime: '1 bonus action',
        range: 'Self',
        components: { verbal: true },
        duration: 'Instantaneous',
        description: 'Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see.',
        classes: ['sorcerer', 'warlock', 'wizard'],
    },
    {
        id: 'hold-person',
        name: 'Hold Person',
        level: 2,
        school: 'enchantment',
        castingTime: '1 action',
        range: '60 feet',
        components: { verbal: true, somatic: true, material: true, materialDescription: 'a small, straight piece of iron' },
        duration: 'Concentration, up to 1 minute',
        concentration: true,
        description: 'Choose a humanoid that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration.',
        classes: ['bard', 'cleric', 'druid', 'sorcerer', 'warlock', 'wizard'],
        savingThrow: 'wisdom',
    },

    // 3rd Level Spells
    {
        id: 'fireball',
        name: 'Fireball',
        level: 3,
        school: 'evocation',
        castingTime: '1 action',
        range: '150 feet',
        components: { verbal: true, somatic: true, material: true, materialDescription: 'a tiny ball of bat guano and sulfur' },
        duration: 'Instantaneous',
        description: 'A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw.',
        higherLevels: 'When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.',
        classes: ['sorcerer', 'wizard'],
        damage: { dice: '8d6', type: 'fire' },
        savingThrow: 'dexterity',
    },
    {
        id: 'lightning-bolt',
        name: 'Lightning Bolt',
        level: 3,
        school: 'evocation',
        castingTime: '1 action',
        range: 'Self (100-foot line)',
        components: { verbal: true, somatic: true, material: true, materialDescription: 'a bit of fur and a rod of amber, crystal, or glass' },
        duration: 'Instantaneous',
        description: 'A stroke of lightning forming a line 100 feet long and 5 feet wide blasts out from you in a direction you choose.',
        classes: ['sorcerer', 'wizard'],
        damage: { dice: '8d6', type: 'lightning' },
        savingThrow: 'dexterity',
    },
    {
        id: 'counterspell',
        name: 'Counterspell',
        level: 3,
        school: 'abjuration',
        castingTime: '1 reaction',
        range: '60 feet',
        components: { somatic: true },
        duration: 'Instantaneous',
        description: 'You attempt to interrupt a creature in the process of casting a spell. If the creature is casting a spell of 3rd level or lower, its spell fails and has no effect.',
        classes: ['sorcerer', 'warlock', 'wizard'],
    },
    {
        id: 'dispel-magic',
        name: 'Dispel Magic',
        level: 3,
        school: 'abjuration',
        castingTime: '1 action',
        range: '120 feet',
        components: { verbal: true, somatic: true },
        duration: 'Instantaneous',
        description: 'Choose one creature, object, or magical effect within range. Any spell of 3rd level or lower on the target ends.',
        classes: ['bard', 'cleric', 'druid', 'paladin', 'sorcerer', 'warlock', 'wizard'],
    },

    // 4th Level Spells
    {
        id: 'dimension-door',
        name: 'Dimension Door',
        level: 4,
        school: 'conjuration',
        castingTime: '1 action',
        range: '500 feet',
        components: { verbal: true },
        duration: 'Instantaneous',
        description: 'You teleport yourself from your current location to any other spot within range. You arrive at exactly the spot desired.',
        classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
    },
    {
        id: 'polymorph',
        name: 'Polymorph',
        level: 4,
        school: 'transmutation',
        castingTime: '1 action',
        range: '60 feet',
        components: { verbal: true, somatic: true, material: true, materialDescription: 'a caterpillar cocoon' },
        duration: 'Concentration, up to 1 hour',
        concentration: true,
        description: 'This spell transforms a creature that you can see within range into a new form.',
        classes: ['bard', 'druid', 'sorcerer', 'wizard'],
        savingThrow: 'wisdom',
    },

    // 5th Level Spells
    {
        id: 'cone-of-cold',
        name: 'Cone of Cold',
        level: 5,
        school: 'evocation',
        castingTime: '1 action',
        range: 'Self (60-foot cone)',
        components: { verbal: true, somatic: true, material: true, materialDescription: 'a small crystal or glass cone' },
        duration: 'Instantaneous',
        description: 'A blast of cold air erupts from your hands. Each creature in a 60-foot cone must make a Constitution saving throw.',
        classes: ['sorcerer', 'wizard'],
        damage: { dice: '8d8', type: 'cold' },
        savingThrow: 'constitution',
    },

    // 9th Level Spells
    {
        id: 'wish',
        name: 'Wish',
        level: 9,
        school: 'conjuration',
        castingTime: '1 action',
        range: 'Self',
        components: { verbal: true },
        duration: 'Instantaneous',
        description: 'Wish is the mightiest spell a mortal creature can cast. By simply speaking aloud, you can alter the very foundations of reality in accord with your desires.',
        classes: ['sorcerer', 'wizard'],
    },
    {
        id: 'meteor-swarm',
        name: 'Meteor Swarm',
        level: 9,
        school: 'evocation',
        castingTime: '1 action',
        range: '1 mile',
        components: { verbal: true, somatic: true },
        duration: 'Instantaneous',
        description: 'Blazing orbs of fire plummet to the ground at four different points you can see within range.',
        classes: ['sorcerer', 'wizard'],
        damage: { dice: '40d6', type: 'fire' },
        savingThrow: 'dexterity',
    },
];

// Helper functions
export function getSpellById(id: string): Spell | undefined {
    return spells.find(spell => spell.id === id);
}

export function getSpellsByLevel(level: number): Spell[] {
    return spells.filter(spell => spell.level === level);
}

export function getSpellsByClass(className: string): Spell[] {
    return spells.filter(spell => spell.classes.includes(className));
}

export function getSpellsBySchool(school: SpellSchool): Spell[] {
    return spells.filter(spell => spell.school === school);
}

export function searchSpells(query: string): Spell[] {
    const lowerQuery = query.toLowerCase();
    return spells.filter(spell =>
        spell.name.toLowerCase().includes(lowerQuery) ||
        spell.description.toLowerCase().includes(lowerQuery)
    );
}

export function getCantrips(): Spell[] {
    return getSpellsByLevel(0);
}

export const spellSchools: SpellSchool[] = [
    'abjuration', 'conjuration', 'divination', 'enchantment',
    'evocation', 'illusion', 'necromancy', 'transmutation'
];

export const spellLevels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
