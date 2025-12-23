'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
    Swords, Plus, Play, Pause, SkipForward, RotateCcw,
    Heart, Shield, Trash2, Edit, ChevronUp, ChevronDown,
    Dice6, User, Skull, AlertTriangle
} from 'lucide-react';
import { Combatant, Condition } from '@/types';
import { rollInitiative } from '@/lib/dice';
import styles from './page.module.css';

const conditions: Condition[] = [
    'blinded', 'charmed', 'deafened', 'frightened', 'grappled',
    'incapacitated', 'invisible', 'paralyzed', 'petrified', 'poisoned',
    'prone', 'restrained', 'stunned', 'unconscious', 'exhaustion'
];

interface CombatantState extends Combatant {
    tempId: string;
}

export default function CombatPage() {
    const [combatants, setCombatants] = useState<CombatantState[]>([]);
    const [currentTurn, setCurrentTurn] = useState(0);
    const [round, setRound] = useState(1);
    const [isActive, setIsActive] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    // Add form state
    const [newName, setNewName] = useState('');
    const [newInitiative, setNewInitiative] = useState(10);
    const [newAC, setNewAC] = useState(10);
    const [newHP, setNewHP] = useState(10);
    const [newMaxHP, setNewMaxHP] = useState(10);
    const [isEnemy, setIsEnemy] = useState(false);

    const sortByInitiative = (list: CombatantState[]) => {
        return [...list].sort((a, b) => b.initiative - a.initiative);
    };

    const addCombatant = () => {
        if (!newName.trim()) return;

        const newCombatant: CombatantState = {
            tempId: `combatant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            id: newName.toLowerCase().replace(/\s+/g, '-'),
            name: newName,
            type: isEnemy ? 'monster' : 'player',
            initiative: newInitiative,
            initiativeModifier: 0,
            armorClass: newAC,
            maxHitPoints: newMaxHP,
            currentHitPoints: newHP,
            temporaryHitPoints: 0,
            conditions: [],
            isConcentrating: false,
            deathSaves: { successes: 0, failures: 0 },
        };

        setCombatants(prev => sortByInitiative([...prev, newCombatant]));

        // Reset form
        setNewName('');
        setNewInitiative(10);
        setNewAC(10);
        setNewHP(10);
        setNewMaxHP(10);
        setIsEnemy(false);
        setShowAddForm(false);
    };

    const rollInitiativeForAll = () => {
        setCombatants(prev => {
            const updated = prev.map(c => {
                const roll = rollInitiative(c.initiativeModifier || 0, c.name);
                return { ...c, initiative: roll.total };
            });
            return sortByInitiative(updated);
        });
    };

    const removeCombatant = (tempId: string) => {
        setCombatants(prev => prev.filter(c => c.tempId !== tempId));
        if (currentTurn >= combatants.length - 1) {
            setCurrentTurn(Math.max(0, combatants.length - 2));
        }
    };

    const updateHP = (tempId: string, delta: number) => {
        setCombatants(prev => prev.map(c => {
            if (c.tempId !== tempId) return c;
            const newHP = Math.max(0, Math.min(c.maxHitPoints, c.currentHitPoints + delta));
            return { ...c, currentHitPoints: newHP };
        }));
    };

    const toggleCondition = (tempId: string, condition: Condition) => {
        setCombatants(prev => prev.map(c => {
            if (c.tempId !== tempId) return c;
            const hasCondition = c.conditions.includes(condition);
            return {
                ...c,
                conditions: hasCondition
                    ? c.conditions.filter(cond => cond !== condition)
                    : [...c.conditions, condition]
            };
        }));
    };

    const startCombat = () => {
        if (combatants.length === 0) return;
        setIsActive(true);
        setCurrentTurn(0);
        setRound(1);
    };

    const nextTurn = () => {
        if (currentTurn >= combatants.length - 1) {
            setCurrentTurn(0);
            setRound(r => r + 1);
        } else {
            setCurrentTurn(t => t + 1);
        }
    };

    const prevTurn = () => {
        if (currentTurn <= 0) {
            if (round > 1) {
                setCurrentTurn(combatants.length - 1);
                setRound(r => r - 1);
            }
        } else {
            setCurrentTurn(t => t - 1);
        }
    };

    const resetCombat = () => {
        setIsActive(false);
        setCurrentTurn(0);
        setRound(1);
    };

    const clearAll = () => {
        setCombatants([]);
        resetCombat();
    };

    return (
        <div className={styles.combatPage}>
            <motion.header
                className={styles.pageHeader}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className={styles.headerContent}>
                    <h1><Swords size={32} /> Combat Tracker</h1>
                    <p>Manage initiative and track the battle</p>
                </div>
                <div className={styles.headerActions}>
                    <button className="btn btn-secondary" onClick={() => setShowAddForm(true)}>
                        <Plus size={18} /> Add Combatant
                    </button>
                    <button className="btn btn-secondary" onClick={rollInitiativeForAll} disabled={combatants.length === 0}>
                        <Dice6 size={18} /> Roll All Initiative
                    </button>
                </div>
            </motion.header>

            {/* Combat Controls */}
            <motion.div
                className={styles.combatControls}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className={styles.roundInfo}>
                    <span className={styles.roundLabel}>Round</span>
                    <span className={styles.roundNumber}>{round}</span>
                </div>

                <div className={styles.turnControls}>
                    <button
                        className={styles.controlBtn}
                        onClick={prevTurn}
                        disabled={!isActive}
                        title="Previous Turn"
                    >
                        <ChevronUp size={20} />
                    </button>

                    {isActive ? (
                        <button className={`${styles.controlBtn} ${styles.pauseBtn}`} onClick={() => setIsActive(false)}>
                            <Pause size={24} />
                        </button>
                    ) : (
                        <button
                            className={`${styles.controlBtn} ${styles.playBtn}`}
                            onClick={startCombat}
                            disabled={combatants.length === 0}
                        >
                            <Play size={24} />
                        </button>
                    )}

                    <button
                        className={styles.controlBtn}
                        onClick={nextTurn}
                        disabled={!isActive}
                        title="Next Turn"
                    >
                        <ChevronDown size={20} />
                    </button>
                </div>

                <div className={styles.actionButtons}>
                    <button className="btn btn-secondary btn-sm" onClick={resetCombat}>
                        <RotateCcw size={16} /> Reset
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={clearAll}>
                        <Trash2 size={16} /> Clear All
                    </button>
                </div>
            </motion.div>

            {/* Initiative List */}
            <div className={styles.initiativeList}>
                {combatants.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Swords size={48} />
                        <p>No combatants yet</p>
                        <p className={styles.hint}>Add players and monsters to begin tracking combat</p>
                        <button className="btn btn-gold" onClick={() => setShowAddForm(true)}>
                            <Plus size={18} /> Add First Combatant
                        </button>
                    </div>
                ) : (
                    <AnimatePresence>
                        {combatants.map((combatant, index) => {
                            const isCurrent = isActive && index === currentTurn;
                            const isDead = combatant.currentHitPoints <= 0;
                            const hpPercent = (combatant.currentHitPoints / combatant.maxHitPoints) * 100;

                            return (
                                <motion.div
                                    key={combatant.tempId}
                                    className={`${styles.combatantCard} ${isCurrent ? styles.current : ''} ${isDead ? styles.dead : ''}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.05 }}
                                    layout
                                >
                                    <div className={styles.initiativeBadge}>
                                        {combatant.initiative}
                                    </div>

                                    <div className={styles.combatantAvatar}>
                                        {combatant.type === 'monster' ? (
                                            <Skull size={20} />
                                        ) : (
                                            <User size={20} />
                                        )}
                                    </div>

                                    <div className={styles.combatantInfo}>
                                        <h3>{combatant.name}</h3>
                                        <div className={styles.combatantMeta}>
                                            <span><Shield size={12} /> AC {combatant.armorClass}</span>
                                            {combatant.conditions.length > 0 && (
                                                <span className={styles.conditionCount}>
                                                    <AlertTriangle size={12} /> {combatant.conditions.length} conditions
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.hpSection}>
                                        <div className={styles.hpControls}>
                                            <button onClick={() => updateHP(combatant.tempId, -1)}>-</button>
                                            <span className={styles.hpValue}>
                                                <Heart size={14} />
                                                {combatant.currentHitPoints}/{combatant.maxHitPoints}
                                            </span>
                                            <button onClick={() => updateHP(combatant.tempId, 1)}>+</button>
                                        </div>
                                        <div className={styles.hpBar}>
                                            <div
                                                className={styles.hpFill}
                                                style={{
                                                    width: `${hpPercent}%`,
                                                    background: hpPercent > 50 ? 'var(--success)' : hpPercent > 25 ? 'var(--warning)' : 'var(--danger)'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.combatantActions}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => removeCombatant(combatant.tempId)}
                                            title="Remove"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {isCurrent && (
                                        <motion.div
                                            className={styles.turnIndicator}
                                            layoutId="turnIndicator"
                                        />
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>

            {/* Add Combatant Modal */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAddForm(false)}
                    >
                        <motion.div
                            className={styles.modal}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2>Add Combatant</h2>

                            <div className={styles.formGroup}>
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Combatant name"
                                    autoFocus
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Initiative</label>
                                    <input
                                        type="number"
                                        value={newInitiative}
                                        onChange={(e) => setNewInitiative(parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>AC</label>
                                    <input
                                        type="number"
                                        value={newAC}
                                        onChange={(e) => setNewAC(parseInt(e.target.value) || 10)}
                                    />
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Current HP</label>
                                    <input
                                        type="number"
                                        value={newHP}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || 0;
                                            setNewHP(val);
                                            if (val > newMaxHP) setNewMaxHP(val);
                                        }}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Max HP</label>
                                    <input
                                        type="number"
                                        value={newMaxHP}
                                        onChange={(e) => setNewMaxHP(parseInt(e.target.value) || 1)}
                                    />
                                </div>
                            </div>

                            <label className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    checked={isEnemy}
                                    onChange={(e) => setIsEnemy(e.target.checked)}
                                />
                                Enemy/Monster
                            </label>

                            <div className={styles.modalActions}>
                                <button className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-gold" onClick={addCombatant}>
                                    <Plus size={16} /> Add
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
