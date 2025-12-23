import { Class } from '@/types';

export const classes: Class[] = [
    {
        id: 'barbarian',
        name: 'Barbarian',
        description: 'A fierce warrior who can enter a battle rage, gaining superhuman strength and resilience.',
        hitDie: 'd12',
        primaryAbility: ['strength'],
        savingThrowProficiencies: ['strength', 'constitution'],
        armorProficiencies: ['light armor', 'medium armor', 'shields'],
        weaponProficiencies: ['simple weapons', 'martial weapons'],
        skillChoices: ['animalHandling', 'athletics', 'intimidation', 'nature', 'perception', 'survival'],
        numSkillChoices: 2,
        features: [
            { name: 'Rage', level: 1, description: 'In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action. While raging, you gain advantage on Strength checks and saving throws, bonus rage damage, and resistance to bludgeoning, piercing, and slashing damage.' },
            { name: 'Unarmored Defense', level: 1, description: 'While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier.' },
            { name: 'Reckless Attack', level: 2, description: 'You can throw aside all concern for defense to attack with fierce desperation. When you make your first attack on your turn, you can decide to attack recklessly, giving you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.' },
            { name: 'Danger Sense', level: 2, description: 'You gain an uncanny sense of when things nearby aren\'t as they should be. You have advantage on Dexterity saving throws against effects that you can see.' },
            { name: 'Primal Path', level: 3, description: 'You choose a path that shapes the nature of your rage: Path of the Berserker or Path of the Totem Warrior.' },
            { name: 'Extra Attack', level: 5, description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn.' },
            { name: 'Fast Movement', level: 5, description: 'Your speed increases by 10 feet while you aren\'t wearing heavy armor.' },
            { name: 'Feral Instinct', level: 7, description: 'Your instincts are so honed that you have advantage on initiative rolls.' },
            { name: 'Brutal Critical', level: 9, description: 'You can roll one additional weapon damage die when determining the extra damage for a critical hit with a melee attack.' }
        ],
        subclasses: [
            {
                id: 'berserker', name: 'Path of the Berserker', description: 'For some barbarians, rage is a means to an end—that end being violence.', features: [
                    { name: 'Frenzy', level: 3, description: 'You can go into a frenzy when you rage. If you do so, for the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one.' }
                ]
            },
            {
                id: 'totem-warrior', name: 'Path of the Totem Warrior', description: 'The Path of the Totem Warrior is a spiritual journey, as the barbarian accepts a spirit animal as guide, protector, and inspiration.', features: [
                    { name: 'Spirit Seeker', level: 3, description: 'You gain the ability to cast the beast sense and speak with animals spells, but only as rituals.' },
                    { name: 'Totem Spirit', level: 3, description: 'You choose a totem spirit and gain its feature. You must make or acquire a physical totem object.' }
                ]
            }
        ],
        equipment: [
            { options: [['greataxe'], ['any martial melee weapon']] },
            { options: [['two handaxes'], ['any simple weapon']] },
            { options: [["explorer's pack", 'four javelins']] }
        ]
    },
    {
        id: 'bard',
        name: 'Bard',
        description: 'An inspiring magician whose power echoes the music of creation, weaving spells through words and music.',
        hitDie: 'd8',
        primaryAbility: ['charisma'],
        savingThrowProficiencies: ['dexterity', 'charisma'],
        armorProficiencies: ['light armor'],
        weaponProficiencies: ['simple weapons', 'hand crossbows', 'longswords', 'rapiers', 'shortswords'],
        skillChoices: ['acrobatics', 'animalHandling', 'arcana', 'athletics', 'deception', 'history', 'insight', 'intimidation', 'investigation', 'medicine', 'nature', 'perception', 'performance', 'persuasion', 'religion', 'sleightOfHand', 'stealth', 'survival'],
        numSkillChoices: 3,
        spellcasting: {
            ability: 'charisma',
            spellList: 'bard',
            cantripsKnown: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            spellsKnown: [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22],
            spellSlots: [
                [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2],
                [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1],
                [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1],
                [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1],
                [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1]
            ]
        },
        features: [
            { name: 'Spellcasting', level: 1, description: 'You have learned to cast spells through your music and oration. Charisma is your spellcasting ability for your bard spells.' },
            { name: 'Bardic Inspiration', level: 1, description: 'You can inspire others through stirring words or music. A creature that has a Bardic Inspiration die can roll that die and add the number rolled to one ability check, attack roll, or saving throw it makes.' },
            { name: 'Jack of All Trades', level: 2, description: 'You can add half your proficiency bonus, rounded down, to any ability check you make that doesn\'t already include your proficiency bonus.' },
            { name: 'Song of Rest', level: 2, description: 'You can use soothing music or oration to help revitalize your wounded allies during a short rest.' },
            { name: 'Bard College', level: 3, description: 'You choose a college that shapes your bardic abilities: College of Lore or College of Valor.' },
            { name: 'Expertise', level: 3, description: 'Choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.' },
            { name: 'Font of Inspiration', level: 5, description: 'You regain all of your expended uses of Bardic Inspiration when you finish a short or long rest.' }
        ],
        subclasses: [
            {
                id: 'lore', name: 'College of Lore', description: 'Bards of the College of Lore know something about most things, collecting bits of knowledge from sources as diverse as scholarly tomes and peasant tales.', features: [
                    { name: 'Bonus Proficiencies', level: 3, description: 'You gain proficiency with three skills of your choice.' },
                    { name: 'Cutting Words', level: 3, description: 'You can use your wit to distract, confuse, and otherwise sap the confidence and competence of others.' }
                ]
            },
            {
                id: 'valor', name: 'College of Valor', description: 'Bards of the College of Valor are daring skalds whose tales keep alive the memory of the great heroes of the past.', features: [
                    { name: 'Bonus Proficiencies', level: 3, description: 'You gain proficiency with medium armor, shields, and martial weapons.' },
                    { name: 'Combat Inspiration', level: 3, description: 'A creature that has a Bardic Inspiration die from you can roll that die and add the number rolled to a weapon damage roll it just made.' }
                ]
            }
        ],
        equipment: [
            { options: [['rapier'], ['longsword'], ['any simple weapon']] },
            { options: [["diplomat's pack"], ["entertainer's pack"]] },
            { options: [['lute'], ['any musical instrument']] },
            { options: [['leather armor', 'dagger']] }
        ]
    },
    {
        id: 'cleric',
        name: 'Cleric',
        description: 'A priestly champion who wields divine magic in service of a higher power.',
        hitDie: 'd8',
        primaryAbility: ['wisdom'],
        savingThrowProficiencies: ['wisdom', 'charisma'],
        armorProficiencies: ['light armor', 'medium armor', 'shields'],
        weaponProficiencies: ['simple weapons'],
        skillChoices: ['history', 'insight', 'medicine', 'persuasion', 'religion'],
        numSkillChoices: 2,
        spellcasting: {
            ability: 'wisdom',
            spellList: 'cleric',
            cantripsKnown: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            spellSlots: [
                [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2],
                [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1],
                [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1],
                [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1],
                [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1]
            ]
        },
        features: [
            { name: 'Spellcasting', level: 1, description: 'As a conduit for divine power, you can cast cleric spells. Wisdom is your spellcasting ability for your cleric spells.' },
            { name: 'Divine Domain', level: 1, description: 'Choose one domain related to your deity. Your choice grants you domain spells and other features.' },
            { name: 'Channel Divinity', level: 2, description: 'You gain the ability to channel divine energy directly from your deity, using that energy to fuel magical effects.' },
            { name: 'Turn Undead', level: 2, description: 'As an action, you present your holy symbol and speak a prayer censuring the undead. Each undead that can see or hear you within 30 feet must make a Wisdom saving throw.' },
            { name: 'Destroy Undead', level: 5, description: 'When an undead fails its saving throw against your Turn Undead feature, the creature is instantly destroyed if its challenge rating is at or below a certain threshold.' }
        ],
        subclasses: [
            {
                id: 'life', name: 'Life Domain', description: 'The Life domain focuses on the vibrant positive energy—one of the fundamental forces of the universe—that sustains all life.', features: [
                    { name: 'Bonus Proficiency', level: 1, description: 'You gain proficiency with heavy armor.' },
                    { name: 'Disciple of Life', level: 1, description: 'Your healing spells are more effective. Whenever you use a spell of 1st level or higher to restore hit points to a creature, the creature regains additional hit points equal to 2 + the spell\'s level.' }
                ]
            },
            {
                id: 'light', name: 'Light Domain', description: 'Gods of light promote the ideals of rebirth and renewal, truth, vigilance, and beauty.', features: [
                    { name: 'Bonus Cantrip', level: 1, description: 'You gain the light cantrip if you don\'t already know it.' },
                    { name: 'Warding Flare', level: 1, description: 'You can interpose divine light between yourself and an attacking enemy.' }
                ]
            }
        ],
        equipment: [
            { options: [['mace'], ['warhammer (if proficient)']] },
            { options: [['scale mail'], ['leather armor'], ['chain mail (if proficient)']] },
            { options: [['light crossbow and 20 bolts'], ['any simple weapon']] },
            { options: [["priest's pack"], ["explorer's pack"]] },
            { options: [['shield', 'holy symbol']] }
        ]
    },
    {
        id: 'fighter',
        name: 'Fighter',
        description: 'A master of martial combat, skilled with a variety of weapons and armor.',
        hitDie: 'd10',
        primaryAbility: ['strength', 'dexterity'],
        savingThrowProficiencies: ['strength', 'constitution'],
        armorProficiencies: ['all armor', 'shields'],
        weaponProficiencies: ['simple weapons', 'martial weapons'],
        skillChoices: ['acrobatics', 'animalHandling', 'athletics', 'history', 'insight', 'intimidation', 'perception', 'survival'],
        numSkillChoices: 2,
        features: [
            { name: 'Fighting Style', level: 1, description: 'You adopt a particular style of fighting as your specialty. Choose one of the following options: Archery, Defense, Dueling, Great Weapon Fighting, Protection, or Two-Weapon Fighting.' },
            { name: 'Second Wind', level: 1, description: 'You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level.' },
            { name: 'Action Surge', level: 2, description: 'You can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action.' },
            { name: 'Martial Archetype', level: 3, description: 'You choose an archetype that you strive to emulate in your combat styles and techniques: Champion, Battle Master, or Eldritch Knight.' },
            { name: 'Extra Attack', level: 5, description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn. The number of attacks increases to three when you reach 11th level and to four when you reach 20th level.' },
            { name: 'Indomitable', level: 9, description: 'You can reroll a saving throw that you fail. If you do so, you must use the new roll.' }
        ],
        subclasses: [
            {
                id: 'champion', name: 'Champion', description: 'The archetypal Champion focuses on the development of raw physical power honed to deadly perfection.', features: [
                    { name: 'Improved Critical', level: 3, description: 'Your weapon attacks score a critical hit on a roll of 19 or 20.' }
                ]
            },
            {
                id: 'battle-master', name: 'Battle Master', description: 'Those who emulate the archetypal Battle Master employ martial techniques passed down through generations.', features: [
                    { name: 'Combat Superiority', level: 3, description: 'You learn maneuvers that are fueled by special dice called superiority dice.' },
                    { name: 'Student of War', level: 3, description: 'You gain proficiency with one type of artisan\'s tools of your choice.' }
                ]
            }
        ],
        equipment: [
            { options: [['chain mail'], ['leather armor', 'longbow', '20 arrows']] },
            { options: [['martial weapon', 'shield'], ['two martial weapons']] },
            { options: [['light crossbow and 20 bolts'], ['two handaxes']] },
            { options: [["dungeoneer's pack"], ["explorer's pack"]] }
        ]
    },
    {
        id: 'rogue',
        name: 'Rogue',
        description: 'A scoundrel who uses stealth and trickery to overcome obstacles and enemies.',
        hitDie: 'd8',
        primaryAbility: ['dexterity'],
        savingThrowProficiencies: ['dexterity', 'intelligence'],
        armorProficiencies: ['light armor'],
        weaponProficiencies: ['simple weapons', 'hand crossbows', 'longswords', 'rapiers', 'shortswords'],
        skillChoices: ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'performance', 'persuasion', 'sleightOfHand', 'stealth'],
        numSkillChoices: 4,
        features: [
            { name: 'Expertise', level: 1, description: 'Choose two of your skill proficiencies, or one of your skill proficiencies and your proficiency with thieves\' tools. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.' },
            { name: 'Sneak Attack', level: 1, description: 'You know how to strike subtly and exploit a foe\'s distraction. Once per turn, you can deal extra damage to one creature you hit with an attack if you have advantage on the attack roll.' },
            { name: 'Thieves\' Cant', level: 1, description: 'You have learned thieves\' cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation.' },
            { name: 'Cunning Action', level: 2, description: 'You can take a bonus action on each of your turns in combat to take the Dash, Disengage, or Hide action.' },
            { name: 'Roguish Archetype', level: 3, description: 'You choose an archetype that you emulate in the exercise of your rogue abilities: Thief, Assassin, or Arcane Trickster.' },
            { name: 'Uncanny Dodge', level: 5, description: 'When an attacker that you can see hits you with an attack, you can use your reaction to halve the attack\'s damage against you.' },
            { name: 'Evasion', level: 7, description: 'When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.' }
        ],
        subclasses: [
            {
                id: 'thief', name: 'Thief', description: 'You hone your skills in the larcenous arts. Burglars, bandits, cutpurses, and other criminals typically follow this archetype.', features: [
                    { name: 'Fast Hands', level: 3, description: 'You can use the bonus action granted by your Cunning Action to make a Dexterity (Sleight of Hand) check, use your thieves\' tools to disarm a trap or open a lock, or take the Use an Object action.' },
                    { name: 'Second-Story Work', level: 3, description: 'You gain the ability to climb faster than normal; climbing no longer costs you extra movement. In addition, when you make a running jump, the distance you cover increases by a number of feet equal to your Dexterity modifier.' }
                ]
            },
            {
                id: 'assassin', name: 'Assassin', description: 'You focus your training on the grim art of death.', features: [
                    { name: 'Bonus Proficiencies', level: 3, description: 'You gain proficiency with the disguise kit and the poisoner\'s kit.' },
                    { name: 'Assassinate', level: 3, description: 'You have advantage on attack rolls against any creature that hasn\'t taken a turn in the combat yet. In addition, any hit you score against a creature that is surprised is a critical hit.' }
                ]
            }
        ],
        equipment: [
            { options: [['rapier'], ['shortsword']] },
            { options: [['shortbow and quiver of 20 arrows'], ['shortsword']] },
            { options: [["burglar's pack"], ["dungeoneer's pack"], ["explorer's pack"]] },
            { options: [['leather armor', 'two daggers', "thieves' tools"]] }
        ]
    },
    {
        id: 'wizard',
        name: 'Wizard',
        description: 'A scholarly magic-user capable of manipulating the structures of reality through careful study and practice.',
        hitDie: 'd6',
        primaryAbility: ['intelligence'],
        savingThrowProficiencies: ['intelligence', 'wisdom'],
        armorProficiencies: [],
        weaponProficiencies: ['daggers', 'darts', 'slings', 'quarterstaffs', 'light crossbows'],
        skillChoices: ['arcana', 'history', 'insight', 'investigation', 'medicine', 'religion'],
        numSkillChoices: 2,
        spellcasting: {
            ability: 'intelligence',
            spellList: 'wizard',
            cantripsKnown: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            spellSlots: [
                [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2],
                [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1],
                [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1],
                [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1],
                [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1]
            ]
        },
        features: [
            { name: 'Spellcasting', level: 1, description: 'As a student of arcane magic, you have a spellbook containing spells that show the first glimmerings of your true power. Intelligence is your spellcasting ability for your wizard spells.' },
            { name: 'Arcane Recovery', level: 1, description: 'You have learned to regain some of your magical energy by studying your spellbook. Once per day when you finish a short rest, you can choose expended spell slots to recover.' },
            { name: 'Arcane Tradition', level: 2, description: 'You choose an arcane tradition, shaping your practice of magic through one of eight schools: Abjuration, Conjuration, Divination, Enchantment, Evocation, Illusion, Necromancy, or Transmutation.' },
            { name: 'Spell Mastery', level: 18, description: 'You have achieved such mastery over certain spells that you can cast them at will. Choose a 1st-level wizard spell and a 2nd-level wizard spell that are in your spellbook.' }
        ],
        subclasses: [
            {
                id: 'evocation', name: 'School of Evocation', description: 'You focus your study on magic that creates powerful elemental effects such as bitter cold, searing flame, rolling thunder, crackling lightning, and burning acid.', features: [
                    { name: 'Evocation Savant', level: 2, description: 'The gold and time you must spend to copy an evocation spell into your spellbook is halved.' },
                    { name: 'Sculpt Spells', level: 2, description: 'You can create pockets of relative safety within the effects of your evocation spells.' }
                ]
            },
            {
                id: 'abjuration', name: 'School of Abjuration', description: 'The School of Abjuration emphasizes magic that blocks, banishes, or protects.', features: [
                    { name: 'Abjuration Savant', level: 2, description: 'The gold and time you must spend to copy an abjuration spell into your spellbook is halved.' },
                    { name: 'Arcane Ward', level: 2, description: 'You can weave magic around yourself for protection. When you cast an abjuration spell of 1st level or higher, you can simultaneously use a strand of the spell\'s magic to create a magical ward on yourself.' }
                ]
            }
        ],
        equipment: [
            { options: [['quarterstaff'], ['dagger']] },
            { options: [['component pouch'], ['arcane focus']] },
            { options: [["scholar's pack"], ["explorer's pack"]] },
            { options: [['spellbook']] }
        ]
    }
];

export function getClassById(id: string): Class | undefined {
    return classes.find(c => c.id === id);
}

export function getSubclassById(classId: string, subclassId: string) {
    const cls = getClassById(classId);
    return cls?.subclasses.find(s => s.id === subclassId);
}

export function calculateProficiencyBonus(level: number): number {
    return Math.ceil(level / 4) + 1;
}

export function getHitDieMax(hitDie: string): number {
    return parseInt(hitDie.replace('d', ''));
}
