'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Target, Heart, Shield, Skull,
    Zap, X, ChevronDown, Dice6
} from 'lucide-react';
import { Spell, AbilityScore } from '@/types';
import { spells, getSpellsByClass, getSpellsByLevel } from '@/data/spells';
import { ActiveEffect, EFFECT_TEMPLATES, calculateHealing, createEffect, generateEffectId } from '@/lib/effects';
import { executeRoll } from '@/lib/dice';
import styles from './SpellCaster.module.css';

interface SpellCasterProps {
    characterName: string;
    characterClass: string;
    spellcastingAbility: AbilityScore;
    spellcastingModifier: number;
    proficiencyBonus: number;
    spellsKnown?: string[];
    preparedSpells?: string[];
    targets: { id: string; name: string; type: 'ally' | 'enemy' | 'self' }[];
    onCastSpell: (result: SpellCastResult) => void;
    onClose: () => void;
}

export interface SpellCastResult {
    spell: Spell;
    casterName: string;
    targetIds: string[];
    targetNames: string[];
    spellLevel: number;
    effects?: ActiveEffect[];
    healing?: { total: number; dice: number[]; formula: string };
    damage?: { total: number; dice: number[]; formula: string; type: string };
    saveDC?: number;
    attackRoll?: { total: number; dice: number[]; isHit?: boolean };
    description: string;
}

export default function SpellCaster({
    characterName,
    characterClass,
    spellcastingAbility,
    spellcastingModifier,
    proficiencyBonus,
    spellsKnown,
    preparedSpells,
    targets,
    onCastSpell,
    onClose,
}: SpellCasterProps) {
    const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
    const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
    const [spellSlotLevel, setSpellSlotLevel] = useState(1);
    const [filterLevel, setFilterLevel] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCasting, setIsCasting] = useState(false);

    const spellSaveDC = 8 + proficiencyBonus + spellcastingModifier;
    const spellAttackBonus = proficiencyBonus + spellcastingModifier;

    // Get available spells for this class
    const availableSpells = useMemo(() => {
        let result = getSpellsByClass(characterClass.toLowerCase());

        // Filter to known/prepared spells if provided
        if (preparedSpells && preparedSpells.length > 0) {
            result = result.filter(s => preparedSpells.includes(s.id));
        } else if (spellsKnown && spellsKnown.length > 0) {
            result = result.filter(s => spellsKnown.includes(s.id));
        }

        // Apply filters
        if (filterLevel !== null) {
            result = result.filter(s => s.level === filterLevel);
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(s =>
                s.name.toLowerCase().includes(query) ||
                s.description.toLowerCase().includes(query)
            );
        }

        return result.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
    }, [characterClass, spellsKnown, preparedSpells, filterLevel, searchQuery]);

    const toggleTarget = (targetId: string) => {
        setSelectedTargets(prev =>
            prev.includes(targetId)
                ? prev.filter(id => id !== targetId)
                : [...prev, targetId]
        );
    };

    const castSpell = async () => {
        if (!selectedSpell || selectedTargets.length === 0) return;

        setIsCasting(true);

        const targetNames = selectedTargets.map(id =>
            targets.find(t => t.id === id)?.name || 'Unknown'
        );

        const result: SpellCastResult = {
            spell: selectedSpell,
            casterName: characterName,
            targetIds: selectedTargets,
            targetNames,
            spellLevel: Math.max(selectedSpell.level, spellSlotLevel),
            description: '',
        };

        // Calculate effects based on spell type
        const effectiveLevel = Math.max(selectedSpell.level, spellSlotLevel);

        // Healing spells
        if (selectedSpell.healing) {
            const healCalc = calculateHealing(selectedSpell.id, effectiveLevel, spellcastingModifier);
            const roll = executeRoll(healCalc.formula, characterName, `Healing from ${selectedSpell.name}`);
            result.healing = {
                total: roll.total,
                dice: roll.dice.map(d => d.result),
                formula: healCalc.formula,
            };
            result.description = `${characterName} casts ${selectedSpell.name} on ${targetNames.join(', ')}, healing for ${roll.total} HP!`;
        }

        // Damage spells
        else if (selectedSpell.damage) {
            let damageFormula = selectedSpell.damage.dice;

            // Scale damage with spell level for some spells
            if (selectedSpell.higherLevels && effectiveLevel > selectedSpell.level) {
                // Simple scaling: add 1 die per level above base
                const extraDice = effectiveLevel - selectedSpell.level;
                const dieMatch = damageFormula.match(/(\d+)(d\d+)/);
                if (dieMatch) {
                    const newCount = parseInt(dieMatch[1]) + extraDice;
                    damageFormula = `${newCount}${dieMatch[2]}`;
                }
            }

            const roll = executeRoll(damageFormula, characterName, `Damage from ${selectedSpell.name}`);
            result.damage = {
                total: roll.total,
                dice: roll.dice.map(d => d.result),
                formula: damageFormula,
                type: selectedSpell.damage.type,
            };

            if (selectedSpell.savingThrow) {
                result.saveDC = spellSaveDC;
                result.description = `${characterName} casts ${selectedSpell.name}! DC ${spellSaveDC} ${selectedSpell.savingThrow.toUpperCase()} save for ${roll.total} ${selectedSpell.damage.type} damage.`;
            } else {
                result.description = `${characterName} casts ${selectedSpell.name} on ${targetNames.join(', ')} for ${roll.total} ${selectedSpell.damage.type} damage!`;
            }
        }

        // Buff/Debuff spells - create effects
        else {
            const templateId = selectedSpell.id;
            const template = EFFECT_TEMPLATES[templateId];

            if (template) {
                result.effects = selectedTargets.map(targetId =>
                    createEffect(
                        templateId,
                        'caster_id', // Would be actual caster's character ID
                        characterName,
                        targetId,
                        { concentratorId: selectedSpell.concentration ? 'caster_id' : undefined }
                    )
                );
                result.description = `${characterName} casts ${selectedSpell.name} on ${targetNames.join(', ')}!`;
            } else {
                // Generic buff/debuff
                result.effects = selectedTargets.map(targetId => ({
                    id: generateEffectId(),
                    name: selectedSpell.name,
                    type: 'buff' as const,
                    source: characterName,
                    targetId,
                    description: selectedSpell.description,
                    durationRounds: 10,
                    concentration: selectedSpell.concentration,
                    appliedAt: Date.now(),
                }));
                result.description = `${characterName} casts ${selectedSpell.name} on ${targetNames.join(', ')}!`;
            }
        }

        // Add save DC for spells that require it
        if (selectedSpell.savingThrow) {
            result.saveDC = spellSaveDC;
        }

        // Simulate casting time
        await new Promise(resolve => setTimeout(resolve, 800));

        setIsCasting(false);
        onCastSpell(result);
    };

    const getSpellTypeIcon = (spell: Spell) => {
        if (spell.healing) return <Heart size={14} className={styles.healIcon} />;
        if (spell.damage) return <Zap size={14} className={styles.damageIcon} />;
        return <Sparkles size={14} className={styles.buffIcon} />;
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <motion.div
                className={styles.spellCaster}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <h2><Sparkles size={20} /> Cast Spell</h2>
                    <div className={styles.casterInfo}>
                        <span>{characterName}</span>
                        <span className={styles.statBadge}>Save DC: {spellSaveDC}</span>
                        <span className={styles.statBadge}>Atk: +{spellAttackBonus}</span>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.content}>
                    {/* Spell List */}
                    <div className={styles.spellListSection}>
                        <div className={styles.spellFilters}>
                            <input
                                type="text"
                                placeholder="Search spells..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <select
                                value={filterLevel ?? ''}
                                onChange={(e) => setFilterLevel(e.target.value ? parseInt(e.target.value) : null)}
                            >
                                <option value="">All Levels</option>
                                <option value="0">Cantrips</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(l => (
                                    <option key={l} value={l}>Level {l}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.spellList}>
                            {availableSpells.length === 0 ? (
                                <p className={styles.noSpells}>No spells available</p>
                            ) : (
                                availableSpells.map(spell => (
                                    <button
                                        key={spell.id}
                                        className={`${styles.spellItem} ${selectedSpell?.id === spell.id ? styles.selected : ''}`}
                                        onClick={() => {
                                            setSelectedSpell(spell);
                                            setSpellSlotLevel(Math.max(1, spell.level));
                                        }}
                                    >
                                        <div className={styles.spellIcon}>{getSpellTypeIcon(spell)}</div>
                                        <div className={styles.spellInfo}>
                                            <span className={styles.spellName}>{spell.name}</span>
                                            <span className={styles.spellMeta}>
                                                {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`} • {spell.school}
                                            </span>
                                        </div>
                                        {spell.concentration && <span className={styles.concBadge}>C</span>}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Spell Details & Targeting */}
                    <div className={styles.castingSection}>
                        {selectedSpell ? (
                            <>
                                <div className={styles.selectedSpell}>
                                    <h3>{selectedSpell.name}</h3>
                                    <p className={styles.spellDesc}>{selectedSpell.description}</p>

                                    <div className={styles.spellStats}>
                                        <span>📍 {selectedSpell.range}</span>
                                        <span>⏱️ {selectedSpell.castingTime}</span>
                                        <span>⏳ {selectedSpell.duration}</span>
                                    </div>

                                    {selectedSpell.damage && (
                                        <div className={styles.damageInfo}>
                                            <Zap size={14} />
                                            <span>{selectedSpell.damage.dice} {selectedSpell.damage.type} damage</span>
                                        </div>
                                    )}

                                    {selectedSpell.healing && (
                                        <div className={styles.healInfo}>
                                            <Heart size={14} />
                                            <span>{selectedSpell.healing} + {spellcastingModifier} healing</span>
                                        </div>
                                    )}

                                    {selectedSpell.level > 0 && (
                                        <div className={styles.slotSelector}>
                                            <label>Cast at level:</label>
                                            <select
                                                value={spellSlotLevel}
                                                onChange={(e) => setSpellSlotLevel(parseInt(e.target.value))}
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9]
                                                    .filter(l => l >= selectedSpell.level)
                                                    .map(l => (
                                                        <option key={l} value={l}>Level {l}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Target Selection */}
                                <div className={styles.targetSection}>
                                    <h4><Target size={16} /> Select Target(s)</h4>
                                    <div className={styles.targetList}>
                                        {targets.map(target => (
                                            <button
                                                key={target.id}
                                                className={`${styles.targetBtn} ${selectedTargets.includes(target.id) ? styles.selected : ''} ${styles[target.type]}`}
                                                onClick={() => toggleTarget(target.id)}
                                            >
                                                {target.type === 'enemy' ? <Skull size={14} /> : target.type === 'self' ? <Shield size={14} /> : <Heart size={14} />}
                                                <span>{target.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    className={`btn btn-gold btn-lg ${styles.castBtn}`}
                                    onClick={castSpell}
                                    disabled={selectedTargets.length === 0 || isCasting}
                                >
                                    {isCasting ? (
                                        <>Casting...</>
                                    ) : (
                                        <><Dice6 size={18} /> Cast {selectedSpell.name}</>
                                    )}
                                </button>
                            </>
                        ) : (
                            <div className={styles.noSelection}>
                                <Sparkles size={32} />
                                <p>Select a spell to cast</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
