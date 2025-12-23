import { AbilityScores, Alignment, Race, Class } from '@/types';
import { races } from '@/data/races';
import { classes } from '@/data/classes';

export interface GeneratedNPC {
    id: string;
    name: string;
    race: string;
    class: string;
    alignment: Alignment;
    level: number;
    abilityScores: AbilityScores;
    hp: number;
    ac: number;
    traits: string[];
    flaw: string;
    ideal: string;
    bond: string;
    description: string;
}

const FIRST_NAMES = {
    human: ['John', 'Mary', 'Robert', 'Patricia', 'James', 'Jennifer', 'William', 'Elizabeth'],
    elf: ['Adran', 'Aelar', 'Aramil', 'Arannis', 'Berrian', 'Carric', 'Enialis', 'Erdan'],
    dwarf: ['Adrik', 'Baern', 'Barendd', 'Brottor', 'Bruenor', 'Dain', 'Darrak', 'Delg'],
    halfling: ['Alton', 'Ander', 'Cade', 'Corrin', 'Eldon', 'Errich', 'Finnan', 'Garret'],
    orc: ['Dench', 'Feng', 'Gell', 'Henk', 'Holg', 'Imsh', 'Keth', 'Krusk'],
    dragonborn: ['Arjhan', 'Balasar', 'Bharash', 'Donaar', 'Ghesh', 'Heskan', 'Kriv', 'Medrash'],
    tiefling: ['Akmenos', 'Amnon', 'Barakas', 'Damakos', 'Ekemon', 'Iados', 'Kairon', 'Leucis'],
    gnome: ['Alston', 'Alvyn', 'Boddynock', 'Brocc', 'Burgell', 'Dimble', 'Eldon', 'Erky'],
};

const LAST_NAMES = {
    human: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'],
    elf: ['Amakiir', 'Amastacia', 'Galanodel', 'Holimion', 'Ilphelkiir', 'Liadon', 'Meliamne'],
    dwarf: ['Balderk', 'Battlehammer', 'Brawnanvil', 'Dankil', 'Fireforge', 'Frostbeard', 'Gorunn'],
    halfling: ['Brushgather', 'Goodbarrel', 'Greenbottle', 'High-hill', 'Hilltopple', 'Leagallow'],
    orc: ['None (Orcs typically use epithets)'],
    dragonborn: ['Clethtinthiallor', 'Daardendrian', 'Delmirev', 'Drachedandion', 'Fenkenkabradon'],
    tiefling: ['None (Tieflings often use virtue names)'],
    gnome: ['Beren', 'Daergel', 'Folkor', 'Garrick', 'Nackle', 'Murnig', 'Ningel', 'Raulnor'],
};

const TRAITS = [
    'Always speaks loudly', 'Twitches when nervous', 'Has a notable scar', 'Constantly hums',
    'Speaks in rhymes', 'Is overly polite', 'Is incredibly rude', 'Smells like pine needles',
    'Has a pet rat', 'Collects spoons', 'Wears too much jewelry', 'Has a nervous laugh',
];

const IDEALS = [
    'Justice. People should be treated fairly.',
    'Charity. I distribute money to the poor.',
    'Greed. I want it all.',
    'Power. I will be the strongest.',
    'Knowledge. I must learn everything.',
    'Freedom. Chains are meant to be broken.',
];

const BONDS = [
    'I would die for my family.',
    'I am looking for my lost sibling.',
    'I owe a debt to a powerful entity.',
    'I protect this town.',
    'I seek revenge against the dragon that destroyed my home.',
];

const FLAWS = [
    'I judge others harshly.',
    'I cannot resist a pretty face.',
    'I am terrified of spiders.',
    'I drink too much.',
    'I am secretly a coward.',
    'I assume everyone is trying to cheat me.',
];

function rollDice(sides: number, count: number = 1): number {
    let total = 0;
    for (let i = 0; i < count; i++) {
        total += Math.floor(Math.random() * sides) + 1;
    }
    return total;
}

function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

export function generateNPC(level: number = 1): GeneratedNPC {
    // 1. Pick Race and Class
    const raceKeys = Object.keys(FIRST_NAMES) as Array<keyof typeof FIRST_NAMES>;
    const raceKey = getRandomItem(raceKeys);
    const raceName = raceKey.charAt(0).toUpperCase() + raceKey.slice(1);

    const classKeys = ['Fighter', 'Wizard', 'Rogue', 'Cleric', 'Bard', 'Barbarian'];
    const className = getRandomItem(classKeys);

    // 2. Generate Name
    const firstName = getRandomItem(FIRST_NAMES[raceKey] || FIRST_NAMES.human);
    const lastName = getRandomItem(LAST_NAMES[raceKey] || LAST_NAMES.human);
    const name = `${firstName} ${lastName.includes('None') ? '' : lastName}`.trim();

    // 3. Generate Ability Scores
    const abilities: AbilityScores = {
        strength: rollDice(6, 3),
        dexterity: rollDice(6, 3),
        constitution: rollDice(6, 3),
        intelligence: rollDice(6, 3),
        wisdom: rollDice(6, 3),
        charisma: rollDice(6, 3),
    };

    // Adjust mainly for class (simple heuristic)
    if (className === 'Fighter' || className === 'Barbarian') abilities.strength += 2;
    if (className === 'Rogue') abilities.dexterity += 2;
    if (className === 'Wizard') abilities.intelligence += 2;
    if (className === 'Cleric') abilities.wisdom += 2;
    if (className === 'Bard') abilities.charisma += 2;

    // 4. Calculate Stats
    const conMod = Math.floor((abilities.constitution - 10) / 2);
    const dexMod = Math.floor((abilities.dexterity - 10) / 2);

    // HP estimation: (Hit Die + Con Mod) * Level
    const hitDieMap: Record<string, number> = {
        'Wizard': 6, 'Rogue': 8, 'Bard': 8, 'Cleric': 8, 'Fighter': 10, 'Barbarian': 12
    };
    const hitDie = hitDieMap[className] || 8;
    const hp = Math.max(1, (hitDie + conMod)) + Math.max(0, (hitDie / 2 + 1 + conMod) * (level - 1));

    // AC estimation
    let ac = 10 + dexMod;
    if (className === 'Fighter' || className === 'Cleric') ac = 16; // Armor assumption
    if (className === 'Barbarian') ac = 10 + dexMod + Math.floor((abilities.constitution - 10) / 2); // Unarmored Defense

    return {
        id: `npc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        race: raceName,
        class: className,
        alignment: getRandomItem(['lawful good', 'neutral good', 'chaotic good', 'lawful neutral', 'true neutral', 'chaotic neutral', 'lawful evil', 'neutral evil', 'chaotic evil']),
        level,
        abilityScores: abilities,
        hp: Math.floor(hp),
        ac,
        traits: [getRandomItem(TRAITS)],
        ideal: getRandomItem(IDEALS),
        bond: getRandomItem(BONDS),
        flaw: getRandomItem(FLAWS),
        description: `A ${getRandomItem(['tall', 'short', 'stocky', 'slender'])} ${raceName} with ${getRandomItem(['piercing', 'kind', 'shifty', 'weary'])} eyes.`,
    };
}
