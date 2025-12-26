'use client';

import { motion } from 'framer-motion';
import {
    X, Shield, Heart, Zap, Brain, Eye, Footprints,
    Sparkles, Check, User, Coins
} from 'lucide-react';
import { Character, AbilityScore, Skill } from '@/types';
import styles from './CharacterSheetPanel.module.css';

interface CharacterSheetPanelProps {
    character: Character;
    onClose: () => void;
}

const ABILITY_LABELS: Record<AbilityScore, { label: string; abbr: string }> = {
    strength: { label: 'Strength', abbr: 'STR' },
    dexterity: { label: 'Dexterity', abbr: 'DEX' },
    constitution: { label: 'Constitution', abbr: 'CON' },
    intelligence: { label: 'Intelligence', abbr: 'INT' },
    wisdom: { label: 'Wisdom', abbr: 'WIS' },
    charisma: { label: 'Charisma', abbr: 'CHA' },
};

const SKILL_ABILITY_MAP: Record<Skill, AbilityScore> = {
    acrobatics: 'dexterity',
    animalHandling: 'wisdom',
    arcana: 'intelligence',
    athletics: 'strength',
    deception: 'charisma',
    history: 'intelligence',
    insight: 'wisdom',
    intimidation: 'charisma',
    investigation: 'intelligence',
    medicine: 'wisdom',
    nature: 'intelligence',
    perception: 'wisdom',
    performance: 'charisma',
    persuasion: 'charisma',
    religion: 'intelligence',
    sleightOfHand: 'dexterity',
    stealth: 'dexterity',
    survival: 'wisdom',
};

const SKILL_LABELS: Record<Skill, string> = {
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

function getModifier(score: number): number {
    return Math.floor((score - 10) / 2);
}

function formatModifier(mod: number): string {
    return mod >= 0 ? `+${mod}` : `${mod}`;
}

export default function CharacterSheetPanel({ character, onClose }: CharacterSheetPanelProps) {
    const hpPercent = Math.max(0, Math.min(100, (character.currentHitPoints / character.maxHitPoints) * 100));

    const getHpColor = () => {
        if (hpPercent > 50) return 'var(--success)';
        if (hpPercent > 25) return 'var(--warning)';
        return 'var(--danger)';
    };

    const hasSpellcasting = character.spellSlots && character.spellcastingAbility;

    return (
        <>
            {/* Backdrop */}
            <motion.div
                className={styles.backdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />

            {/* Panel */}
            <motion.div
                className={styles.panel}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerInfo}>
                        <div className={styles.avatar}>
                            {character.portrait ? (
                                <img src={character.portrait} alt={character.name} />
                            ) : (
                                <User size={24} />
                            )}
                        </div>
                        <div>
                            <h2>{character.name}</h2>
                            <p className={styles.subtitle}>
                                {character.race} {character.class} - Level {character.level}
                            </p>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    {/* HP Section */}
                    <section className={styles.section}>
                        <h3><Heart size={16} /> Hit Points</h3>
                        <div className={styles.hpDisplay}>
                            <div className={styles.hpNumbers}>
                                <span className={styles.currentHp}>{character.currentHitPoints}</span>
                                <span className={styles.hpDivider}>/</span>
                                <span className={styles.maxHp}>{character.maxHitPoints}</span>
                                {character.temporaryHitPoints > 0 && (
                                    <span className={styles.tempHp}>+{character.temporaryHitPoints} temp</span>
                                )}
                            </div>
                            <div className={styles.hpBar}>
                                <div
                                    className={styles.hpFill}
                                    style={{ width: `${hpPercent}%`, background: getHpColor() }}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Combat Stats */}
                    <section className={styles.section}>
                        <div className={styles.combatStats}>
                            <div className={styles.combatStat}>
                                <Shield size={18} />
                                <span className={styles.statValue}>{character.armorClass}</span>
                                <span className={styles.statLabel}>AC</span>
                            </div>
                            <div className={styles.combatStat}>
                                <Zap size={18} />
                                <span className={styles.statValue}>{formatModifier(character.initiative)}</span>
                                <span className={styles.statLabel}>Initiative</span>
                            </div>
                            <div className={styles.combatStat}>
                                <Footprints size={18} />
                                <span className={styles.statValue}>{character.speed}</span>
                                <span className={styles.statLabel}>Speed</span>
                            </div>
                            <div className={styles.combatStat}>
                                <Brain size={18} />
                                <span className={styles.statValue}>{formatModifier(character.proficiencyBonus)}</span>
                                <span className={styles.statLabel}>Prof</span>
                            </div>
                        </div>
                    </section>

                    {/* Ability Scores */}
                    <section className={styles.section}>
                        <h3><Eye size={16} /> Ability Scores</h3>
                        <div className={styles.abilityGrid}>
                            {(Object.keys(ABILITY_LABELS) as AbilityScore[]).map((ability) => {
                                const score = character.abilityScores[ability];
                                const modifier = getModifier(score);
                                return (
                                    <div key={ability} className={styles.abilityCard}>
                                        <span className={styles.abilityAbbr}>{ABILITY_LABELS[ability].abbr}</span>
                                        <span className={styles.abilityMod}>{formatModifier(modifier)}</span>
                                        <span className={styles.abilityScore}>{score}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Saving Throws */}
                    <section className={styles.section}>
                        <h3><Shield size={16} /> Saving Throws</h3>
                        <div className={styles.savingThrows}>
                            {(Object.keys(ABILITY_LABELS) as AbilityScore[]).map((ability) => {
                                const isProficient = character.savingThrowProficiencies.includes(ability);
                                const modifier = getModifier(character.abilityScores[ability]);
                                const bonus = isProficient ? modifier + character.proficiencyBonus : modifier;
                                return (
                                    <div key={ability} className={styles.saveRow}>
                                        <span className={`${styles.profDot} ${isProficient ? styles.proficient : ''}`}>
                                            {isProficient && <Check size={10} />}
                                        </span>
                                        <span className={styles.saveName}>{ABILITY_LABELS[ability].abbr}</span>
                                        <span className={styles.saveBonus}>{formatModifier(bonus)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Skills */}
                    <section className={styles.section}>
                        <h3><Brain size={16} /> Skills</h3>
                        <div className={styles.skillsList}>
                            {(Object.keys(SKILL_LABELS) as Skill[]).map((skill) => {
                                const isProficient = character.skillProficiencies.includes(skill);
                                const ability = SKILL_ABILITY_MAP[skill];
                                const modifier = getModifier(character.abilityScores[ability]);
                                const bonus = isProficient ? modifier + character.proficiencyBonus : modifier;
                                return (
                                    <div key={skill} className={styles.skillRow}>
                                        <span className={`${styles.profDot} ${isProficient ? styles.proficient : ''}`}>
                                            {isProficient && <Check size={10} />}
                                        </span>
                                        <span className={styles.skillName}>{SKILL_LABELS[skill]}</span>
                                        <span className={styles.skillAbility}>({ABILITY_LABELS[ability].abbr})</span>
                                        <span className={styles.skillBonus}>{formatModifier(bonus)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Spell Slots */}
                    {hasSpellcasting && character.spellSlots && (
                        <section className={styles.section}>
                            <h3><Sparkles size={16} /> Spell Slots</h3>
                            <div className={styles.spellSlots}>
                                {([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map((level) => {
                                    const slot = character.spellSlots![level];
                                    if (!slot || slot.max === 0) return null;
                                    const available = slot.max - slot.used;
                                    return (
                                        <div key={level} className={styles.slotRow}>
                                            <span className={styles.slotLevel}>Level {level}</span>
                                            <div className={styles.slotPips}>
                                                {Array.from({ length: slot.max }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`${styles.slotPip} ${i < available ? styles.available : styles.used}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className={styles.slotCount}>{available}/{slot.max}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Currency */}
                    {character.currency && (
                        <section className={styles.section}>
                            <h3><Coins size={16} /> Currency</h3>
                            <div className={styles.currencyGrid}>
                                <div className={styles.currencyItem}>
                                    <span className={styles.currencyValue}>{character.currency.platinum}</span>
                                    <span className={styles.currencyLabel}>PP</span>
                                </div>
                                <div className={styles.currencyItem}>
                                    <span className={styles.currencyValue}>{character.currency.gold}</span>
                                    <span className={styles.currencyLabel}>GP</span>
                                </div>
                                <div className={styles.currencyItem}>
                                    <span className={styles.currencyValue}>{character.currency.electrum}</span>
                                    <span className={styles.currencyLabel}>EP</span>
                                </div>
                                <div className={styles.currencyItem}>
                                    <span className={styles.currencyValue}>{character.currency.silver}</span>
                                    <span className={styles.currencyLabel}>SP</span>
                                </div>
                                <div className={styles.currencyItem}>
                                    <span className={styles.currencyValue}>{character.currency.copper}</span>
                                    <span className={styles.currencyLabel}>CP</span>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </motion.div>
        </>
    );
}
