'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User, RefreshCw, Save, Edit2, Check, X,
    Shield, Heart, Brain, Activity, Download
} from 'lucide-react';
import { GeneratedNPC, generateNPC } from '@/lib/generators';
import { AbilityScores } from '@/types';
import styles from './page.module.css';

export default function NPCGeneratorPage() {
    const [npc, setNpc] = useState<GeneratedNPC | null>(null);
    const [level, setLevel] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [editedNpc, setEditedNpc] = useState<GeneratedNPC | null>(null);

    const handleGenerate = () => {
        const newNpc = generateNPC(level);
        setNpc(newNpc);
        setEditedNpc(newNpc);
        setIsEditing(false);
    };

    const startEditing = () => {
        if (npc) {
            setEditedNpc({ ...npc });
            setIsEditing(true);
        }
    };

    const saveEdits = () => {
        if (editedNpc) {
            setNpc(editedNpc);
            setIsEditing(false);
        }
    };

    const cancelEdits = () => {
        if (npc) {
            setEditedNpc({ ...npc });
            setIsEditing(false);
        }
    };

    const updateField = (field: keyof GeneratedNPC, value: any) => {
        if (editedNpc) {
            setEditedNpc({ ...editedNpc, [field]: value });
        }
    };

    const updateAbility = (ability: keyof AbilityScores, value: number) => {
        if (editedNpc) {
            setEditedNpc({
                ...editedNpc,
                abilityScores: {
                    ...editedNpc.abilityScores,
                    [ability]: value
                }
            });
        }
    };

    const getMod = (score: number) => Math.floor((score - 10) / 2);
    const formatMod = (mod: number) => (mod >= 0 ? `+${mod}` : mod.toString());

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1><User size={32} /> NPC Generator</h1>
                <p>Create unique characters for your campaign instantly</p>
            </header>

            <div className={styles.controls}>
                <div className={styles.controlGroup}>
                    <label>Level</label>
                    <input
                        type="number"
                        min="1"
                        max="20"
                        value={level}
                        onChange={(e) => setLevel(parseInt(e.target.value) || 1)}
                    />
                </div>
                <button className="btn btn-gold" onClick={handleGenerate}>
                    <RefreshCw size={18} /> Generate NPC
                </button>
            </div>

            {npc && editedNpc && (
                <motion.div
                    className={styles.npcCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className={styles.cardHeader}>
                        {isEditing ? (
                            <input
                                className={styles.nameInput}
                                value={editedNpc.name}
                                onChange={(e) => updateField('name', e.target.value)}
                            />
                        ) : (
                            <h2>{npc.name}</h2>
                        )}

                        <div className={styles.actions}>
                            {isEditing ? (
                                <>
                                    <button className={styles.actionBtn} onClick={saveEdits} title="Save">
                                        <Check size={20} color="var(--success)" />
                                    </button>
                                    <button className={styles.actionBtn} onClick={cancelEdits} title="Cancel">
                                        <X size={20} color="var(--danger)" />
                                    </button>
                                </>
                            ) : (
                                <button className={styles.actionBtn} onClick={startEditing} title="Edit Stats">
                                    <Edit2 size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className={styles.subHeader}>
                        {isEditing ? (
                            <div className={styles.editRow}>
                                <select
                                    value={editedNpc.race}
                                    onChange={(e) => updateField('race', e.target.value)}
                                >
                                    <option value="Human">Human</option>
                                    <option value="Elf">Elf</option>
                                    <option value="Dwarf">Dwarf</option>
                                    <option value="Orc">Orc</option>
                                    <option value="Tiefling">Tiefling</option>
                                </select>
                                <select
                                    value={editedNpc.class}
                                    onChange={(e) => updateField('class', e.target.value)}
                                >
                                    <option value="Fighter">Fighter</option>
                                    <option value="Wizard">Wizard</option>
                                    <option value="Rogue">Rogue</option>
                                    <option value="Cleric">Cleric</option>
                                    <option value="Bard">Bard</option>
                                </select>
                                <select
                                    value={editedNpc.alignment}
                                    onChange={(e) => updateField('alignment', e.target.value)}
                                >
                                    <option value="lawful good">Lawful Good</option>
                                    <option value="chaotic evil">Chaotic Evil</option>
                                    {/* ... other alignments */}
                                </select>
                            </div>
                        ) : (
                            <p>Level {npc.level} {npc.race} {npc.class} • {npc.alignment}</p>
                        )}
                    </div>

                    <div className={styles.statsGrid}>
                        <div className={styles.statBlock}>
                            <Shield size={20} />
                            <label>AC</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={editedNpc.ac}
                                    onChange={(e) => updateField('ac', parseInt(e.target.value))}
                                    className={styles.statInput}
                                />
                            ) : (
                                <span>{npc.ac}</span>
                            )}
                        </div>
                        <div className={styles.statBlock}>
                            <Heart size={20} />
                            <label>HP</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={editedNpc.hp}
                                    onChange={(e) => updateField('hp', parseInt(e.target.value))}
                                    className={styles.statInput}
                                />
                            ) : (
                                <span>{npc.hp}</span>
                            )}
                        </div>
                        <div className={styles.statBlock}>
                            <Activity size={20} />
                            <label>Speed</label>
                            <span>30 ft</span>
                        </div>
                    </div>

                    <div className={styles.abilities}>
                        {Object.entries(editedNpc.abilityScores).map(([ability, score]) => (
                            <div key={ability} className={styles.abilityScore}>
                                <label>{ability.slice(0, 3).toUpperCase()}</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={score}
                                        onChange={(e) => updateAbility(ability as keyof AbilityScores, parseInt(e.target.value))}
                                        className={styles.scoreInput}
                                    />
                                ) : (
                                    <span className={styles.scoreValue}>{score}</span>
                                )}
                                <span className={styles.modValue}>{formatMod(getMod(score))}</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.detailsList}>
                        <div className={styles.detailItem}>
                            <h4>Description</h4>
                            <p>{npc.description}</p>
                        </div>
                        <div className={styles.detailItem}>
                            <h4>Personality</h4>
                            <p><strong>Trait:</strong> {npc.traits[0]}</p>
                            <p><strong>Ideal:</strong> {npc.ideal}</p>
                            <p><strong>Bond:</strong> {npc.bond}</p>
                            <p><strong>Flaw:</strong> {npc.flaw}</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
