'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Crown, Heart, Shield, Zap, Sparkles, Skull,
    Plus, Minus, RotateCcw, Eye, EyeOff, Edit2,
    Check, X, AlertTriangle, ChevronDown
} from 'lucide-react';
import { Combatant, Condition } from '@/types';
import { ActiveEffect, EFFECT_TEMPLATES, createEffect, generateEffectId } from '@/lib/effects';
import styles from './DMControls.module.css';

interface DMControlsProps {
    combatants: Combatant[];
    onUpdateCombatant: (id: string, updates: Partial<Combatant>) => void;
    onAddEffect: (targetId: string, effect: ActiveEffect) => void;
    onRemoveEffect: (targetId: string, effectId: string) => void;
    onKillCombatant: (id: string) => void;
    onReviveCombatant: (id: string, hp: number) => void;
    activeEffects: Map<string, ActiveEffect[]>;
}

const CONDITIONS: { id: Condition; label: string; icon: string }[] = [
    { id: 'blinded', label: 'Blinded', icon: '🙈' },
    { id: 'charmed', label: 'Charmed', icon: '💕' },
    { id: 'deafened', label: 'Deafened', icon: '🙉' },
    { id: 'frightened', label: 'Frightened', icon: '😨' },
    { id: 'grappled', label: 'Grappled', icon: '🤝' },
    { id: 'incapacitated', label: 'Incapacitated', icon: '💫' },
    { id: 'invisible', label: 'Invisible', icon: '👻' },
    { id: 'paralyzed', label: 'Paralyzed', icon: '🧊' },
    { id: 'petrified', label: 'Petrified', icon: '🗿' },
    { id: 'poisoned', label: 'Poisoned', icon: '🤢' },
    { id: 'prone', label: 'Prone', icon: '🛌' },
    { id: 'restrained', label: 'Restrained', icon: '⛓️' },
    { id: 'stunned', label: 'Stunned', icon: '⭐' },
    { id: 'unconscious', label: 'Unconscious', icon: '😴' },
];

export default function DMControls({
    combatants,
    onUpdateCombatant,
    onAddEffect,
    onRemoveEffect,
    onKillCombatant,
    onReviveCombatant,
    activeEffects,
}: DMControlsProps) {
    const [selectedCombatant, setSelectedCombatant] = useState<string | null>(null);
    const [showEffectMenu, setShowEffectMenu] = useState(false);
    const [customHPValue, setCustomHPValue] = useState('');
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    const selected = combatants.find(c => c.id === selectedCombatant);

    const handleHPChange = (delta: number) => {
        if (!selected) return;
        const newHP = Math.max(0, Math.min(selected.maxHitPoints, selected.currentHitPoints + delta));
        onUpdateCombatant(selected.id, { currentHitPoints: newHP });
    };

    const handleSetHP = () => {
        if (!selected || !customHPValue) return;
        const value = parseInt(customHPValue);
        if (isNaN(value)) return;

        const newHP = Math.max(0, Math.min(selected.maxHitPoints, value));
        onUpdateCombatant(selected.id, { currentHitPoints: newHP });
        setCustomHPValue('');
    };

    const handleSetMaxHP = () => {
        if (!selected || !editValue) return;
        const value = parseInt(editValue);
        if (isNaN(value)) return;

        onUpdateCombatant(selected.id, {
            maxHitPoints: value,
            currentHitPoints: Math.min(selected.currentHitPoints, value)
        });
        setEditingField(null);
    };

    const handleSetAC = () => {
        if (!selected || !editValue) return;
        const value = parseInt(editValue);
        if (isNaN(value)) return;

        onUpdateCombatant(selected.id, { armorClass: value });
        setEditingField(null);
    };

    const toggleCondition = (condition: Condition) => {
        if (!selected) return;
        const currentConditions = selected.conditions as Condition[];
        const hasCondition = currentConditions.includes(condition);

        onUpdateCombatant(selected.id, {
            conditions: hasCondition
                ? currentConditions.filter(c => c !== condition)
                : [...currentConditions, condition]
        });
    };

    const addQuickEffect = (templateId: string) => {
        if (!selected) return;

        const effect = createEffect(
            templateId,
            'dm',
            'DM',
            selected.id
        );

        onAddEffect(selected.id, effect);
        setShowEffectMenu(false);
    };

    const addCustomEffect = () => {
        if (!selected) return;

        const effect: ActiveEffect = {
            id: generateEffectId(),
            name: 'Custom Effect',
            type: 'buff',
            source: 'DM',
            targetId: selected.id,
            description: 'A custom effect applied by the DM.',
            durationRounds: 10,
            appliedAt: Date.now(),
            iconEmoji: '✨',
            color: '#8b5cf6',
        };

        onAddEffect(selected.id, effect);
        setShowEffectMenu(false);
    };

    const currentEffects = selected ? activeEffects.get(selected.id) || [] : [];

    return (
        <div className={styles.dmControls}>
            <div className={styles.header}>
                <Crown size={18} />
                <h3>DM Controls</h3>
            </div>

            {/* Combatant Selector */}
            <div className={styles.selector}>
                <label>Select Combatant:</label>
                <select
                    value={selectedCombatant || ''}
                    onChange={(e) => setSelectedCombatant(e.target.value || null)}
                >
                    <option value="">-- Select --</option>
                    {combatants.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.name} ({c.currentHitPoints}/{c.maxHitPoints} HP)
                        </option>
                    ))}
                </select>
            </div>

            {selected && (
                <motion.div
                    className={styles.controlPanel}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className={styles.combatantHeader}>
                        <h4>{selected.name}</h4>
                        <span className={`${styles.typeBadge} ${styles[selected.type]}`}>
                            {selected.type}
                        </span>
                    </div>

                    {/* HP Controls */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Heart size={14} /> Hit Points
                        </div>

                        <div className={styles.hpDisplay}>
                            <span className={styles.hpCurrent}>{selected.currentHitPoints}</span>
                            <span className={styles.hpSeparator}>/</span>
                            {editingField === 'maxHP' ? (
                                <div className={styles.inlineEdit}>
                                    <input
                                        type="number"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        autoFocus
                                    />
                                    <button onClick={handleSetMaxHP}><Check size={12} /></button>
                                    <button onClick={() => setEditingField(null)}><X size={12} /></button>
                                </div>
                            ) : (
                                <span
                                    className={styles.hpMax}
                                    onClick={() => { setEditingField('maxHP'); setEditValue(selected.maxHitPoints.toString()); }}
                                >
                                    {selected.maxHitPoints}
                                    <Edit2 size={10} />
                                </span>
                            )}
                        </div>

                        <div className={styles.hpBar}>
                            <div
                                className={styles.hpFill}
                                style={{
                                    width: `${(selected.currentHitPoints / selected.maxHitPoints) * 100}%`,
                                    background: selected.currentHitPoints > selected.maxHitPoints * 0.5
                                        ? 'var(--success)'
                                        : selected.currentHitPoints > selected.maxHitPoints * 0.25
                                            ? 'var(--warning)'
                                            : 'var(--danger)'
                                }}
                            />
                        </div>

                        <div className={styles.hpControls}>
                            <button onClick={() => handleHPChange(-10)}>-10</button>
                            <button onClick={() => handleHPChange(-5)}>-5</button>
                            <button onClick={() => handleHPChange(-1)}>-1</button>
                            <button onClick={() => handleHPChange(1)} className={styles.heal}>+1</button>
                            <button onClick={() => handleHPChange(5)} className={styles.heal}>+5</button>
                            <button onClick={() => handleHPChange(10)} className={styles.heal}>+10</button>
                        </div>

                        <div className={styles.customHP}>
                            <input
                                type="number"
                                value={customHPValue}
                                onChange={(e) => setCustomHPValue(e.target.value)}
                                placeholder="Set HP to..."
                            />
                            <button onClick={handleSetHP}>Set</button>
                        </div>

                        <div className={styles.quickActions}>
                            {selected.currentHitPoints > 0 ? (
                                <button
                                    className={styles.killBtn}
                                    onClick={() => onKillCombatant(selected.id)}
                                >
                                    <Skull size={14} /> Kill
                                </button>
                            ) : (
                                <button
                                    className={styles.reviveBtn}
                                    onClick={() => onReviveCombatant(selected.id, 1)}
                                >
                                    <Heart size={14} /> Revive (1 HP)
                                </button>
                            )}
                            <button
                                className={styles.fullHealBtn}
                                onClick={() => onUpdateCombatant(selected.id, { currentHitPoints: selected.maxHitPoints })}
                            >
                                <Plus size={14} /> Full Heal
                            </button>
                        </div>
                    </div>

                    {/* AC Control */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Shield size={14} /> Armor Class
                        </div>
                        {editingField === 'ac' ? (
                            <div className={styles.inlineEdit}>
                                <input
                                    type="number"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    autoFocus
                                />
                                <button onClick={handleSetAC}><Check size={12} /></button>
                                <button onClick={() => setEditingField(null)}><X size={12} /></button>
                            </div>
                        ) : (
                            <div
                                className={styles.acDisplay}
                                onClick={() => { setEditingField('ac'); setEditValue(selected.armorClass.toString()); }}
                            >
                                <Shield size={20} />
                                <span>{selected.armorClass}</span>
                                <Edit2 size={12} />
                            </div>
                        )}
                    </div>

                    {/* Conditions */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <AlertTriangle size={14} /> Conditions
                        </div>
                        <div className={styles.conditionGrid}>
                            {CONDITIONS.map(cond => (
                                <button
                                    key={cond.id}
                                    className={`${styles.conditionBtn} ${(selected.conditions as Condition[]).includes(cond.id) ? styles.active : ''}`}
                                    onClick={() => toggleCondition(cond.id)}
                                    title={cond.label}
                                >
                                    <span>{cond.icon}</span>
                                    <span className={styles.condLabel}>{cond.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Effects */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Sparkles size={14} /> Active Effects
                            <button
                                className={styles.addEffectBtn}
                                onClick={() => setShowEffectMenu(!showEffectMenu)}
                            >
                                <Plus size={12} /> Add
                            </button>
                        </div>

                        <AnimatePresence>
                            {showEffectMenu && (
                                <motion.div
                                    className={styles.effectMenu}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <div className={styles.effectMenuHeader}>Quick Add Effect</div>
                                    <div className={styles.effectOptions}>
                                        {Object.entries(EFFECT_TEMPLATES).slice(0, 8).map(([id, template]) => (
                                            <button
                                                key={id}
                                                className={styles.effectOption}
                                                onClick={() => addQuickEffect(id)}
                                            >
                                                <span>{template.iconEmoji || '✨'}</span>
                                                <span>{template.name}</span>
                                            </button>
                                        ))}
                                        <button
                                            className={styles.effectOption}
                                            onClick={addCustomEffect}
                                        >
                                            <span>⚙️</span>
                                            <span>Custom...</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className={styles.effectsList}>
                            {currentEffects.length === 0 ? (
                                <p className={styles.noEffects}>No active effects</p>
                            ) : (
                                currentEffects.map(effect => (
                                    <div key={effect.id} className={styles.effectItem}>
                                        <span className={styles.effectIcon}>{effect.iconEmoji || '✨'}</span>
                                        <div className={styles.effectInfo}>
                                            <span className={styles.effectName}>{effect.name}</span>
                                            {effect.durationRounds && (
                                                <span className={styles.effectDuration}>
                                                    {effect.durationRounds} rounds
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            className={styles.removeEffectBtn}
                                            onClick={() => onRemoveEffect(selected.id, effect.id)}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

            {!selected && (
                <div className={styles.noSelection}>
                    <Crown size={32} />
                    <p>Select a combatant to manage</p>
                </div>
            )}
        </div>
    );
}
