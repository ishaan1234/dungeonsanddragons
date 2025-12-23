import { Monster, DamageType, Condition, Size, CreatureType } from '@/types';

// D&D 5e SRD Monsters Database
export const monsters: Monster[] = [
    // CR 0-1/4
    {
        id: 'goblin',
        name: 'Goblin',
        size: 'small',
        type: 'humanoid',
        alignment: 'neutral evil',
        armorClass: 15,
        hitPoints: 7,
        hitDice: '2d6',
        speed: { walk: 30 },
        abilityScores: {
            strength: 8, dexterity: 14, constitution: 10,
            intelligence: 10, wisdom: 8, charisma: 8,
        },
        skills: { stealth: 6 },
        senses: { darkvision: 60, passivePerception: 9 },
        languages: ['Common', 'Goblin'],
        challengeRating: 0.25,
        experiencePoints: 50,
        traits: [
            { name: 'Nimble Escape', description: 'The goblin can take the Disengage or Hide action as a bonus action on each of its turns.' }
        ],
        actions: [
            { name: 'Scimitar', description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage.', attackBonus: 4, damage: '1d6+2', damageType: 'slashing' },
            { name: 'Shortbow', description: 'Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6 + 2) piercing damage.', attackBonus: 4, damage: '1d6+2', damageType: 'piercing' }
        ],
    },
    {
        id: 'skeleton',
        name: 'Skeleton',
        size: 'medium',
        type: 'undead',
        alignment: 'lawful evil',
        armorClass: 13,
        hitPoints: 13,
        hitDice: '2d8+4',
        speed: { walk: 30 },
        abilityScores: {
            strength: 10, dexterity: 14, constitution: 15,
            intelligence: 6, wisdom: 8, charisma: 5,
        },
        damageVulnerabilities: ['bludgeoning'],
        damageImmunities: ['poison'],
        conditionImmunities: ['exhaustion', 'poisoned'],
        senses: { darkvision: 60, passivePerception: 9 },
        languages: ['understands languages it knew in life but can\'t speak'],
        challengeRating: 0.25,
        experiencePoints: 50,
        actions: [
            { name: 'Shortsword', description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage.', attackBonus: 4, damage: '1d6+2', damageType: 'piercing' },
            { name: 'Shortbow', description: 'Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6 + 2) piercing damage.', attackBonus: 4, damage: '1d6+2', damageType: 'piercing' }
        ],
    },
    {
        id: 'zombie',
        name: 'Zombie',
        size: 'medium',
        type: 'undead',
        alignment: 'neutral evil',
        armorClass: 8,
        hitPoints: 22,
        hitDice: '3d8+9',
        speed: { walk: 20 },
        abilityScores: {
            strength: 13, dexterity: 6, constitution: 16,
            intelligence: 3, wisdom: 6, charisma: 5,
        },
        savingThrows: { wisdom: 0 },
        damageImmunities: ['poison'],
        conditionImmunities: ['poisoned'],
        senses: { darkvision: 60, passivePerception: 8 },
        languages: ['understands languages it knew in life but can\'t speak'],
        challengeRating: 0.25,
        experiencePoints: 50,
        traits: [
            { name: 'Undead Fortitude', description: 'If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw with a DC of 5 + the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead.' }
        ],
        actions: [
            { name: 'Slam', description: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) bludgeoning damage.', attackBonus: 3, damage: '1d6+1', damageType: 'bludgeoning' }
        ],
    },

    // CR 1/2 - 1
    {
        id: 'orc',
        name: 'Orc',
        size: 'medium',
        type: 'humanoid',
        alignment: 'chaotic evil',
        armorClass: 13,
        hitPoints: 15,
        hitDice: '2d8+6',
        speed: { walk: 30 },
        abilityScores: {
            strength: 16, dexterity: 12, constitution: 16,
            intelligence: 7, wisdom: 11, charisma: 10,
        },
        skills: { intimidation: 2 },
        senses: { darkvision: 60, passivePerception: 10 },
        languages: ['Common', 'Orc'],
        challengeRating: 0.5,
        experiencePoints: 100,
        traits: [
            { name: 'Aggressive', description: 'As a bonus action, the orc can move up to its speed toward a hostile creature that it can see.' }
        ],
        actions: [
            { name: 'Greataxe', description: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9 (1d12 + 3) slashing damage.', attackBonus: 5, damage: '1d12+3', damageType: 'slashing' },
            { name: 'Javelin', description: 'Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 6 (1d6 + 3) piercing damage.', attackBonus: 5, damage: '1d6+3', damageType: 'piercing' }
        ],
    },
    {
        id: 'dire-wolf',
        name: 'Dire Wolf',
        size: 'large',
        type: 'beast',
        alignment: 'unaligned',
        armorClass: 14,
        hitPoints: 37,
        hitDice: '5d10+10',
        speed: { walk: 50 },
        abilityScores: {
            strength: 17, dexterity: 15, constitution: 15,
            intelligence: 3, wisdom: 12, charisma: 7,
        },
        skills: { perception: 3, stealth: 4 },
        senses: { passivePerception: 13 },
        challengeRating: 1,
        experiencePoints: 200,
        traits: [
            { name: 'Keen Hearing and Smell', description: 'The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.' },
            { name: 'Pack Tactics', description: 'The wolf has advantage on attack rolls against a creature if at least one of the wolf\'s allies is within 5 feet of the creature and the ally isn\'t incapacitated.' }
        ],
        actions: [
            { name: 'Bite', description: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) piercing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.', attackBonus: 5, damage: '2d6+3', damageType: 'piercing' }
        ],
    },

    // CR 2-5
    {
        id: 'ogre',
        name: 'Ogre',
        size: 'large',
        type: 'giant',
        alignment: 'chaotic evil',
        armorClass: 11,
        hitPoints: 59,
        hitDice: '7d10+21',
        speed: { walk: 40 },
        abilityScores: {
            strength: 19, dexterity: 8, constitution: 16,
            intelligence: 5, wisdom: 7, charisma: 7,
        },
        senses: { darkvision: 60, passivePerception: 8 },
        languages: ['Common', 'Giant'],
        challengeRating: 2,
        experiencePoints: 450,
        actions: [
            { name: 'Greatclub', description: 'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage.', attackBonus: 6, damage: '2d8+4', damageType: 'bludgeoning' },
            { name: 'Javelin', description: 'Melee or Ranged Weapon Attack: +6 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 11 (2d6 + 4) piercing damage.', attackBonus: 6, damage: '2d6+4', damageType: 'piercing' }
        ],
    },
    {
        id: 'owlbear',
        name: 'Owlbear',
        size: 'large',
        type: 'monstrosity',
        alignment: 'unaligned',
        armorClass: 13,
        hitPoints: 59,
        hitDice: '7d10+21',
        speed: { walk: 40 },
        abilityScores: {
            strength: 20, dexterity: 12, constitution: 17,
            intelligence: 3, wisdom: 12, charisma: 7,
        },
        skills: { perception: 3 },
        senses: { darkvision: 60, passivePerception: 13 },
        challengeRating: 3,
        experiencePoints: 700,
        traits: [
            { name: 'Keen Sight and Smell', description: 'The owlbear has advantage on Wisdom (Perception) checks that rely on sight or smell.' }
        ],
        actions: [
            { name: 'Multiattack', description: 'The owlbear makes two attacks: one with its beak and one with its claws.' },
            { name: 'Beak', description: 'Melee Weapon Attack: +7 to hit, reach 5 ft., one creature. Hit: 10 (1d10 + 5) piercing damage.', attackBonus: 7, damage: '1d10+5', damageType: 'piercing' },
            { name: 'Claws', description: 'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 14 (2d8 + 5) slashing damage.', attackBonus: 7, damage: '2d8+5', damageType: 'slashing' }
        ],
    },
    {
        id: 'troll',
        name: 'Troll',
        size: 'large',
        type: 'giant',
        alignment: 'chaotic evil',
        armorClass: 15,
        hitPoints: 84,
        hitDice: '8d10+40',
        speed: { walk: 30 },
        abilityScores: {
            strength: 18, dexterity: 13, constitution: 20,
            intelligence: 7, wisdom: 9, charisma: 7,
        },
        skills: { perception: 2 },
        senses: { darkvision: 60, passivePerception: 12 },
        languages: ['Giant'],
        challengeRating: 5,
        experiencePoints: 1800,
        traits: [
            { name: 'Keen Smell', description: 'The troll has advantage on Wisdom (Perception) checks that rely on smell.' },
            { name: 'Regeneration', description: 'The troll regains 10 hit points at the start of its turn. If the troll takes acid or fire damage, this trait doesn\'t function at the start of the troll\'s next turn. The troll dies only if it starts its turn with 0 hit points and doesn\'t regenerate.' }
        ],
        actions: [
            { name: 'Multiattack', description: 'The troll makes three attacks: one with its bite and two with its claws.' },
            { name: 'Bite', description: 'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 7 (1d6 + 4) piercing damage.', attackBonus: 7, damage: '1d6+4', damageType: 'piercing' },
            { name: 'Claw', description: 'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage.', attackBonus: 7, damage: '2d6+4', damageType: 'slashing' }
        ],
    },

    // Dragons
    {
        id: 'young-red-dragon',
        name: 'Young Red Dragon',
        size: 'large',
        type: 'dragon',
        alignment: 'chaotic evil',
        armorClass: 18,
        hitPoints: 178,
        hitDice: '17d10+85',
        speed: { walk: 40, climb: 40, fly: 80 },
        abilityScores: {
            strength: 23, dexterity: 10, constitution: 21,
            intelligence: 14, wisdom: 11, charisma: 19,
        },
        savingThrows: { dexterity: 4, constitution: 9, wisdom: 4, charisma: 8 },
        skills: { perception: 8, stealth: 4 },
        damageImmunities: ['fire'],
        senses: { blindsight: 30, darkvision: 120, passivePerception: 18 },
        languages: ['Common', 'Draconic'],
        challengeRating: 10,
        experiencePoints: 5900,
        actions: [
            { name: 'Multiattack', description: 'The dragon makes three attacks: one with its bite and two with its claws.' },
            { name: 'Bite', description: 'Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage plus 3 (1d6) fire damage.', attackBonus: 10, damage: '2d10+6', damageType: 'piercing' },
            { name: 'Claw', description: 'Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage.', attackBonus: 10, damage: '2d6+6', damageType: 'slashing' },
            { name: 'Fire Breath (Recharge 5-6)', description: 'The dragon exhales fire in a 30-foot cone. Each creature in that area must make a DC 17 Dexterity saving throw, taking 56 (16d6) fire damage on a failed save, or half as much damage on a successful one.', damage: '16d6', damageType: 'fire' }
        ],
    },
    {
        id: 'adult-black-dragon',
        name: 'Adult Black Dragon',
        size: 'huge',
        type: 'dragon',
        alignment: 'chaotic evil',
        armorClass: 19,
        hitPoints: 195,
        hitDice: '17d12+85',
        speed: { walk: 40, fly: 80, swim: 40 },
        abilityScores: {
            strength: 23, dexterity: 14, constitution: 21,
            intelligence: 14, wisdom: 13, charisma: 17,
        },
        savingThrows: { dexterity: 7, constitution: 10, wisdom: 6, charisma: 8 },
        skills: { perception: 11, stealth: 7 },
        damageImmunities: ['acid'],
        senses: { blindsight: 60, darkvision: 120, passivePerception: 21 },
        languages: ['Common', 'Draconic'],
        challengeRating: 14,
        experiencePoints: 11500,
        traits: [
            { name: 'Amphibious', description: 'The dragon can breathe air and water.' },
            { name: 'Legendary Resistance (3/Day)', description: 'If the dragon fails a saving throw, it can choose to succeed instead.' }
        ],
        actions: [
            { name: 'Multiattack', description: 'The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.' },
            { name: 'Bite', description: 'Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage plus 4 (1d8) acid damage.', attackBonus: 11, damage: '2d10+6', damageType: 'piercing' },
            { name: 'Acid Breath (Recharge 5-6)', description: 'The dragon exhales acid in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 54 (12d8) acid damage on a failed save, or half as much damage on a successful one.', damage: '12d8', damageType: 'acid' }
        ],
        legendaryActions: [
            { name: 'Detect', description: 'The dragon makes a Wisdom (Perception) check.' },
            { name: 'Tail Attack', description: 'The dragon makes a tail attack.' },
            { name: 'Wing Attack (Costs 2 Actions)', description: 'The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone.' }
        ],
    },
];

// Helper functions
export function getMonsterById(id: string): Monster | undefined {
    return monsters.find(m => m.id === id);
}

export function getMonstersByCR(cr: number): Monster[] {
    return monsters.filter(m => m.challengeRating === cr);
}

export function getMonstersByType(type: CreatureType): Monster[] {
    return monsters.filter(m => m.type === type);
}

export function searchMonsters(query: string): Monster[] {
    const lowerQuery = query.toLowerCase();
    return monsters.filter(m =>
        m.name.toLowerCase().includes(lowerQuery) ||
        m.type.toLowerCase().includes(lowerQuery)
    );
}

export function getMonstersBySize(size: Size): Monster[] {
    return monsters.filter(m => m.size === size);
}

export const creatureTypes: CreatureType[] = [
    'aberration', 'beast', 'celestial', 'construct', 'dragon',
    'elemental', 'fey', 'fiend', 'giant', 'humanoid',
    'monstrosity', 'ooze', 'plant', 'undead'
];

export const challengeRatings = [0, 0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

export function formatCR(cr: number): string {
    if (cr === 0.125) return '1/8';
    if (cr === 0.25) return '1/4';
    if (cr === 0.5) return '1/2';
    return cr.toString();
}
