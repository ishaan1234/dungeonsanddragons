'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search, Filter, BookOpen, Zap, Clock, MapPin } from 'lucide-react';
import { spells, getSpellsByLevel, getSpellsByClass, getSpellsBySchool, spellSchools, spellLevels, searchSpells } from '@/data/spells';
import { Spell, SpellSchool } from '@/types';
import styles from './page.module.css';

const schoolColors: Record<SpellSchool, string> = {
    abjuration: '#3b82f6',
    conjuration: '#a855f7',
    divination: '#f59e0b',
    enchantment: '#ec4899',
    evocation: '#ef4444',
    illusion: '#8b5cf6',
    necromancy: '#1f2937',
    transmutation: '#22c55e',
};

const schoolIcons: Record<SpellSchool, string> = {
    abjuration: '🛡️',
    conjuration: '✨',
    divination: '👁️',
    enchantment: '💫',
    evocation: '🔥',
    illusion: '🌀',
    necromancy: '💀',
    transmutation: '⚗️',
};

export default function SpellsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
    const [selectedSchool, setSelectedSchool] = useState<SpellSchool | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [expandedSpell, setExpandedSpell] = useState<string | null>(null);

    const filteredSpells = useMemo(() => {
        let result = [...spells];

        if (searchQuery) {
            result = searchSpells(searchQuery);
        }
        if (selectedLevel !== null) {
            result = result.filter(s => s.level === selectedLevel);
        }
        if (selectedSchool) {
            result = result.filter(s => s.school === selectedSchool);
        }
        if (selectedClass) {
            result = result.filter(s => s.classes.includes(selectedClass));
        }

        return result.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
    }, [searchQuery, selectedLevel, selectedSchool, selectedClass]);

    const classes = ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'warlock', 'wizard'];

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedLevel(null);
        setSelectedSchool(null);
        setSelectedClass(null);
    };

    return (
        <div className={styles.spellsPage}>
            <motion.header
                className={styles.pageHeader}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className={styles.headerContent}>
                    <h1><Sparkles size={32} /> Spellbook</h1>
                    <p>Browse and manage your magical arsenal</p>
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
                        placeholder="Search spells..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <label>Level</label>
                    <select
                        value={selectedLevel ?? ''}
                        onChange={(e) => setSelectedLevel(e.target.value ? parseInt(e.target.value) : null)}
                    >
                        <option value="">All Levels</option>
                        <option value="0">Cantrip</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
                            <option key={level} value={level}>{level}st Level</option>
                        ))}
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label>School</label>
                    <select
                        value={selectedSchool ?? ''}
                        onChange={(e) => setSelectedSchool(e.target.value as SpellSchool || null)}
                    >
                        <option value="">All Schools</option>
                        {spellSchools.map(school => (
                            <option key={school} value={school}>{school.charAt(0).toUpperCase() + school.slice(1)}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label>Class</label>
                    <select
                        value={selectedClass ?? ''}
                        onChange={(e) => setSelectedClass(e.target.value || null)}
                    >
                        <option value="">All Classes</option>
                        {classes.map(cls => (
                            <option key={cls} value={cls}>{cls.charAt(0).toUpperCase() + cls.slice(1)}</option>
                        ))}
                    </select>
                </div>

                {(searchQuery || selectedLevel !== null || selectedSchool || selectedClass) && (
                    <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
                        Clear Filters
                    </button>
                )}
            </motion.div>

            {/* Spells Count */}
            <div className={styles.resultsInfo}>
                Showing {filteredSpells.length} spell{filteredSpells.length !== 1 ? 's' : ''}
            </div>

            {/* Spells Grid */}
            <div className={styles.spellsGrid}>
                {filteredSpells.map((spell, index) => (
                    <motion.div
                        key={spell.id}
                        className={`${styles.spellCard} ${expandedSpell === spell.id ? styles.expanded : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        style={{ '--school-color': schoolColors[spell.school] } as React.CSSProperties}
                        onClick={() => setExpandedSpell(expandedSpell === spell.id ? null : spell.id)}
                    >
                        <div className={styles.spellHeader}>
                            <div className={styles.spellIcon}>{schoolIcons[spell.school]}</div>
                            <div className={styles.spellInfo}>
                                <h3>{spell.name}</h3>
                                <span className={styles.spellMeta}>
                                    {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`} • {spell.school}
                                </span>
                            </div>
                            {spell.concentration && (
                                <span className={styles.concentrationBadge}>C</span>
                            )}
                        </div>

                        {expandedSpell === spell.id && (
                            <motion.div
                                className={styles.spellDetails}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                            >
                                <div className={styles.spellStats}>
                                    <div className={styles.stat}>
                                        <Clock size={14} />
                                        <span>{spell.castingTime}</span>
                                    </div>
                                    <div className={styles.stat}>
                                        <MapPin size={14} />
                                        <span>{spell.range}</span>
                                    </div>
                                    <div className={styles.stat}>
                                        <Zap size={14} />
                                        <span>{spell.duration}</span>
                                    </div>
                                </div>

                                <div className={styles.components}>
                                    {spell.components.verbal && <span className={styles.component}>V</span>}
                                    {spell.components.somatic && <span className={styles.component}>S</span>}
                                    {spell.components.material && <span className={styles.component} title={spell.components.materialDescription}>M</span>}
                                </div>

                                <p className={styles.description}>{spell.description}</p>

                                {spell.higherLevels && (
                                    <p className={styles.higherLevels}>
                                        <strong>At Higher Levels:</strong> {spell.higherLevels}
                                    </p>
                                )}

                                {spell.damage && (
                                    <div className={styles.damageInfo}>
                                        <strong>Damage:</strong> {spell.damage.dice} {spell.damage.type}
                                    </div>
                                )}

                                <div className={styles.classList}>
                                    {spell.classes.map(cls => (
                                        <span key={cls} className={styles.classTag}>{cls}</span>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>

            {filteredSpells.length === 0 && (
                <div className={styles.emptyState}>
                    <Sparkles size={48} />
                    <p>No spells found matching your criteria</p>
                </div>
            )}
        </div>
    );
}
