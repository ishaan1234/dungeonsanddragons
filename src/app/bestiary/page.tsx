'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Skull, Search, Heart, Shield, Zap, Eye, Plus } from 'lucide-react';
import { monsters, getMonstersByType, getMonstersByCR, searchMonsters, creatureTypes, formatCR } from '@/data/monsters';
import { Monster, CreatureType, Size } from '@/types';
import styles from './page.module.css';

const sizeOrder: Size[] = ['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan'];

const typeColors: Record<string, string> = {
    aberration: '#9333ea',
    beast: '#84cc16',
    celestial: '#fbbf24',
    construct: '#6b7280',
    dragon: '#ef4444',
    elemental: '#06b6d4',
    fey: '#ec4899',
    fiend: '#dc2626',
    giant: '#f97316',
    humanoid: '#3b82f6',
    monstrosity: '#8b5cf6',
    ooze: '#22c55e',
    plant: '#16a34a',
    undead: '#1f2937',
};

export default function BestiaryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<CreatureType | null>(null);
    const [selectedCR, setSelectedCR] = useState<number | null>(null);
    const [expandedMonster, setExpandedMonster] = useState<string | null>(null);

    const filteredMonsters = useMemo(() => {
        let result = [...monsters];

        if (searchQuery) {
            result = searchMonsters(searchQuery);
        }
        if (selectedType) {
            result = result.filter(m => m.type === selectedType);
        }
        if (selectedCR !== null) {
            result = result.filter(m => m.challengeRating === selectedCR);
        }

        return result.sort((a, b) => a.challengeRating - b.challengeRating || a.name.localeCompare(b.name));
    }, [searchQuery, selectedType, selectedCR]);

    const crOptions = [0, 0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20];

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedType(null);
        setSelectedCR(null);
    };

    const getAbilityMod = (score: number) => {
        const mod = Math.floor((score - 10) / 2);
        return mod >= 0 ? `+${mod}` : mod.toString();
    };

    return (
        <div className={styles.bestiaryPage}>
            <motion.header
                className={styles.pageHeader}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className={styles.headerContent}>
                    <h1><Skull size={32} /> Bestiary</h1>
                    <p>Creatures and monsters of the realm</p>
                </div>
            </motion.header>

            {/* Filters */}
            <motion.div
                className={styles.filters}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search creatures..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <label>Type</label>
                    <select
                        value={selectedType ?? ''}
                        onChange={(e) => setSelectedType(e.target.value as CreatureType || null)}
                    >
                        <option value="">All Types</option>
                        {creatureTypes.map(type => (
                            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label>Challenge Rating</label>
                    <select
                        value={selectedCR ?? ''}
                        onChange={(e) => setSelectedCR(e.target.value ? parseFloat(e.target.value) : null)}
                    >
                        <option value="">All CRs</option>
                        {crOptions.map(cr => (
                            <option key={cr} value={cr}>CR {formatCR(cr)}</option>
                        ))}
                    </select>
                </div>

                {(searchQuery || selectedType || selectedCR !== null) && (
                    <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
                        Clear Filters
                    </button>
                )}
            </motion.div>

            {/* Results Info */}
            <div className={styles.resultsInfo}>
                Showing {filteredMonsters.length} creature{filteredMonsters.length !== 1 ? 's' : ''}
            </div>

            {/* Monsters Grid */}
            <div className={styles.monstersGrid}>
                {filteredMonsters.map((monster, index) => (
                    <motion.div
                        key={monster.id}
                        className={`${styles.monsterCard} ${expandedMonster === monster.id ? styles.expanded : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        style={{ '--type-color': typeColors[monster.type] || 'var(--primary-500)' } as React.CSSProperties}
                        onClick={() => setExpandedMonster(expandedMonster === monster.id ? null : monster.id)}
                    >
                        <div className={styles.monsterHeader}>
                            <div className={styles.monsterAvatar}>
                                {monster.name.charAt(0)}
                            </div>
                            <div className={styles.monsterInfo}>
                                <h3>{monster.name}</h3>
                                <span className={styles.monsterMeta}>
                                    {monster.size} {monster.type} • CR {formatCR(monster.challengeRating)}
                                </span>
                            </div>
                            <div className={styles.crBadge}>
                                {formatCR(monster.challengeRating)}
                            </div>
                        </div>

                        <div className={styles.quickStats}>
                            <div className={styles.stat}>
                                <Heart size={14} />
                                <span>{monster.hitPoints}</span>
                            </div>
                            <div className={styles.stat}>
                                <Shield size={14} />
                                <span>{monster.armorClass}</span>
                            </div>
                            <div className={styles.stat}>
                                <Zap size={14} />
                                <span>{monster.speed.walk || 0} ft</span>
                            </div>
                        </div>

                        {expandedMonster === monster.id && (
                            <motion.div
                                className={styles.monsterDetails}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                            >
                                {/* Ability Scores */}
                                <div className={styles.abilityScores}>
                                    {Object.entries(monster.abilityScores).map(([ability, score]) => (
                                        <div key={ability} className={styles.ability}>
                                            <span className={styles.abilityName}>{ability.slice(0, 3).toUpperCase()}</span>
                                            <span className={styles.abilityScore}>{score}</span>
                                            <span className={styles.abilityMod}>({getAbilityMod(score)})</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Traits */}
                                {monster.traits && monster.traits.length > 0 && (
                                    <div className={styles.section}>
                                        <h4>Traits</h4>
                                        {monster.traits.map((trait, i) => (
                                            <div key={i} className={styles.traitItem}>
                                                <strong>{trait.name}.</strong> {trait.description}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Actions */}
                                {monster.actions && monster.actions.length > 0 && (
                                    <div className={styles.section}>
                                        <h4>Actions</h4>
                                        {monster.actions.map((action, i) => (
                                            <div key={i} className={styles.actionItem}>
                                                <strong>{action.name}.</strong> {action.description}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Legendary Actions */}
                                {monster.legendaryActions && monster.legendaryActions.length > 0 && (
                                    <div className={styles.section}>
                                        <h4>Legendary Actions</h4>
                                        {monster.legendaryActions.map((action, i) => (
                                            <div key={i} className={styles.actionItem}>
                                                <strong>{action.name}.</strong> {action.description}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* XP */}
                                <div className={styles.xpInfo}>
                                    <span>XP: {monster.experiencePoints.toLocaleString()}</span>
                                </div>

                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={(e) => { e.stopPropagation(); /* Add to encounter */ }}
                                >
                                    <Plus size={14} /> Add to Encounter
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>

            {filteredMonsters.length === 0 && (
                <div className={styles.emptyState}>
                    <Skull size={48} />
                    <p>No creatures found matching your criteria</p>
                </div>
            )}
        </div>
    );
}
