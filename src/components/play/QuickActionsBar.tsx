'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, Shield, Zap, ChevronDown, ChevronUp,
    Minus, Plus, X, Check, AlertTriangle, Sparkles
} from 'lucide-react';
import { Character, Condition, SpellSlots } from '@/types';
import styles from './QuickActionsBar.module.css';

// Condition definitions with icons and colors
const CONDITIONS: { value: Condition; label: string; color: string }[] = [
    { value: 'blinded', label: 'Blinded', color: '#6b7280' },
    { value: 'charmed', label: 'Charmed', color: '#ec4899' },
    { value: 'deafened', label: 'Deafened', color: '#6b7280' },
    { value: 'frightened', label: 'Frightened', color: '#a855f7' },
    { value: 'grappled', label: 'Grappled', color: '#f59e0b' },
    { value: 'incapacitated', label: 'Incapacitated', color: '#ef4444' },
    { value: 'invisible', label: 'Invisible', color: '#06b6d4' },
    { value: 'paralyzed', label: 'Paralyzed', color: '#f59e0b' },
    { value: 'petrified', label: 'Petrified', color: '#78716c' },
    { value: 'poisoned', label: 'Poisoned', color: '#22c55e' },
    { value: 'prone', label: 'Prone', color: '#92400e' },
    { value: 'restrained', label: 'Restrained', color: '#f59e0b' },
    { value: 'stunned', label: 'Stunned', color: '#eab308' },
    { value: 'unconscious', label: 'Unconscious', color: '#1f2937' },
    { value: 'exhaustion', label: 'Exhaustion', color: '#7c3aed' },
];

interface QuickActionsBarProps {
    character: Character;
    onHPChange: (hp: number) => void;
    onConditionAdd: (condition: string) => void;
    onConditionRemove: (condition: string) => void;
    onDeathSaveChange: (type: 'success' | 'failure', count: number) => void;
    isExpanded: boolean;
    onToggleExpand: () => void;
}

export default function QuickActionsBar({
    character,
    onHPChange,
    onConditionAdd,
    onConditionRemove,
    onDeathSaveChange,
    isExpanded,
    onToggleExpand,
}: QuickActionsBarProps) {
    const [showDamageInput, setShowDamageInput] = useState(false);
    const [showHealInput, setShowHealInput] = useState(false);
    const [showConditionDropdown, setShowConditionDropdown] = useState(false);
    const [damageValue, setDamageValue] = useState('');
    const [healValue, setHealValue] = useState('');

    // Calculate HP percentage for color bar
    const hpPercent = Math.max(0, Math.min(100, (character.currentHitPoints / character.maxHitPoints) * 100));

    // Determine HP bar color
    const getHpBarColor = () => {
        if (hpPercent > 50) return 'var(--success)';
        if (hpPercent > 25) return 'var(--warning)';
        return 'var(--danger)';
    };

    // Calculate total available and used spell slots
    const spellSlotsSummary = useMemo(() => {
        if (!character.spellSlots) return null;

        let total = 0;
        let used = 0;

        for (let level = 1; level <= 9; level++) {
            const slot = character.spellSlots[level as keyof SpellSlots];
            if (slot && slot.max > 0) {
                total += slot.max;
                used += slot.used;
            }
        }

        if (total === 0) return null;
        return { available: total - used, total };
    }, [character.spellSlots]);

    // Check if character is at 0 HP (for death saves)
    const isUnconscious = character.currentHitPoints <= 0;

    // Handle damage application
    const handleApplyDamage = () => {
        const value = parseInt(damageValue, 10);
        if (isNaN(value) || value <= 0) return;

        let remainingDamage = value;

        // Temporary HP absorbs damage first
        if (character.temporaryHitPoints > 0) {
            if (character.temporaryHitPoints >= remainingDamage) {
                // All damage absorbed by temp HP - we just reduce current HP calculation
                remainingDamage = 0;
            } else {
                remainingDamage -= character.temporaryHitPoints;
            }
        }

        const newHP = Math.max(0, character.currentHitPoints - remainingDamage);
        onHPChange(newHP);
        setDamageValue('');
        setShowDamageInput(false);
    };

    // Handle healing
    const handleApplyHeal = () => {
        const value = parseInt(healValue, 10);
        if (isNaN(value) || value <= 0) return;

        const newHP = Math.min(character.maxHitPoints, character.currentHitPoints + value);
        onHPChange(newHP);
        setHealValue('');
        setShowHealInput(false);
    };

    // Get condition color
    const getConditionColor = (condition: string) => {
        const found = CONDITIONS.find(c => c.value === condition);
        return found?.color || '#6b7280';
    };

    // Handle death save clicks
    const handleDeathSaveClick = (type: 'success' | 'failure', currentCount: number) => {
        if (currentCount < 3) {
            onDeathSaveChange(type, currentCount + 1);
        }
    };

    // Collapsed view - just HP bar
    if (!isExpanded) {
        return (
            <div className={styles.collapsed} onClick={onToggleExpand}>
                <div className={styles.collapsedContent}>
                    <Heart size={14} className={styles.heartIcon} />
                    <span className={styles.collapsedHp}>
                        {character.currentHitPoints}/{character.maxHitPoints}
                    </span>
                    <div className={styles.collapsedBar}>
                        <div
                            className={styles.collapsedBarFill}
                            style={{
                                width: `${hpPercent}%`,
                                backgroundColor: getHpBarColor(),
                            }}
                        />
                    </div>
                    <ChevronDown size={14} className={styles.expandIcon} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Top Row: Stats Display */}
            <div className={styles.statsRow}>
                {/* HP Display */}
                <div className={styles.hpSection}>
                    <Heart size={14} className={styles.heartIcon} />
                    <span className={styles.hpText}>
                        HP: {character.currentHitPoints}/{character.maxHitPoints}
                    </span>
                    {character.temporaryHitPoints > 0 && (
                        <span className={styles.tempHp}>+{character.temporaryHitPoints}</span>
                    )}
                    <div className={styles.hpBar}>
                        <div
                            className={styles.hpBarFill}
                            style={{
                                width: `${hpPercent}%`,
                                backgroundColor: getHpBarColor(),
                            }}
                        />
                    </div>
                </div>

                {/* AC Badge */}
                <div className={styles.statBadge}>
                    <Shield size={12} />
                    <span>{character.armorClass}</span>
                </div>

                {/* Speed Badge */}
                <div className={styles.statBadge}>
                    <Zap size={12} />
                    <span>{character.speed} ft</span>
                </div>

                {/* Spell Slots (if caster) */}
                {spellSlotsSummary && (
                    <div className={styles.statBadge} title="Available spell slots">
                        <Sparkles size={12} />
                        <span>Slots: {spellSlotsSummary.available}/{spellSlotsSummary.total}</span>
                    </div>
                )}

                {/* Collapse Button */}
                <button className={styles.collapseBtn} onClick={onToggleExpand}>
                    <ChevronUp size={14} />
                </button>
            </div>

            {/* Conditions Row */}
            {character.conditions.length > 0 && (
                <div className={styles.conditionsRow}>
                    {character.conditions.map((condition) => (
                        <div
                            key={condition}
                            className={styles.conditionBadge}
                            style={{ backgroundColor: getConditionColor(condition) }}
                            title={condition.charAt(0).toUpperCase() + condition.slice(1)}
                        >
                            <span>{condition.charAt(0).toUpperCase() + condition.slice(1)}</span>
                            <button
                                className={styles.conditionRemove}
                                onClick={() => onConditionRemove(condition)}
                            >
                                <X size={10} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Death Saves (when unconscious) */}
            {isUnconscious && (
                <div className={styles.deathSavesRow}>
                    <div className={styles.deathSaveGroup}>
                        <span className={styles.deathSaveLabel}>Saves</span>
                        <div className={styles.deathSavePips}>
                            {[1, 2, 3].map((i) => (
                                <button
                                    key={`success-${i}`}
                                    className={`${styles.deathSavePip} ${styles.successPip} ${character.deathSaves.successes >= i ? styles.filled : ''}`}
                                    onClick={() => handleDeathSaveClick('success', character.deathSaves.successes)}
                                    disabled={character.deathSaves.successes >= 3 || character.deathSaves.failures >= 3}
                                >
                                    <Check size={8} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className={styles.deathSaveGroup}>
                        <span className={styles.deathSaveLabel}>Fails</span>
                        <div className={styles.deathSavePips}>
                            {[1, 2, 3].map((i) => (
                                <button
                                    key={`failure-${i}`}
                                    className={`${styles.deathSavePip} ${styles.failurePip} ${character.deathSaves.failures >= i ? styles.filled : ''}`}
                                    onClick={() => handleDeathSaveClick('failure', character.deathSaves.failures)}
                                    disabled={character.deathSaves.successes >= 3 || character.deathSaves.failures >= 3}
                                >
                                    <X size={8} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Actions Row */}
            <div className={styles.actionsRow}>
                {/* Quick Damage Button */}
                <div className={styles.actionGroup}>
                    <button
                        className={`${styles.actionBtn} ${styles.damageBtn}`}
                        onClick={() => {
                            setShowDamageInput(!showDamageInput);
                            setShowHealInput(false);
                            setShowConditionDropdown(false);
                        }}
                    >
                        <Minus size={12} />
                        Damage
                    </button>
                    <AnimatePresence>
                        {showDamageInput && (
                            <motion.div
                                className={styles.inputPopover}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                            >
                                <input
                                    type="number"
                                    value={damageValue}
                                    onChange={(e) => setDamageValue(e.target.value)}
                                    placeholder="Amount"
                                    min={1}
                                    className={styles.amountInput}
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleApplyDamage();
                                        if (e.key === 'Escape') setShowDamageInput(false);
                                    }}
                                />
                                <button
                                    className={styles.applyBtn}
                                    onClick={handleApplyDamage}
                                    disabled={!damageValue || parseInt(damageValue, 10) <= 0}
                                >
                                    Apply
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Quick Heal Button */}
                <div className={styles.actionGroup}>
                    <button
                        className={`${styles.actionBtn} ${styles.healBtn}`}
                        onClick={() => {
                            setShowHealInput(!showHealInput);
                            setShowDamageInput(false);
                            setShowConditionDropdown(false);
                        }}
                    >
                        <Plus size={12} />
                        Heal
                    </button>
                    <AnimatePresence>
                        {showHealInput && (
                            <motion.div
                                className={styles.inputPopover}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                            >
                                <input
                                    type="number"
                                    value={healValue}
                                    onChange={(e) => setHealValue(e.target.value)}
                                    placeholder="Amount"
                                    min={1}
                                    className={styles.amountInput}
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleApplyHeal();
                                        if (e.key === 'Escape') setShowHealInput(false);
                                    }}
                                />
                                <button
                                    className={`${styles.applyBtn} ${styles.healApply}`}
                                    onClick={handleApplyHeal}
                                    disabled={!healValue || parseInt(healValue, 10) <= 0}
                                >
                                    Apply
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Add Condition Dropdown */}
                <div className={styles.actionGroup}>
                    <button
                        className={`${styles.actionBtn} ${styles.conditionBtn}`}
                        onClick={() => {
                            setShowConditionDropdown(!showConditionDropdown);
                            setShowDamageInput(false);
                            setShowHealInput(false);
                        }}
                    >
                        <AlertTriangle size={12} />
                        Condition
                    </button>
                    <AnimatePresence>
                        {showConditionDropdown && (
                            <motion.div
                                className={styles.conditionDropdown}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                            >
                                {CONDITIONS.map((condition) => {
                                    const isActive = character.conditions.includes(condition.value);
                                    return (
                                        <button
                                            key={condition.value}
                                            className={`${styles.conditionOption} ${isActive ? styles.active : ''}`}
                                            onClick={() => {
                                                if (isActive) {
                                                    onConditionRemove(condition.value);
                                                } else {
                                                    onConditionAdd(condition.value);
                                                }
                                            }}
                                        >
                                            <span
                                                className={styles.conditionDot}
                                                style={{ backgroundColor: condition.color }}
                                            />
                                            {condition.label}
                                            {isActive && <Check size={12} className={styles.checkIcon} />}
                                        </button>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
