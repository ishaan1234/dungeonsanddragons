'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User, Heart, Shield, Zap, Sword, Scroll,
    Backpack, Sparkles, Edit, Save, X, ChevronDown, ChevronUp
} from 'lucide-react';
import { Character, AbilityScores, Skill } from '@/types';
import styles from './CharacterSheet.module.css';

const abilityNames: (keyof AbilityScores)[] = [
    'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'
];

const skillsByAbility: Record<keyof AbilityScores, Skill[]> = {
    strength: ['athletics'],
    dexterity: ['acrobatics', 'sleightOfHand', 'stealth'],
    constitution: [],
    intelligence: ['arcana', 'history', 'investigation', 'nature', 'religion'],
    wisdom: ['animalHandling', 'insight', 'medicine', 'perception', 'survival'],
    charisma: ['deception', 'intimidation', 'performance', 'persuasion'],
};

const skillNames: Record<Skill, string> = {
    acrobatics: 'Acrobatics',
    animalHandling: 'Animal Handling',
    arcana: 'Arcana',
    athletics: 'Athletics',
    deception: 'Deception',
    history: 'History',
    insight: 'Insight',
    intimidation: 'Intimidation',
    investigation: 'Investigation',
    medicine: 'Medicine',
    nature: 'Nature',
    perception: 'Perception',
    performance: 'Performance',
    persuasion: 'Persuasion',
    religion: 'Religion',
    sleightOfHand: 'Sleight of Hand',
    stealth: 'Stealth',
    survival: 'Survival',
};

interface CharacterSheetProps {
    character: Character;
    onUpdate?: (character: Character) => void;
    isEditable?: boolean;
}

export default function CharacterSheet({ character, onUpdate, isEditable = false }: CharacterSheetProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedCharacter, setEditedCharacter] = useState(character);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['core', 'abilities', 'combat']));

    const getModifier = (score: number) => Math.floor((score - 10) / 2);
    const formatModifier = (mod: number) => (mod >= 0 ? `+${mod}` : mod.toString());

    const toggleSection = (section: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(section)) {
                next.delete(section);
            } else {
                next.add(section);
            }
            return next;
        });
    };

    const handleSave = () => {
        if (onUpdate) {
            onUpdate(editedCharacter);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedCharacter(character);
        setIsEditing(false);
    };

    const updateHP = (delta: number) => {
        const newHP = Math.max(0, Math.min(
            editedCharacter.maxHitPoints + (editedCharacter.temporaryHitPoints || 0),
            editedCharacter.currentHitPoints + delta
        ));
        setEditedCharacter({ ...editedCharacter, currentHitPoints: newHP });
    };

    const hpPercent = (character.currentHitPoints / character.maxHitPoints) * 100;

    return (
        <div className={styles.sheet}>
            {/* Header */}
            <div className={styles.sheetHeader}>
                <div className={styles.characterIdentity}>
                    <div className={styles.avatar}>
                        {character.name.charAt(0)}
                    </div>
                    <div className={styles.nameBlock}>
                        <h1>{character.name}</h1>
                        <p>
                            Level {character.level} {character.race} {character.class}
                            {character.subclass && ` (${character.subclass})`}
                        </p>
                    </div>
                </div>

                {isEditable && (
                    <div className={styles.headerActions}>
                        {isEditing ? (
                            <>
                                <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
                                    <X size={16} /> Cancel
                                </button>
                                <button className="btn btn-gold btn-sm" onClick={handleSave}>
                                    <Save size={16} /> Save
                                </button>
                            </>
                        ) : (
                            <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(true)}>
                                <Edit size={16} /> Edit
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Core Stats Bar */}
            <div className={styles.coreStats}>
                <div className={styles.coreStat}>
                    <Shield size={20} />
                    <div>
                        <span className={styles.coreValue}>{character.armorClass}</span>
                        <span className={styles.coreLabel}>AC</span>
                    </div>
                </div>
                <div className={`${styles.coreStat} ${styles.hpStat}`}>
                    <Heart size={20} />
                    <div className={styles.hpDisplay}>
                        <div className={styles.hpNumbers}>
                            {isEditing ? (
                                <div className={styles.hpControls}>
                                    <button onClick={() => updateHP(-1)}>-</button>
                                    <span>{editedCharacter.currentHitPoints}/{character.maxHitPoints}</span>
                                    <button onClick={() => updateHP(1)}>+</button>
                                </div>
                            ) : (
                                <span className={styles.coreValue}>
                                    {character.currentHitPoints}/{character.maxHitPoints}
                                </span>
                            )}
                            <span className={styles.coreLabel}>HP</span>
                        </div>
                        <div className={styles.hpBarLarge}>
                            <div
                                className={styles.hpFill}
                                style={{
                                    width: `${hpPercent}%`,
                                    background: hpPercent > 50 ? 'var(--success)' : hpPercent > 25 ? 'var(--warning)' : 'var(--danger)'
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.coreStat}>
                    <Zap size={20} />
                    <div>
                        <span className={styles.coreValue}>{character.speed}</span>
                        <span className={styles.coreLabel}>Speed</span>
                    </div>
                </div>
                <div className={styles.coreStat}>
                    <Sword size={20} />
                    <div>
                        <span className={styles.coreValue}>
                            {formatModifier(getModifier(character.abilityScores.dexterity) + character.proficiencyBonus)}
                        </span>
                        <span className={styles.coreLabel}>Initiative</span>
                    </div>
                </div>
            </div>

            {/* Ability Scores */}
            <section className={styles.section}>
                <button
                    className={styles.sectionHeader}
                    onClick={() => toggleSection('abilities')}
                >
                    <h2>Ability Scores</h2>
                    {expandedSections.has('abilities') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.has('abilities') && (
                    <motion.div
                        className={styles.abilitiesGrid}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                    >
                        {abilityNames.map(ability => {
                            const score = character.abilityScores[ability];
                            const mod = getModifier(score);
                            const isProficient = character.savingThrowProficiencies.includes(ability);
                            const saveMod = mod + (isProficient ? character.proficiencyBonus : 0);

                            return (
                                <div key={ability} className={styles.abilityCard}>
                                    <span className={styles.abilityName}>{ability.slice(0, 3).toUpperCase()}</span>
                                    <span className={styles.abilityMod}>{formatModifier(mod)}</span>
                                    <span className={styles.abilityScore}>{score}</span>
                                    <span className={`${styles.savingThrow} ${isProficient ? styles.proficient : ''}`}>
                                        Save: {formatModifier(saveMod)}
                                    </span>
                                </div>
                            );
                        })}
                    </motion.div>
                )}
            </section>

            {/* Skills */}
            <section className={styles.section}>
                <button
                    className={styles.sectionHeader}
                    onClick={() => toggleSection('skills')}
                >
                    <h2>Skills</h2>
                    {expandedSections.has('skills') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.has('skills') && (
                    <motion.div
                        className={styles.skillsList}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                    >
                        {abilityNames.map(ability => (
                            skillsByAbility[ability].map(skill => {
                                const isProficient = character.skillProficiencies?.includes(skill) || false;
                                const mod = getModifier(character.abilityScores[ability]) +
                                    (isProficient ? character.proficiencyBonus : 0);

                                return (
                                    <div
                                        key={skill}
                                        className={`${styles.skillRow} ${isProficient ? styles.proficient : ''}`}
                                    >
                                        <span className={styles.proficiencyDot} />
                                        <span className={styles.skillName}>{skillNames[skill]}</span>
                                        <span className={styles.skillAbility}>({ability.slice(0, 3)})</span>
                                        <span className={styles.skillMod}>{formatModifier(mod)}</span>
                                    </div>
                                );
                            })
                        ))}
                    </motion.div>
                )}
            </section>

            {/* Features & Traits */}
            <section className={styles.section}>
                <button
                    className={styles.sectionHeader}
                    onClick={() => toggleSection('features')}
                >
                    <h2><Sparkles size={18} /> Features & Traits</h2>
                    {expandedSections.has('features') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.has('features') && (
                    <motion.div
                        className={styles.featuresList}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                    >
                        {character.features?.map((feature, i) => (
                            <div key={i} className={styles.featureCard}>
                                <h4>{feature.name}</h4>
                                <p>{feature.description}</p>
                                {feature.source && (
                                    <span className={styles.featureSource}>{feature.source}</span>
                                )}
                            </div>
                        )) || <p className={styles.emptyText}>No features yet</p>}
                    </motion.div>
                )}
            </section>

            {/* Equipment */}
            <section className={styles.section}>
                <button
                    className={styles.sectionHeader}
                    onClick={() => toggleSection('equipment')}
                >
                    <h2><Backpack size={18} /> Equipment</h2>
                    {expandedSections.has('equipment') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.has('equipment') && (
                    <motion.div
                        className={styles.equipmentList}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                    >
                        {character.equipment?.map((item, i) => (
                            <div key={i} className={styles.equipmentItem}>
                                <span>{item.name}</span>
                                {item.quantity > 1 && <span className={styles.quantity}>×{item.quantity}</span>}
                            </div>
                        )) || <p className={styles.emptyText}>No equipment</p>}
                    </motion.div>
                )}
            </section>

            {/* Spells (if spellcaster) */}
            {character.spellcastingAbility && (
                <section className={styles.section}>
                    <button
                        className={styles.sectionHeader}
                        onClick={() => toggleSection('spells')}
                    >
                        <h2><Scroll size={18} /> Spellcasting</h2>
                        {expandedSections.has('spells') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {expandedSections.has('spells') && (
                        <motion.div
                            className={styles.spellcastingInfo}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                        >
                            <div className={styles.spellStats}>
                                <div className={styles.spellStat}>
                                    <span className={styles.spellValue}>
                                        {8 + character.proficiencyBonus + getModifier(character.abilityScores[character.spellcastingAbility])}
                                    </span>
                                    <span className={styles.spellLabel}>Spell Save DC</span>
                                </div>
                                <div className={styles.spellStat}>
                                    <span className={styles.spellValue}>
                                        {formatModifier(character.proficiencyBonus + getModifier(character.abilityScores[character.spellcastingAbility]))}
                                    </span>
                                    <span className={styles.spellLabel}>Spell Attack</span>
                                </div>
                                <div className={styles.spellStat}>
                                    <span className={styles.spellValue}>{character.spellcastingAbility.slice(0, 3).toUpperCase()}</span>
                                    <span className={styles.spellLabel}>Ability</span>
                                </div>
                            </div>

                            <h4>Known Spells</h4>
                            <div className={styles.spellList}>
                                {character.spellsKnown?.length ? (
                                    character.spellsKnown.map((spell, i) => (
                                        <span key={i} className={styles.spellTag}>{spell}</span>
                                    ))
                                ) : (
                                    <p className={styles.emptyText}>No spells known</p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </section>
            )}

            {/* Background & Notes */}
            <section className={styles.section}>
                <button
                    className={styles.sectionHeader}
                    onClick={() => toggleSection('background')}
                >
                    <h2><User size={18} /> Background & Notes</h2>
                    {expandedSections.has('background') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.has('background') && (
                    <motion.div
                        className={styles.backgroundInfo}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                    >
                        <div className={styles.backgroundField}>
                            <label>Background</label>
                            <p>{character.background || 'Not specified'}</p>
                        </div>
                        <div className={styles.backgroundField}>
                            <label>Alignment</label>
                            <p>{character.alignment || 'Not specified'}</p>
                        </div>
                        {character.backstory && (
                            <div className={styles.backgroundField}>
                                <label>Backstory</label>
                                <p>{character.backstory}</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </section>
        </div>
    );
}
