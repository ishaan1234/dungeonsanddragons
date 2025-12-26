'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Shield, Heart, Zap, Footprints, Award,
    Edit2, Save, XCircle, Plus, Minus, Sparkles,
    Coins, FileText, AlertTriangle, User
} from 'lucide-react';
import { Character, Condition, SpellSlots } from '@/types';
import styles from './EditableCharacterSheet.module.css';

interface EditableCharacterSheetProps {
    character: Character;
    onUpdate: (updates: Partial<Character>) => void;
    onClose: () => void;
}

const ALL_CONDITIONS: Condition[] = [
    'blinded', 'charmed', 'deafened', 'frightened', 'grappled',
    'incapacitated', 'invisible', 'paralyzed', 'petrified', 'poisoned',
    'prone', 'restrained', 'stunned', 'unconscious', 'exhaustion'
];

function getModifier(score: number): number {
    return Math.floor((score - 10) / 2);
}

function formatModifier(mod: number): string {
    return mod >= 0 ? `+${mod}` : `${mod}`;
}

export default function EditableCharacterSheet({
    character,
    onUpdate,
    onClose
}: EditableCharacterSheetProps) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedData, setEditedData] = useState({
        currentHitPoints: character.currentHitPoints,
        temporaryHitPoints: character.temporaryHitPoints,
        conditions: [...character.conditions],
        currency: { ...character.currency },
        spellSlots: character.spellSlots ? JSON.parse(JSON.stringify(character.spellSlots)) : undefined,
        notes: character.notes || ''
    });
    const [hpDelta, setHpDelta] = useState<string>('');
    const [showConditionMenu, setShowConditionMenu] = useState(false);
    const conditionMenuRef = useRef<HTMLDivElement>(null);

    // Reset edited data when character changes
    useEffect(() => {
        setEditedData({
            currentHitPoints: character.currentHitPoints,
            temporaryHitPoints: character.temporaryHitPoints,
            conditions: [...character.conditions],
            currency: { ...character.currency },
            spellSlots: character.spellSlots ? JSON.parse(JSON.stringify(character.spellSlots)) : undefined,
            notes: character.notes || ''
        });
    }, [character]);

    // Close condition menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (conditionMenuRef.current && !conditionMenuRef.current.contains(event.target as Node)) {
                setShowConditionMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const hpPercent = Math.max(0, Math.min(100, (editedData.currentHitPoints / character.maxHitPoints) * 100));

    const getHpColor = () => {
        if (hpPercent > 50) return 'var(--success)';
        if (hpPercent > 25) return 'var(--warning)';
        return 'var(--danger)';
    };

    const handleDamage = () => {
        const amount = parseInt(hpDelta) || 0;
        if (amount <= 0) return;

        let remainingDamage = amount;
        let newTempHp = editedData.temporaryHitPoints;
        let newCurrentHp = editedData.currentHitPoints;

        // Damage temp HP first
        if (newTempHp > 0) {
            if (remainingDamage >= newTempHp) {
                remainingDamage -= newTempHp;
                newTempHp = 0;
            } else {
                newTempHp -= remainingDamage;
                remainingDamage = 0;
            }
        }

        // Then damage regular HP
        newCurrentHp = Math.max(0, newCurrentHp - remainingDamage);

        setEditedData(prev => ({
            ...prev,
            currentHitPoints: newCurrentHp,
            temporaryHitPoints: newTempHp
        }));
        setHpDelta('');
    };

    const handleHeal = () => {
        const amount = parseInt(hpDelta) || 0;
        if (amount <= 0) return;

        const newCurrentHp = Math.min(character.maxHitPoints, editedData.currentHitPoints + amount);

        setEditedData(prev => ({
            ...prev,
            currentHitPoints: newCurrentHp
        }));
        setHpDelta('');
    };

    const handleTempHpChange = (value: string) => {
        const numValue = parseInt(value) || 0;
        setEditedData(prev => ({
            ...prev,
            temporaryHitPoints: Math.max(0, numValue)
        }));
    };

    const handleSpellSlotToggle = (level: number, index: number) => {
        if (!editedData.spellSlots) return;

        const levelKey = level as keyof SpellSlots;
        const slot = editedData.spellSlots[levelKey];
        if (!slot) return;

        const available = slot.max - slot.used;
        const isCurrentlyAvailable = index < available;

        setEditedData(prev => {
            if (!prev.spellSlots) return prev;
            const newSlots = JSON.parse(JSON.stringify(prev.spellSlots)) as SpellSlots;
            const newSlot = newSlots[levelKey];

            if (isCurrentlyAvailable) {
                // Use a slot
                newSlot.used = Math.min(newSlot.max, newSlot.used + 1);
            } else {
                // Restore a slot
                newSlot.used = Math.max(0, newSlot.used - 1);
            }

            return { ...prev, spellSlots: newSlots };
        });
    };

    const handleAddCondition = (condition: Condition) => {
        if (!editedData.conditions.includes(condition)) {
            setEditedData(prev => ({
                ...prev,
                conditions: [...prev.conditions, condition]
            }));
        }
        setShowConditionMenu(false);
    };

    const handleRemoveCondition = (condition: Condition) => {
        setEditedData(prev => ({
            ...prev,
            conditions: prev.conditions.filter(c => c !== condition)
        }));
    };

    const handleCurrencyChange = (type: keyof typeof editedData.currency, value: string) => {
        const numValue = parseInt(value) || 0;
        setEditedData(prev => ({
            ...prev,
            currency: {
                ...prev.currency,
                [type]: Math.max(0, numValue)
            }
        }));
    };

    const handleNotesChange = (value: string) => {
        setEditedData(prev => ({
            ...prev,
            notes: value
        }));
    };

    const handleSave = () => {
        onUpdate({
            currentHitPoints: editedData.currentHitPoints,
            temporaryHitPoints: editedData.temporaryHitPoints,
            conditions: editedData.conditions,
            currency: editedData.currency,
            spellSlots: editedData.spellSlots,
            notes: editedData.notes
        });
        setIsEditMode(false);
    };

    const handleCancel = () => {
        setEditedData({
            currentHitPoints: character.currentHitPoints,
            temporaryHitPoints: character.temporaryHitPoints,
            conditions: [...character.conditions],
            currency: { ...character.currency },
            spellSlots: character.spellSlots ? JSON.parse(JSON.stringify(character.spellSlots)) : undefined,
            notes: character.notes || ''
        });
        setIsEditMode(false);
        setHpDelta('');
    };

    const availableConditions = ALL_CONDITIONS.filter(c => !editedData.conditions.includes(c));
    const hasSpellcasting = editedData.spellSlots && character.spellcastingAbility;

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
                        <div className={styles.headerText}>
                            <h2>{character.name}</h2>
                            <p className={styles.subtitle}>
                                {character.race} {character.class} - Level {character.level}
                            </p>
                        </div>
                    </div>
                    <div className={styles.headerActions}>
                        <button
                            className={`${styles.editToggle} ${isEditMode ? styles.active : ''}`}
                            onClick={() => setIsEditMode(!isEditMode)}
                            title={isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
                        >
                            <Edit2 size={18} />
                        </button>
                        <button className={styles.closeBtn} onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    {/* Core Stats Bar */}
                    <div className={styles.coreStats}>
                        <div className={styles.coreStat}>
                            <Shield size={18} />
                            <span className={styles.coreValue}>{character.armorClass}</span>
                            <span className={styles.coreLabel}>AC</span>
                        </div>
                        <div className={styles.coreStat}>
                            <Heart size={18} />
                            <span className={styles.coreValue}>
                                {editedData.currentHitPoints}/{character.maxHitPoints}
                            </span>
                            <span className={styles.coreLabel}>HP</span>
                        </div>
                        <div className={styles.coreStat}>
                            <Footprints size={18} />
                            <span className={styles.coreValue}>{character.speed}</span>
                            <span className={styles.coreLabel}>Speed</span>
                        </div>
                        <div className={styles.coreStat}>
                            <Zap size={18} />
                            <span className={styles.coreValue}>
                                {formatModifier(character.initiative)}
                            </span>
                            <span className={styles.coreLabel}>Init</span>
                        </div>
                        <div className={styles.coreStat}>
                            <Award size={18} />
                            <span className={styles.coreValue}>
                                {formatModifier(character.proficiencyBonus)}
                            </span>
                            <span className={styles.coreLabel}>Prof</span>
                        </div>
                    </div>

                    {/* HP Section */}
                    <div className={styles.hpSection}>
                        <div className={styles.hpDisplay}>
                            <div className={styles.hpNumbers}>
                                <span className={styles.currentHp}>{editedData.currentHitPoints}</span>
                                <span className={styles.hpDivider}>/</span>
                                <span className={styles.maxHp}>{character.maxHitPoints}</span>
                                {editedData.temporaryHitPoints > 0 && (
                                    <span className={styles.tempHpBadge}>+{editedData.temporaryHitPoints} temp</span>
                                )}
                            </div>
                            <div className={styles.hpBar}>
                                <div
                                    className={styles.hpFill}
                                    style={{ width: `${hpPercent}%`, background: getHpColor() }}
                                />
                            </div>

                            {/* HP Controls (Edit Mode) */}
                            {isEditMode && (
                                <>
                                    <div className={styles.hpControls}>
                                        <input
                                            type="number"
                                            className={styles.hpInput}
                                            value={hpDelta}
                                            onChange={(e) => setHpDelta(e.target.value)}
                                            placeholder="0"
                                            min="0"
                                        />
                                        <button
                                            className={`${styles.hpBtn} ${styles.damageBtn}`}
                                            onClick={handleDamage}
                                        >
                                            <Minus size={14} /> Damage
                                        </button>
                                        <button
                                            className={`${styles.hpBtn} ${styles.healBtn}`}
                                            onClick={handleHeal}
                                        >
                                            <Plus size={14} /> Heal
                                        </button>
                                    </div>
                                    <div className={styles.tempHpSection}>
                                        <span className={styles.tempHpLabel}>Temp HP:</span>
                                        <input
                                            type="number"
                                            className={styles.tempHpInput}
                                            value={editedData.temporaryHitPoints}
                                            onChange={(e) => handleTempHpChange(e.target.value)}
                                            min="0"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Spell Slots */}
                    {hasSpellcasting && editedData.spellSlots && (
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Sparkles size={16} />
                                <span>Spell Slots</span>
                            </div>
                            <div className={styles.spellSlots}>
                                {([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map((level) => {
                                    const slot = editedData.spellSlots![level];
                                    if (!slot || slot.max === 0) return null;
                                    const available = slot.max - slot.used;
                                    return (
                                        <div key={level} className={styles.slotRow}>
                                            <span className={styles.slotLevel}>Level {level}</span>
                                            <div className={styles.slotPips}>
                                                {Array.from({ length: slot.max }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`${styles.slotPip} ${i < available ? styles.available : styles.used} ${isEditMode ? styles.editable : ''}`}
                                                        onClick={() => isEditMode && handleSpellSlotToggle(level, i)}
                                                        title={isEditMode ? (i < available ? 'Use slot' : 'Restore slot') : undefined}
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

                    {/* Conditions */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <AlertTriangle size={16} />
                            <span>Conditions</span>
                        </div>
                        <div className={styles.conditionsSection}>
                            {editedData.conditions.length === 0 && !isEditMode && (
                                <span className={styles.noConditions}>No active conditions</span>
                            )}
                            {editedData.conditions.map((condition) => (
                                <div key={condition} className={styles.conditionBadge}>
                                    <span>{condition}</span>
                                    {isEditMode && (
                                        <button
                                            className={styles.removeCondition}
                                            onClick={() => handleRemoveCondition(condition)}
                                        >
                                            <X size={12} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {isEditMode && availableConditions.length > 0 && (
                                <div className={styles.conditionDropdown} ref={conditionMenuRef}>
                                    <button
                                        className={styles.addConditionBtn}
                                        onClick={() => setShowConditionMenu(!showConditionMenu)}
                                    >
                                        <Plus size={12} /> Add
                                    </button>
                                    <AnimatePresence>
                                        {showConditionMenu && (
                                            <motion.div
                                                className={styles.conditionMenu}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                            >
                                                {availableConditions.map((condition) => (
                                                    <button
                                                        key={condition}
                                                        className={styles.conditionOption}
                                                        onClick={() => handleAddCondition(condition)}
                                                    >
                                                        {condition}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Currency */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Coins size={16} />
                            <span>Currency</span>
                        </div>
                        <div className={styles.currencyGrid}>
                            {[
                                { key: 'platinum' as const, label: 'PP' },
                                { key: 'gold' as const, label: 'GP' },
                                { key: 'electrum' as const, label: 'EP' },
                                { key: 'silver' as const, label: 'SP' },
                                { key: 'copper' as const, label: 'CP' }
                            ].map(({ key, label }) => (
                                <div key={key} className={styles.currencyItem}>
                                    {isEditMode ? (
                                        <input
                                            type="number"
                                            className={styles.currencyInput}
                                            value={editedData.currency[key]}
                                            onChange={(e) => handleCurrencyChange(key, e.target.value)}
                                            min="0"
                                        />
                                    ) : (
                                        <span className={styles.currencyValue}>{editedData.currency[key]}</span>
                                    )}
                                    <span className={styles.currencyLabel}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Notes */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <FileText size={16} />
                            <span>Notes</span>
                        </div>
                        {isEditMode ? (
                            <textarea
                                className={styles.notesTextarea}
                                value={editedData.notes}
                                onChange={(e) => handleNotesChange(e.target.value)}
                                placeholder="Add session notes, reminders, or other information..."
                            />
                        ) : (
                            <div className={styles.notesDisplay}>
                                {editedData.notes || <span className={styles.emptyNotes}>No notes</span>}
                            </div>
                        )}
                    </section>
                </div>

                {/* Footer Actions (Edit Mode) */}
                {isEditMode && (
                    <div className={styles.footer}>
                        <button className={styles.cancelBtn} onClick={handleCancel}>
                            <XCircle size={18} /> Cancel
                        </button>
                        <button className={styles.saveBtn} onClick={handleSave}>
                            <Save size={18} /> Save Changes
                        </button>
                    </div>
                )}
            </motion.div>
        </>
    );
}
