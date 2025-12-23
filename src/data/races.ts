import { Race } from '@/types';

export const races: Race[] = [
    {
        id: 'human',
        name: 'Human',
        description: 'Humans are the most adaptable and ambitious people among the common races. Whatever drives them, humans are the innovators, the achievers, and the pioneers of the worlds.',
        abilityScoreIncreases: { strength: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1 },
        size: 'medium',
        speed: 30,
        languages: ['Common', 'One extra language of your choice'],
        traits: [
            { name: 'Ability Score Increase', description: 'Your ability scores each increase by 1.' },
            { name: 'Extra Language', description: 'You can speak, read, and write one extra language of your choice.' }
        ]
    },
    {
        id: 'elf',
        name: 'Elf',
        description: 'Elves are a magical people of otherworldly grace, living in places of ethereal beauty, in the midst of ancient forests or in silvery spires glittering with faerie light.',
        abilityScoreIncreases: { dexterity: 2 },
        size: 'medium',
        speed: 30,
        darkvision: 60,
        languages: ['Common', 'Elvish'],
        traits: [
            { name: 'Darkvision', description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.' },
            { name: 'Keen Senses', description: 'You have proficiency in the Perception skill.' },
            { name: 'Fey Ancestry', description: 'You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.' },
            { name: 'Trance', description: 'Elves don\'t need to sleep. Instead, they meditate deeply for 4 hours a day.' }
        ],
        subraces: [
            {
                id: 'high-elf',
                name: 'High Elf',
                description: 'High elves have keen minds and a mastery of at least the basics of magic.',
                abilityScoreIncreases: { intelligence: 1 },
                traits: [
                    { name: 'Cantrip', description: 'You know one cantrip of your choice from the wizard spell list.' },
                    { name: 'Extra Language', description: 'You can speak, read, and write one extra language of your choice.' }
                ]
            },
            {
                id: 'wood-elf',
                name: 'Wood Elf',
                description: 'Wood elves have keen senses and intuition, and their fleet feet carry them quickly through their native forests.',
                abilityScoreIncreases: { wisdom: 1 },
                traits: [
                    { name: 'Fleet of Foot', description: 'Your base walking speed increases to 35 feet.' },
                    { name: 'Mask of the Wild', description: 'You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena.' }
                ]
            },
            {
                id: 'dark-elf',
                name: 'Dark Elf (Drow)',
                description: 'Descended from an earlier subrace of elves, the drow were banished from the surface world for following the goddess Lolth down the path to evil.',
                abilityScoreIncreases: { charisma: 1 },
                traits: [
                    { name: 'Superior Darkvision', description: 'Your darkvision has a radius of 120 feet.' },
                    { name: 'Sunlight Sensitivity', description: 'You have disadvantage on attack rolls and Perception checks that rely on sight when you, the target, or whatever you are trying to perceive is in direct sunlight.' },
                    { name: 'Drow Magic', description: 'You know the dancing lights cantrip. At 3rd level, you can cast faerie fire once per day. At 5th level, you can cast darkness once per day.' }
                ]
            }
        ]
    },
    {
        id: 'dwarf',
        name: 'Dwarf',
        description: 'Bold and hardy, dwarves are known as skilled warriors, miners, and workers of stone and metal. They stand well under 5 feet tall, but are so broad and compact that they can weigh as much as a human standing nearly two feet taller.',
        abilityScoreIncreases: { constitution: 2 },
        size: 'medium',
        speed: 25,
        darkvision: 60,
        languages: ['Common', 'Dwarvish'],
        traits: [
            { name: 'Darkvision', description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.' },
            { name: 'Dwarven Resilience', description: 'You have advantage on saving throws against poison, and you have resistance against poison damage.' },
            { name: 'Dwarven Combat Training', description: 'You have proficiency with the battleaxe, handaxe, light hammer, and warhammer.' },
            { name: 'Stonecunning', description: 'Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient and add double your proficiency bonus.' }
        ],
        subraces: [
            {
                id: 'hill-dwarf',
                name: 'Hill Dwarf',
                description: 'Hill dwarves have keen senses, deep intuition, and remarkable resilience.',
                abilityScoreIncreases: { wisdom: 1 },
                traits: [
                    { name: 'Dwarven Toughness', description: 'Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.' }
                ]
            },
            {
                id: 'mountain-dwarf',
                name: 'Mountain Dwarf',
                description: 'Mountain dwarves are strong and hardy, accustomed to a difficult life in rugged terrain.',
                abilityScoreIncreases: { strength: 2 },
                traits: [
                    { name: 'Dwarven Armor Training', description: 'You have proficiency with light and medium armor.' }
                ]
            }
        ]
    },
    {
        id: 'halfling',
        name: 'Halfling',
        description: 'The diminutive halflings survive in a world full of larger creatures by avoiding notice or, barring that, avoiding offense.',
        abilityScoreIncreases: { dexterity: 2 },
        size: 'small',
        speed: 25,
        languages: ['Common', 'Halfling'],
        traits: [
            { name: 'Lucky', description: 'When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.' },
            { name: 'Brave', description: 'You have advantage on saving throws against being frightened.' },
            { name: 'Halfling Nimbleness', description: 'You can move through the space of any creature that is of a size larger than yours.' }
        ],
        subraces: [
            {
                id: 'lightfoot',
                name: 'Lightfoot Halfling',
                description: 'Lightfoot halflings are more prone to wanderlust than other halflings.',
                abilityScoreIncreases: { charisma: 1 },
                traits: [
                    { name: 'Naturally Stealthy', description: 'You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.' }
                ]
            },
            {
                id: 'stout',
                name: 'Stout Halfling',
                description: 'Stout halflings are hardier than average and have some resistance to poison.',
                abilityScoreIncreases: { constitution: 1 },
                traits: [
                    { name: 'Stout Resilience', description: 'You have advantage on saving throws against poison, and you have resistance against poison damage.' }
                ]
            }
        ]
    },
    {
        id: 'dragonborn',
        name: 'Dragonborn',
        description: 'Born of dragons, dragonborn walk proudly through a world that greets them with fearful incomprehension. Shaped by draconic gods or the dragons themselves, dragonborn originally hatched from dragon eggs.',
        abilityScoreIncreases: { strength: 2, charisma: 1 },
        size: 'medium',
        speed: 30,
        languages: ['Common', 'Draconic'],
        traits: [
            { name: 'Draconic Ancestry', description: 'You have draconic ancestry. Choose one type of dragon from the Draconic Ancestry table. Your breath weapon and damage resistance are determined by the dragon type.' },
            { name: 'Breath Weapon', description: 'You can use your action to exhale destructive energy. Your draconic ancestry determines the size, shape, and damage type of the exhalation.' },
            { name: 'Damage Resistance', description: 'You have resistance to the damage type associated with your draconic ancestry.' }
        ]
    },
    {
        id: 'gnome',
        name: 'Gnome',
        description: 'A gnome\'s energy and enthusiasm for living shines through every inch of their tiny body. Gnomes average slightly over 3 feet tall and weigh 40 to 45 pounds.',
        abilityScoreIncreases: { intelligence: 2 },
        size: 'small',
        speed: 25,
        darkvision: 60,
        languages: ['Common', 'Gnomish'],
        traits: [
            { name: 'Darkvision', description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.' },
            { name: 'Gnome Cunning', description: 'You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.' }
        ],
        subraces: [
            {
                id: 'forest-gnome',
                name: 'Forest Gnome',
                description: 'Forest gnomes have a natural knack for illusion and an affinity with small animals.',
                abilityScoreIncreases: { dexterity: 1 },
                traits: [
                    { name: 'Natural Illusionist', description: 'You know the minor illusion cantrip. Intelligence is your spellcasting ability for it.' },
                    { name: 'Speak with Small Beasts', description: 'Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts.' }
                ]
            },
            {
                id: 'rock-gnome',
                name: 'Rock Gnome',
                description: 'Rock gnomes have a natural inventiveness and hardiness beyond that of other gnomes.',
                abilityScoreIncreases: { constitution: 1 },
                traits: [
                    { name: 'Artificer\'s Lore', description: 'Whenever you make an Intelligence (History) check related to magic items, alchemical objects, or technological devices, you can add twice your proficiency bonus.' },
                    { name: 'Tinker', description: 'You have proficiency with artisan\'s tools (tinker\'s tools). Using those tools, you can spend 1 hour and 10 gp worth of materials to construct a Tiny clockwork device.' }
                ]
            }
        ]
    },
    {
        id: 'half-elf',
        name: 'Half-Elf',
        description: 'Half-elves combine what some say are the best qualities of their elf and human parents: human curiosity, inventiveness, and ambition tempered by the refined senses, love of nature, and artistic tastes of the elves.',
        abilityScoreIncreases: { charisma: 2 },
        size: 'medium',
        speed: 30,
        darkvision: 60,
        languages: ['Common', 'Elvish', 'One extra language of your choice'],
        traits: [
            { name: 'Ability Score Increase', description: 'Your Charisma score increases by 2, and two other ability scores of your choice increase by 1.' },
            { name: 'Darkvision', description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.' },
            { name: 'Fey Ancestry', description: 'You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.' },
            { name: 'Skill Versatility', description: 'You gain proficiency in two skills of your choice.' }
        ]
    },
    {
        id: 'half-orc',
        name: 'Half-Orc',
        description: 'Half-orcs\' grayish pigmentation, sloping foreheads, jutting jaws, prominent teeth, and towering builds make their orcish heritage plain for all to see.',
        abilityScoreIncreases: { strength: 2, constitution: 1 },
        size: 'medium',
        speed: 30,
        darkvision: 60,
        languages: ['Common', 'Orc'],
        traits: [
            { name: 'Darkvision', description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.' },
            { name: 'Menacing', description: 'You gain proficiency in the Intimidation skill.' },
            { name: 'Relentless Endurance', description: 'When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can\'t use this feature again until you finish a long rest.' },
            { name: 'Savage Attacks', description: 'When you score a critical hit with a melee weapon attack, you can roll one of the weapon\'s damage dice one additional time and add it to the extra damage.' }
        ]
    },
    {
        id: 'tiefling',
        name: 'Tiefling',
        description: 'Tieflings are derived from human bloodlines, and in the broadest possible sense, they still look human. However, their infernal heritage has left a clear imprint on their appearance.',
        abilityScoreIncreases: { intelligence: 1, charisma: 2 },
        size: 'medium',
        speed: 30,
        darkvision: 60,
        languages: ['Common', 'Infernal'],
        traits: [
            { name: 'Darkvision', description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.' },
            { name: 'Hellish Resistance', description: 'You have resistance to fire damage.' },
            { name: 'Infernal Legacy', description: 'You know the thaumaturgy cantrip. At 3rd level, you can cast hellish rebuke as a 2nd-level spell once per day. At 5th level, you can cast darkness once per day.' }
        ]
    }
];

export function getRaceById(id: string): Race | undefined {
    return races.find(race => race.id === id);
}

export function getSubraceById(raceId: string, subraceId: string) {
    const race = getRaceById(raceId);
    return race?.subraces?.find(subrace => subrace.id === subraceId);
}
