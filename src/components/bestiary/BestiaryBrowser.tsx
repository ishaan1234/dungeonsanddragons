import { useState, useMemo } from 'react';
import { Skull, Search, Heart, Shield, Zap, Plus, ChevronRight } from 'lucide-react';
import { monsters, searchMonsters, creatureTypes, formatCR } from '@/data/monsters';
import { Monster, CreatureType, Size } from '@/types';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import styles from './BestiaryBrowser.module.css';

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

interface BestiaryBrowserProps {
    onAddMonster: (monster: Monster, count: number) => void;
    onClose: () => void;
}

export default function BestiaryBrowser({ onAddMonster, onClose }: BestiaryBrowserProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<CreatureType | null>(null);
    const [selectedCR, setSelectedCR] = useState<number | null>(null);
    const [expandedMonster, setExpandedMonster] = useState<string | null>(null);
    const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
    const [count, setCount] = useState(1);

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

    const getAbilityMod = (score: number) => {
        const mod = Math.floor((score - 10) / 2);
        return mod >= 0 ? `+${mod}` : mod.toString();
    };

    const handleAdd = () => {
        if (selectedMonster) {
            onAddMonster(selectedMonster, count);
            setSelectedMonster(null);
            setCount(1);
        }
    };

    return (
        <Sheet open onOpenChange={() => onClose()}>
            <SheetContent side="right" className={styles.sheetContent}>
                <SheetHeader className={styles.sheetHeader}>
                    <SheetTitle className={styles.sheetTitle}>
                        <Skull size={24} /> Bestiary
                    </SheetTitle>
                </SheetHeader>

                <div className={styles.content}>
                    {/* Sidebar / List */}
                    <div className={styles.listSection}>
                        <div className={styles.filters}>
                            <div className={styles.searchBox}>
                                <Search size={16} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className={styles.filterRow}>
                                <select
                                    value={selectedType ?? ''}
                                    onChange={(e) => setSelectedType(e.target.value as CreatureType || null)}
                                >
                                    <option value="">All Types</option>
                                    {creatureTypes.map(type => (
                                        <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                                    ))}
                                </select>
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
                        </div>

                        <div className={styles.monsterList}>
                            {filteredMonsters.map(monster => (
                                <div
                                    key={monster.id}
                                    className={`${styles.monsterRow} ${selectedMonster?.id === monster.id ? styles.selected : ''}`}
                                    onClick={() => setSelectedMonster(monster)}
                                >
                                    <div className={styles.monsterRowInfo}>
                                        <span className={styles.name}>{monster.name}</span>
                                        <span className={styles.meta}>{monster.type} • CR {formatCR(monster.challengeRating)}</span>
                                    </div>
                                    <ChevronRight size={16} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Details Panel */}
                    <div className={styles.detailsSection}>
                        {selectedMonster ? (
                            <div className={styles.monsterDetails}>
                                <div className={styles.detailsHeader}>
                                    <h3>{selectedMonster.name}</h3>
                                    <div className={styles.crBadge}>CR {formatCR(selectedMonster.challengeRating)}</div>
                                </div>
                                <div className={styles.detailsMeta}>
                                    {selectedMonster.size} {selectedMonster.type}, {selectedMonster.alignment}
                                </div>

                                <div className={styles.statsGrid}>
                                    <div className={styles.statBox}>
                                        <Shield size={16} />
                                        <span>AC {selectedMonster.armorClass}</span>
                                    </div>
                                    <div className={styles.statBox}>
                                        <Heart size={16} />
                                        <span>HP {selectedMonster.hitPoints}</span>
                                    </div>
                                    <div className={styles.statBox}>
                                        <Zap size={16} />
                                        <span>{selectedMonster.speed.walk || 30} ft</span>
                                    </div>
                                </div>

                                <div className={styles.abilityScores}>
                                    {Object.entries(selectedMonster.abilityScores).map(([ability, score]) => (
                                        <div key={ability} className={styles.ability}>
                                            <span className={styles.abilityLabel}>{ability.slice(0, 3).toUpperCase()}</span>
                                            <span className={styles.abilityScore}>{score}</span>
                                            <span className={styles.abilityMod}>({getAbilityMod(score as number)})</span>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.divider} />

                                <div className={styles.actions}>
                                    <label>Count:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={count}
                                        onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                                        className={styles.countInput}
                                    />
                                    <Button onClick={handleAdd}>
                                        <Plus size={16} /> Add to Encounter
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <Skull size={48} />
                                <p>Select a monster to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
