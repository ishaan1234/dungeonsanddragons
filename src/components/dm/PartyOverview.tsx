'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Heart, Shield, Eye, Edit3, X,
    Zap, Sparkles, AlertTriangle, ChevronDown, ChevronUp
} from 'lucide-react';
import { Character, Condition } from '@/types';
import { SessionPlayer, SessionCombatant } from '@/lib/firebase';
import EditableCharacterSheet from '@/components/character/EditableCharacterSheet';
import styles from './PartyOverview.module.css';

interface PartyOverviewProps {
    players: SessionPlayer[];
    combatants: SessionCombatant[];
    playerCharacters: Record<string, Character>; // characterId -> Character data
    onUpdateCharacter?: (characterId: string, updates: Partial<Character>) => void;
    isExpanded: boolean;
    onToggleExpand: () => void;
}

export default function PartyOverview({
    players,
    combatants,
    playerCharacters,
    onUpdateCharacter,
    isExpanded,
    onToggleExpand,
}: PartyOverviewProps) {
    const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);

    // Get combatant data for a player if they're in combat
    const getCombatantForPlayer = (playerId: string): SessionCombatant | undefined => {
        return combatants.find(c => c.playerId === playerId && c.type === 'player');
    };

    // Get character data if available
    const getCharacterData = (characterId: string | null | undefined): Character | undefined => {
        if (!characterId) return undefined;
        return playerCharacters[characterId];
    };

    // Calculate HP percentage
    const getHpPercent = (current: number, max: number) => {
        return Math.max(0, Math.min(100, (current / max) * 100));
    };

    // Get HP bar color
    const getHpColor = (percent: number) => {
        if (percent > 50) return 'var(--success)';
        if (percent > 25) return 'var(--warning)';
        return 'var(--danger)';
    };

    const selectedCharacter = selectedCharacterId ? playerCharacters[selectedCharacterId] : null;

    if (!isExpanded) {
        return (
            <div className={styles.collapsed} onClick={onToggleExpand}>
                <Users size={16} />
                <span>Party ({players.length})</span>
                <ChevronDown size={14} />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerTitle}>
                    <Users size={18} />
                    <h3>Party Overview</h3>
                    <span className={styles.playerCount}>{players.length} players</span>
                </div>
                <button className={styles.collapseBtn} onClick={onToggleExpand}>
                    <ChevronUp size={16} />
                </button>
            </div>

            <div className={styles.playerGrid}>
                {players.map((player) => {
                    const combatant = getCombatantForPlayer(player.odid);
                    const character = getCharacterData(player.characterId);
                    const hpPercent = combatant
                        ? getHpPercent(combatant.currentHitPoints, combatant.maxHitPoints)
                        : character
                            ? getHpPercent(character.currentHitPoints, character.maxHitPoints)
                            : 100;

                    return (
                        <div key={player.odid} className={styles.playerCard}>
                            <div className={styles.playerHeader}>
                                <div className={styles.playerAvatar}>
                                    {(player.characterName || player.odisplayName).charAt(0).toUpperCase()}
                                </div>
                                <div className={styles.playerInfo}>
                                    <span className={styles.characterName}>
                                        {player.characterName || 'No Character'}
                                    </span>
                                    <span className={styles.playerName}>
                                        {player.odisplayName}
                                    </span>
                                </div>
                                {character && (
                                    <button
                                        className={styles.viewBtn}
                                        onClick={() => {
                                            setSelectedCharacterId(player.characterId!);
                                            setEditMode(false);
                                        }}
                                        title="View character sheet"
                                    >
                                        <Eye size={14} />
                                    </button>
                                )}
                            </div>

                            {/* Stats Row */}
                            {(combatant || character) && (
                                <div className={styles.statsRow}>
                                    {/* HP */}
                                    <div className={styles.hpSection}>
                                        <Heart size={12} className={styles.hpIcon} />
                                        <span className={styles.hpText}>
                                            {combatant?.currentHitPoints ?? character?.currentHitPoints ?? '?'}/
                                            {combatant?.maxHitPoints ?? character?.maxHitPoints ?? '?'}
                                        </span>
                                        <div className={styles.hpBar}>
                                            <div
                                                className={styles.hpFill}
                                                style={{
                                                    width: `${hpPercent}%`,
                                                    backgroundColor: getHpColor(hpPercent),
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* AC */}
                                    <div className={styles.statBadge}>
                                        <Shield size={10} />
                                        <span>{combatant?.armorClass ?? character?.armorClass ?? '?'}</span>
                                    </div>

                                    {/* Level/Class */}
                                    {character && (
                                        <div className={styles.classBadge}>
                                            <span>{character.class} {character.level}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Conditions */}
                            {combatant && combatant.conditions.length > 0 && (
                                <div className={styles.conditionsRow}>
                                    {combatant.conditions.map((condition) => (
                                        <span key={condition} className={styles.conditionBadge}>
                                            {condition}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Passive Stats */}
                            {character && (
                                <div className={styles.passivesRow}>
                                    <div className={styles.passiveStat} title="Passive Perception">
                                        <Eye size={10} />
                                        <span>
                                            {10 + Math.floor((character.abilityScores.wisdom - 10) / 2) +
                                                (character.skillProficiencies.includes('perception') ? character.proficiencyBonus : 0)}
                                        </span>
                                    </div>
                                    <div className={styles.passiveStat} title="Passive Investigation">
                                        <Sparkles size={10} />
                                        <span>
                                            {10 + Math.floor((character.abilityScores.intelligence - 10) / 2) +
                                                (character.skillProficiencies.includes('investigation') ? character.proficiencyBonus : 0)}
                                        </span>
                                    </div>
                                    <div className={styles.passiveStat} title="Speed">
                                        <Zap size={10} />
                                        <span>{character.speed} ft</span>
                                    </div>
                                </div>
                            )}

                            {/* No character data warning */}
                            {!character && !combatant && player.characterId && (
                                <div className={styles.noDataWarning}>
                                    <AlertTriangle size={12} />
                                    <span>Character data not synced</span>
                                </div>
                            )}
                        </div>
                    );
                })}

                {players.length === 0 && (
                    <div className={styles.emptyState}>
                        <Users size={32} />
                        <p>No players have joined yet</p>
                    </div>
                )}
            </div>

            {/* Character Sheet Modal */}
            <AnimatePresence>
                {selectedCharacter && (
                    <EditableCharacterSheet
                        character={selectedCharacter}
                        onUpdate={(updates) => {
                            if (onUpdateCharacter && selectedCharacterId) {
                                onUpdateCharacter(selectedCharacterId, updates);
                            }
                        }}
                        onClose={() => {
                            setSelectedCharacterId(null);
                            setEditMode(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
