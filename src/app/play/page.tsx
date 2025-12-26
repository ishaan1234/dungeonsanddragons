'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, Users, Crown, Copy, Check, LogOut, X,
    Swords, MessageCircle, Settings, Plus,
    Shield, Heart, ChevronRight, Bell, User, Save, Clock, Trash2
} from 'lucide-react';
import { createSession, joinSession, GameSession, signInAnon, MapState } from '@/lib/firebase';
import { useSession } from '@/contexts/SessionContext';
import VoiceChat from '@/components/multiplayer/VoiceChat';
import TextChat from '@/components/multiplayer/TextChat';
import BestiaryBrowser from '@/components/bestiary/BestiaryBrowser';
import SpellCaster, { SpellCastResult } from '@/components/spells/SpellCaster';
import { Monster } from '@/types';
import { SessionCombatant } from '@/lib/firebase';
import { Sparkles, Skull, AlertTriangle, Map, Store } from 'lucide-react';
import styles from './page.module.css';
import ConditionBadge from '@/components/combat/ConditionBadge';
import ConditionPicker from '@/components/combat/ConditionPicker';
import CharacterCreator from '@/components/character/CharacterCreator';
import CharacterSheetPanel from '@/components/character/CharacterSheetPanel';
import EditableCharacterSheet from '@/components/character/EditableCharacterSheet';
import QuickActionsBar from '@/components/play/QuickActionsBar';
import SpellCreator from '@/components/spells/SpellCreator';
import BattleMap from '@/components/map/BattleMap';
import MapControls from '@/components/map/MapControls';
import Shop from '@/components/shop/Shop';
import QuickDiceRoller from '@/components/dice/QuickDiceRoller';
import { useAppStore } from '@/stores/appStore';
import { Character, Condition } from '@/types';
import { Shop as ShopType, ShopItem } from '@/lib/firebase';

// Recent session type for "Continue Session" feature
interface RecentSession {
    code: string;
    name: string;
    role: 'dm' | 'player';
    lastPlayed: number;
    characterId?: string;
    characterName?: string;
}

export default function PlayPage() {
    const [view, setView] = useState<'menu' | 'create' | 'join' | 'lobby' | 'game'>('menu');
    const [sessionName, setSessionName] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [characterName, setCharacterName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSpellCaster, setShowSpellCaster] = useState(false);
    const [showBestiary, setShowBestiary] = useState(false);
    const [showSpellCreator, setShowSpellCreator] = useState(false);
    const [showCharCreator, setShowCharCreator] = useState(false);
    const [showCharacterSheet, setShowCharacterSheet] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [showShop, setShowShop] = useState(false);
    const [quickActionsExpanded, setQuickActionsExpanded] = useState(true);
    const [brushSize, setBrushSize] = useState(1);
    const [selectedCharId, setSelectedCharId] = useState<string>('');
    const { characters } = useAppStore();
    const [myCharacter, setMyCharacter] = useState<Character | null>(null);
    const [conditionPickerTarget, setConditionPickerTarget] = useState<{ id: string; name: string; conditions: string[] } | null>(null);
    const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);

    const {
        session,
        sessionCode,
        playerId,
        playerName,
        isDM,
        isConnected,
        setSessionCode,
        setPlayerId,
        setPlayerName,
        sendMessage,
        sendRoll,
        startGame,
        pauseGame,
        leave,
        updateCombatantDeathSaves,
        addCombatant,
        updateCombatantHP,
        toggleCondition,
        updateMap,
        toggleCell,
        revealAll,
        hideAll,
        setShop,
    } = useSession();

    // Initialize player ID on mount
    useEffect(() => {
        const initPlayer = async () => {
            if (!playerId) {
                const id = await signInAnon();
                setPlayerId(id);
            }
        };
        initPlayer();
    }, [playerId, setPlayerId]);

    // Load recent sessions from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('dnd_recent_sessions');
            if (saved) {
                try {
                    setRecentSessions(JSON.parse(saved));
                } catch (e) {
                    console.error('Failed to parse recent sessions:', e);
                }
            }
        }
    }, []);

    // Save recent sessions to localStorage
    const saveRecentSession = useCallback((sessionData: RecentSession) => {
        setRecentSessions(prev => {
            // Remove existing entry for this session if it exists
            const filtered = prev.filter(s => s.code !== sessionData.code);
            // Add new entry at the beginning, keep only last 5
            const updated = [sessionData, ...filtered].slice(0, 5);
            localStorage.setItem('dnd_recent_sessions', JSON.stringify(updated));
            return updated;
        });
    }, []);

    // Remove a recent session
    const removeRecentSession = useCallback((code: string) => {
        setRecentSessions(prev => {
            const updated = prev.filter(s => s.code !== code);
            localStorage.setItem('dnd_recent_sessions', JSON.stringify(updated));
            return updated;
        });
    }, []);

    // Handle session state changes
    useEffect(() => {
        if (session) {
            if (session.status === 'lobby') {
                setView('lobby');
            } else if (session.status === 'playing') {
                setView('game');
            } else if (session.status === 'paused') {
                // Session is paused/saved - can rejoin later
                setView('game');
            }
        }
    }, [session?.status]);

    // Keep condition picker in sync with session changes
    useEffect(() => {
        if (conditionPickerTarget && session) {
            const combatant = session.combat.combatants.find(c => c.id === conditionPickerTarget.id);
            if (combatant) {
                setConditionPickerTarget({
                    id: combatant.id,
                    name: combatant.name,
                    conditions: combatant.conditions || []
                });
            }
        }
    }, [session?.combat.combatants]);

    const handleCreateSession = async () => {
        if (!sessionName.trim() || !playerId) return;
        setLoading(true);
        setError(null);

        try {
            const code = await createSession(playerId, playerName, sessionName);
            setSessionCode(code);
            await joinSession(code, playerId, playerName);
        } catch (err) {
            console.error('Create Session Error:', err);
            setError('Failed to create session. Please try again.');
        }
        setLoading(false);
    };

    const handleJoinSession = async () => {
        if (!joinCode.trim() || !playerId) return;
        setLoading(true);
        setError(null);

        try {
            const cId = selectedCharId || undefined;
            // If selecting a character, use that name. If manual, use input name. If empty, fallback to player name.
            let cName = characterName;
            if (!cName && !selectedCharId) {
                cName = playerName;
            }

            const result = await joinSession(joinCode, playerId, playerName, cId, cName);
            if (result) {
                setSessionCode(joinCode.toUpperCase());
                // Go directly to appropriate view based on session status
                // This allows players to join sessions already in progress
                if (result.status === 'playing') {
                    setView('game');
                } else if (result.status === 'lobby') {
                    setView('lobby');
                }
            } else {
                setError('Session not found. Check the code and try again.');
            }
        } catch (err) {
            console.error('Join Session Error:', err);
            setError('Failed to join session. Please try again.');
        }
        setLoading(false);
    };

    const copyCode = () => {
        if (sessionCode) {
            navigator.clipboard.writeText(sessionCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleLeave = async () => {
        await leave();
        setView('menu');
    };

    // Save & Exit - DM pauses the game, everyone can rejoin later
    const handleSaveAndExit = async () => {
        if (!session || !sessionCode) return;

        // Save to recent sessions
        saveRecentSession({
            code: sessionCode,
            name: session.name,
            role: isDM ? 'dm' : 'player',
            lastPlayed: Date.now(),
            characterId: selectedCharId || undefined,
            characterName: myCharacter?.name || characterName || undefined,
        });

        // DM pauses the game so others can rejoin later
        if (isDM) {
            await pauseGame();
        }

        // Clear current session
        setSessionCode(null);
        setView('menu');
    };

    // Rejoin a saved session
    const handleRejoinSession = async (recentSession: RecentSession) => {
        if (!playerId) return;
        setLoading(true);
        setError(null);

        try {
            // Set character if we had one
            if (recentSession.characterId) {
                const char = characters.find(c => c.id === recentSession.characterId);
                if (char) {
                    setSelectedCharId(char.id);
                    setMyCharacter(char);
                    setCharacterName(char.name);
                }
            }

            const result = await joinSession(
                recentSession.code,
                playerId,
                playerName,
                recentSession.characterId,
                recentSession.characterName
            );

            if (result) {
                setSessionCode(recentSession.code);
                // Update last played time
                saveRecentSession({
                    ...recentSession,
                    lastPlayed: Date.now(),
                });

                if (result.status === 'playing' || result.status === 'paused') {
                    setView('game');
                } else if (result.status === 'lobby') {
                    setView('lobby');
                }
            } else {
                setError('Session not found or has ended.');
                removeRecentSession(recentSession.code);
            }
        } catch (err) {
            console.error('Rejoin Session Error:', err);
            setError('Failed to rejoin session.');
        }
        setLoading(false);
    };

    const handleCastSpell = async (result: SpellCastResult) => {
        const { damage, healing, targetIds } = result;

        // Apply effects to targets
        if (targetIds.length > 0 && (damage || healing)) {
            const updates = targetIds.map(id => {
                if (damage) return updateCombatantHP(id, -damage.total);
                if (healing) return updateCombatantHP(id, healing.total);
                return Promise.resolve();
            });
            await Promise.all(updates);
        }

        await sendMessage(result.description);
        setShowSpellCaster(false);
    };

    const handleAddMonster = async (monster: Monster, count: number) => {
        for (let i = 0; i < count; i++) {
            const combatant: SessionCombatant = {
                id: `monster_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 5)}`,
                name: count > 1 ? `${monster.name} ${i + 1}` : monster.name,
                type: 'monster',
                initiative: Math.floor(Math.random() * 20) + 1 + Math.floor((monster.abilityScores.dexterity - 10) / 2),
                armorClass: monster.armorClass,
                maxHitPoints: monster.hitPoints,
                currentHitPoints: monster.hitPoints,
                conditions: [],
                deathSaves: { successes: 0, failures: 0 }
            };
            await addCombatant(combatant);
        }
        setShowBestiary(false);
        setShowBestiary(false);
    };

    const handleAttack = async (targetId: string, targetName: string) => {
        // Simple attack roll for now
        // In the future, we can open an attack modal with weapon selection
        const attackRoll = Math.floor(Math.random() * 20) + 1;
        const modifier = myCharacter ? Math.floor((Math.max(myCharacter.abilityScores.strength, myCharacter.abilityScores.dexterity) - 10) / 2) : 0;
        const total = attackRoll + modifier;

        await sendMessage(`/me attacks ${targetName}: rolled ${attackRoll} + ${modifier} = ${total}`);
    };

    const handleCreateMap = async (width: number, height: number, cellSize: number) => {
        // Initialize fog grid with all cells hidden
        const fogGrid: boolean[][] = Array(height).fill(null).map(() =>
            Array(width).fill(false)
        );

        const newMap: MapState = {
            gridWidth: width,
            gridHeight: height,
            cellSize,
            fogGrid,
        };

        await updateMap(newMap);
    };

    const handleCellClick = async (x: number, y: number) => {
        await toggleCell(x, y);
    };

    // Character update handler for editable character sheet
    const handleCharacterUpdate = useCallback((updates: Partial<Character>) => {
        if (!myCharacter) return;
        const updatedCharacter = { ...myCharacter, ...updates };
        setMyCharacter(updatedCharacter);
        // Also update in the store
        const { updateCharacter } = useAppStore.getState();
        updateCharacter(updatedCharacter.id, updatedCharacter);
    }, [myCharacter]);

    // QuickActionsBar handlers
    const handleQuickHPChange = useCallback((hp: number) => {
        if (!myCharacter) return;
        const updated = {
            ...myCharacter,
            currentHitPoints: hp
        };
        handleCharacterUpdate(updated);
    }, [myCharacter, handleCharacterUpdate]);

    const handleQuickConditionAdd = useCallback((condition: string) => {
        if (!myCharacter) return;
        const currentConditions = myCharacter.conditions || [];
        const conditionTyped = condition as Condition;
        if (!currentConditions.includes(conditionTyped)) {
            const updated = {
                ...myCharacter,
                conditions: [...currentConditions, conditionTyped]
            };
            handleCharacterUpdate(updated);
        }
    }, [myCharacter, handleCharacterUpdate]);

    const handleQuickConditionRemove = useCallback((condition: string) => {
        if (!myCharacter) return;
        const updated = {
            ...myCharacter,
            conditions: (myCharacter.conditions || []).filter(c => c !== condition)
        };
        handleCharacterUpdate(updated);
    }, [myCharacter, handleCharacterUpdate]);

    const handleQuickDeathSaveChange = useCallback((type: 'success' | 'failure', count: number) => {
        if (!myCharacter) return;
        const updated = {
            ...myCharacter,
            deathSaves: {
                ...myCharacter.deathSaves,
                [type === 'success' ? 'successes' : 'failures']: count
            }
        };
        handleCharacterUpdate(updated);
    }, [myCharacter, handleCharacterUpdate]);

    // Render based on view state
    if (view === 'menu') {
        return (
            <div className={styles.playPage}>
                <motion.div
                    className={styles.menuContainer}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className={styles.menuHeader}>
                        <Play size={48} className={styles.menuIcon} />
                        <h1>Play Together</h1>
                        <p>Start or join a D&D session with friends</p>
                    </div>

                    <div className={styles.menuOptions}>
                        <button
                            className={styles.menuBtn}
                            onClick={() => setView('create')}
                        >
                            <div className={styles.btnIcon}>
                                <Crown size={24} />
                            </div>
                            <div className={styles.btnContent}>
                                <h3>Create Session</h3>
                                <p>Start as Dungeon Master and invite players</p>
                            </div>
                            <ChevronRight size={20} />
                        </button>

                        <button
                            className={styles.menuBtn}
                            onClick={() => setView('join')}
                        >
                            <div className={styles.btnIcon}>
                                <Users size={24} />
                            </div>
                            <div className={styles.btnContent}>
                                <h3>Join Session</h3>
                                <p>Enter a session code to join as a player</p>
                            </div>
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Recent Sessions - Continue where you left off */}
                    {recentSessions.length > 0 && (
                        <div className={styles.recentSessions}>
                            <h3><Clock size={18} /> Recent Sessions</h3>
                            <div className={styles.recentList}>
                                {recentSessions.map(rs => (
                                    <div key={rs.code} className={styles.recentCard}>
                                        <button
                                            className={styles.recentBtn}
                                            onClick={() => handleRejoinSession(rs)}
                                            disabled={loading}
                                        >
                                            <div className={styles.recentIcon}>
                                                {rs.role === 'dm' ? <Crown size={18} /> : <User size={18} />}
                                            </div>
                                            <div className={styles.recentInfo}>
                                                <span className={styles.recentName}>{rs.name}</span>
                                                <span className={styles.recentMeta}>
                                                    {rs.role === 'dm' ? 'Dungeon Master' : rs.characterName || 'Player'}
                                                    {' • '}
                                                    {new Date(rs.lastPlayed).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <span className={styles.recentCode}>{rs.code}</span>
                                        </button>
                                        <button
                                            className={styles.recentDelete}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeRecentSession(rs.code);
                                            }}
                                            title="Remove from history"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {error && <div className={styles.error}>{error}</div>}
                        </div>
                    )}
                </motion.div>
            </div>
        );
    }

    if (view === 'create') {
        return (
            <div className={styles.playPage}>
                <motion.div
                    className={styles.formContainer}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <button className={styles.backBtn} onClick={() => setView('menu')}>
                        ← Back
                    </button>

                    <h2><Crown size={24} /> Create Session</h2>
                    <p>You'll be the Dungeon Master for this session</p>

                    <div className={styles.formGroup}>
                        <label>Your Name</label>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="Dungeon Master"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Session Name</label>
                        <input
                            type="text"
                            value={sessionName}
                            onChange={(e) => setSessionName(e.target.value)}
                            placeholder="Lost Mine of Phandelver"
                        />
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <button
                        className="btn btn-gold btn-lg"
                        onClick={handleCreateSession}
                        disabled={loading || !sessionName.trim()}
                    >
                        {loading ? 'Creating...' : 'Create Session'}
                    </button>
                </motion.div>
            </div>
        );
    }

    if (view === 'join') {
        return (
            <div className={styles.playPage}>
                <motion.div
                    className={styles.formContainer}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <button className={styles.backBtn} onClick={() => setView('menu')}>
                        ← Back
                    </button>

                    <h2><Users size={24} /> Join Session</h2>
                    <p>Enter the session code from your DM</p>

                    {/* Session Code Input - Primary Requirement */}
                    <div className={styles.formGroup}>
                        <label>Session Code</label>
                        <input
                            type="text"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                            placeholder="ABC123"
                            maxLength={6}
                            className={styles.codeInput}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Your Name</label>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="Your Name (e.g. John)"
                        />
                    </div>

                    <div className={styles.divider}></div>

                    <h3>Who are you playing?</h3>

                    {!selectedCharId ? (
                        <div className={styles.characterSelection}>
                            {characters.length > 0 && (
                                <div className={styles.existingChars}>
                                    <label>Select from Libary</label>
                                    <select
                                        className={styles.charSelect}
                                        onChange={(e) => {
                                            const char = characters.find(c => c.id === e.target.value);
                                            if (char) {
                                                setSelectedCharId(char.id);
                                                setMyCharacter(char);
                                                setCharacterName(char.name);
                                            }
                                        }}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>-- Choose Character --</option>
                                        {characters.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} - {c.class} {c.level}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <button
                                className={`${styles.selectionBtn} ${styles.createBtn}`}
                                onClick={() => setShowCharCreator(true)}
                            >
                                <div className={styles.btnIcon}><Plus size={20} /></div>
                                <div>
                                    <strong>Create New Character</strong>
                                    <span>Build a hero from scratch</span>
                                </div>
                            </button>

                            <div className={styles.manualEntry}>
                                <div className={styles.orDivider}><span>OR</span></div>
                                <label>Join as Guest / Manual Entry</label>
                                <input
                                    type="text"
                                    value={characterName}
                                    onChange={(e) => setCharacterName(e.target.value)}
                                    placeholder="Character Name (e.g. Gandalf)"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className={styles.selectedCharCard}>
                            <div className={styles.selectedCharInfo}>
                                <div className={styles.charAvatar}>
                                    {myCharacter?.name.charAt(0)}
                                </div>
                                <div>
                                    <strong>{myCharacter?.name}</strong>
                                    <span>{myCharacter?.race} {myCharacter?.class} • Lvl {myCharacter?.level}</span>
                                </div>
                            </div>
                            <button
                                className={styles.removeCharBtn}
                                onClick={() => {
                                    setSelectedCharId('');
                                    setMyCharacter(null);
                                    setCharacterName('');
                                }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    <AnimatePresence>
                        {showCharCreator && (
                            <CharacterCreator
                                onClose={() => setShowCharCreator(false)}
                                onCreate={(newChar) => {
                                    setSelectedCharId(newChar.id);
                                    setMyCharacter(newChar);
                                    setCharacterName(newChar.name);
                                }}
                            />
                        )}
                    </AnimatePresence>

                    {error && <div className={styles.error}>{error}</div>}

                    <button
                        className="btn btn-gold btn-lg"
                        style={{ width: '100%', marginTop: '1.5rem' }}
                        onClick={handleJoinSession}
                        disabled={loading || !joinCode.trim() || joinCode.length < 6}
                    >
                        {loading ? 'Joining...' : 'Join Session'}
                    </button>
                </motion.div>
            </div>
        );
    }

    if (view === 'lobby' && session) {
        return (
            <div className={styles.playPage}>
                <motion.div
                    className={styles.lobbyContainer}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className={styles.lobbyHeader}>
                        <h2>{session.name}</h2>
                        <div className={styles.sessionCode} onClick={copyCode}>
                            <span>Session Code:</span>
                            <strong>{sessionCode}</strong>
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                        </div>
                    </div>

                    <div className={styles.lobbyContent}>
                        <div className={styles.playersList}>
                            <h3><Users size={18} /> Players ({session.players.length + 1})</h3>

                            <div className={styles.playerCard}>
                                <div className={styles.playerAvatar}>
                                    <Crown size={16} />
                                </div>
                                <div className={styles.playerInfo}>
                                    <span className={styles.playerName}>{session.dmName}</span>
                                    <span className={styles.playerRole}>Dungeon Master</span>
                                </div>
                            </div>

                            {session.players.map(player => (
                                <div key={player.odid} className={styles.playerCard}>
                                    <div className={styles.playerAvatar}>
                                        {player.odisplayName.charAt(0)}
                                    </div>
                                    <div className={styles.playerInfo}>
                                        <span className={styles.playerName}>{player.odisplayName}</span>
                                        <span className={styles.playerRole}>
                                            {player.characterName || 'Player'}
                                        </span>
                                    </div>
                                    {player.isReady && (
                                        <span className={styles.readyBadge}>Ready</span>
                                    )}
                                </div>
                            ))}

                            <p className={styles.hint}>
                                Share the session code with your friends to invite them!
                            </p>
                        </div>

                        <div className={styles.voiceChatArea}>
                            <VoiceChat
                                sessionCode={sessionCode || ''}
                                playerId={playerId || ''}
                                playerName={playerName}
                                participants={[
                                    { id: session.dmId, name: session.dmName },
                                    ...session.players
                                        .filter(p => p.odid !== session.dmId)
                                        .map(p => ({ id: p.odid, name: p.odisplayName }))
                                ]}
                            />
                        </div>
                    </div>

                    <div className={styles.lobbyActions}>
                        <button className="btn btn-secondary" onClick={handleLeave}>
                            <LogOut size={18} /> Leave
                        </button>
                        {isDM && (
                            <button
                                className="btn btn-gold btn-lg"
                                onClick={startGame}
                                disabled={false}
                            >
                                <Play size={18} /> Start Adventure
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        );
    }

    if (view === 'game' && session) {
        const currentCombatant = session.combat.combatants[session.combat.currentTurn];
        const isMyTurn = currentCombatant?.playerId === playerId;

        return (
            <div className={styles.gamePage}>
                {/* Turn Notification */}
                <AnimatePresence>
                    {isMyTurn && session.combat.isActive && (
                        <motion.div
                            className={styles.turnNotification}
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                        >
                            <Bell size={20} />
                            <span>It's your turn!</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={styles.gameLayout}>
                    {/* Main Content Area */}
                    <div className={styles.mainArea}>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                            <h2 className="text-lg md:text-xl font-bold text-white">{session.name}</h2>
                            <div className={styles.gameStatus}>
                                <span className={styles.roundBadge}>Round {session.combat.round}</span>
                                {session.combat.isActive && currentCombatant && (
                                    <span className={styles.turnInfo}>
                                        {currentCombatant.name}'s Turn
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {myCharacter && (
                                    <button
                                        className="btn btn-secondary btn-sm text-xs md:text-sm"
                                        onClick={() => setShowCharacterSheet(true)}
                                    >
                                        <User size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">Character</span>
                                    </button>
                                )}
                                <button
                                    className="btn btn-secondary btn-sm text-xs md:text-sm"
                                    onClick={() => setShowSpellCaster(true)}
                                >
                                    <Sparkles size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">Spells</span>
                                </button>
                                {/* Show Map button: DM always, players only when map exists */}
                                {(isDM || session.map) && (
                                    <button
                                        className={`btn btn-secondary btn-sm text-xs md:text-sm ${showMap ? styles.activeBtn : ''}`}
                                        onClick={() => setShowMap(!showMap)}
                                    >
                                        <Map size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">{showMap ? 'Hide Map' : 'Map'}</span>
                                    </button>
                                )}
                                {/* Shop button: DM always, players only when shop exists */}
                                {(isDM || session.shop) && (
                                    <button
                                        className={`btn btn-secondary btn-sm text-xs md:text-sm ${showShop ? styles.activeBtn : ''}`}
                                        onClick={() => setShowShop(true)}
                                    >
                                        <Store size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">Shop</span>
                                    </button>
                                )}
                                {isDM && (
                                    <>
                                        <QuickDiceRoller
                                            rolledBy={playerName}
                                            onRoll={(message) => sendMessage(message)}
                                        />
                                        <button
                                            className="btn btn-secondary btn-sm text-xs md:text-sm"
                                            onClick={() => setShowSpellCreator(true)}
                                        >
                                            <Plus size={14} className="md:w-4 md:h-4" /> <span className="hidden md:inline">Manage Spells</span>
                                        </button>
                                        <button
                                            className="btn btn-secondary btn-sm text-xs md:text-sm"
                                            onClick={() => setShowBestiary(true)}
                                        >
                                            <Skull size={14} className="md:w-4 md:h-4" /> <span className="hidden md:inline">Bestiary</span>
                                        </button>
                                    </>
                                )}
                                {/* Save & Exit button */}
                                <button
                                    className={`btn ${isDM ? 'btn-gold' : 'btn-secondary'} btn-sm text-xs md:text-sm`}
                                    onClick={handleSaveAndExit}
                                    title={isDM ? "Save session and exit (players can rejoin later)" : "Exit session"}
                                >
                                    <Save size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">{isDM ? 'Save & Exit' : 'Exit'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Modals */}
                        <AnimatePresence>
                            {showCharacterSheet && myCharacter && (
                                <EditableCharacterSheet
                                    character={myCharacter}
                                    onUpdate={handleCharacterUpdate}
                                    onClose={() => setShowCharacterSheet(false)}
                                />
                            )}
                            {showSpellCreator && (
                                <SpellCreator
                                    sessionCode={sessionCode || ''}
                                    onClose={() => setShowSpellCreator(false)}
                                />
                            )}
                            {showSpellCaster && (
                                <SpellCaster
                                    characterName={playerName}
                                    characterClass={myCharacter?.class || "any"}
                                    characterLevel={myCharacter?.level || 1}
                                    spellcastingAbility="intelligence"
                                    spellcastingModifier={0}
                                    proficiencyBonus={2}
                                    customSpells={session.customSpells}
                                    targets={session.combat.combatants.map(c => ({
                                        id: c.id,
                                        name: c.name,
                                        type: c.type === 'player' ? 'ally' : 'enemy'
                                    }))}
                                    onCastSpell={handleCastSpell}
                                    onClose={() => setShowSpellCaster(false)}
                                />
                            )}
                            {showBestiary && (
                                <BestiaryBrowser
                                    onAddMonster={handleAddMonster}
                                    onClose={() => setShowBestiary(false)}
                                />
                            )}
                            {conditionPickerTarget && (
                                <ConditionPicker
                                    combatantId={conditionPickerTarget.id}
                                    combatantName={conditionPickerTarget.name}
                                    currentConditions={conditionPickerTarget.conditions}
                                    onToggleCondition={toggleCondition}
                                    onClose={() => setConditionPickerTarget(null)}
                                />
                            )}
                            {showShop && (
                                <Shop
                                    shop={session.shop}
                                    isDM={isDM}
                                    playerGold={myCharacter?.currency?.gold || 0}
                                    onUpdateShop={setShop}
                                    onBuyItem={async (item) => {
                                        // For now, just send a message about the purchase
                                        await sendMessage(`purchased ${item.name} for ${item.price} GP`);
                                    }}
                                    onClose={() => setShowShop(false)}
                                />
                            )}
                        </AnimatePresence>

                        {/* Quick Actions Bar for character management */}
                        {myCharacter && (
                            <QuickActionsBar
                                character={myCharacter}
                                onHPChange={handleQuickHPChange}
                                onConditionAdd={handleQuickConditionAdd}
                                onConditionRemove={handleQuickConditionRemove}
                                onDeathSaveChange={handleQuickDeathSaveChange}
                                isExpanded={quickActionsExpanded}
                                onToggleExpand={() => setQuickActionsExpanded(!quickActionsExpanded)}
                            />
                        )}

                        {/* Battle Map Section */}
                        {showMap && (
                            <div className={styles.mapSection}>
                                <div className={styles.mapContainer}>
                                    {session.map ? (
                                        <BattleMap
                                            map={session.map}
                                            isDM={isDM}
                                            onCellClick={isDM ? handleCellClick : undefined}
                                            brushSize={brushSize}
                                        />
                                    ) : (
                                        <div className={styles.noMapPlaceholder}>
                                            <Map size={48} />
                                            <p>No battle map created yet</p>
                                            {isDM && <p className={styles.hint}>Use the controls to create a map</p>}
                                        </div>
                                    )}
                                </div>
                                {isDM && (
                                    <div className={styles.mapControlsPanel}>
                                        <MapControls
                                            map={session.map}
                                            onCreateMap={handleCreateMap}
                                            onRevealAll={revealAll}
                                            onHideAll={hideAll}
                                            brushSize={brushSize}
                                            onBrushSizeChange={setBrushSize}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Combat Tracker */}
                        <div className={styles.combatArea}>
                            {session.combat.combatants.length === 0 ? (
                                <div className={styles.noCombat}>
                                    <Swords size={48} />
                                    <p>No combat active</p>
                                    {isDM && <p className={styles.hint}>Add combatants to start an encounter</p>}
                                </div>
                            ) : (
                                <div className={styles.initiativeList}>
                                    {session.combat.combatants.map((combatant, index) => {
                                        const isCurrent = session.combat.isActive && index === session.combat.currentTurn;
                                        const isMine = combatant.playerId === playerId;
                                        const hpPercent = (combatant.currentHitPoints / combatant.maxHitPoints) * 100;

                                        return (
                                            <div
                                                key={combatant.id}
                                                className={`${styles.combatantCard} ${isCurrent ? styles.active : ''} ${isMine ? styles.mine : ''}`}
                                            >
                                                <div className={styles.initiative}>{combatant.initiative}</div>
                                                <div className={styles.combatantInfo}>
                                                    <span className={styles.combatantName}>{combatant.name}</span>
                                                    <div className={styles.combatantStats}>
                                                        <span><Shield size={12} /> {combatant.armorClass}</span>
                                                        <span><Heart size={12} /> {combatant.currentHitPoints}/{combatant.maxHitPoints}</span>
                                                    </div>
                                                    {/* Condition Badges */}
                                                    {combatant.conditions && combatant.conditions.length > 0 && (
                                                        <div className={styles.conditionBadges}>
                                                            {combatant.conditions.map(condition => (
                                                                <ConditionBadge
                                                                    key={condition}
                                                                    condition={condition}
                                                                    size="sm"
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                    {(isDM || isMine) && (
                                                        <div className={styles.quickHp}>
                                                            <button onClick={() => updateCombatantHP(combatant.id, -1)} className={styles.hpBtnMinus}>-1</button>
                                                            <button onClick={() => updateCombatantHP(combatant.id, 1)} className={styles.hpBtnPlus}>+1</button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Death Saves for unconscious players */}
                                                {combatant.currentHitPoints <= 0 && combatant.type === 'player' && (
                                                    <div className={styles.deathSaves}>
                                                        <div className={styles.saveGroup}>
                                                            <span className={styles.saveLabel}>Successes</span>
                                                            <div className={styles.savePips}>
                                                                {[1, 2, 3].map(i => (
                                                                    <div
                                                                        key={`succ_${i}`}
                                                                        className={`${styles.savePip} ${styles.success} ${(combatant.deathSaves?.successes || 0) >= i ? styles.filled : ''}`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            {(isDM || isMine) && (combatant.deathSaves?.successes || 0) < 3 && (combatant.deathSaves?.failures || 0) < 3 && (
                                                                <button
                                                                    className={styles.saveBtn}
                                                                    onClick={() => updateCombatantDeathSaves(combatant.id, 'success')}
                                                                    title="Add Success"
                                                                >
                                                                    <Check size={12} />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className={styles.saveGroup}>
                                                            <span className={styles.saveLabel}>Failures</span>
                                                            <div className={styles.savePips}>
                                                                {[1, 2, 3].map(i => (
                                                                    <div
                                                                        key={`fail_${i}`}
                                                                        className={`${styles.savePip} ${styles.failure} ${(combatant.deathSaves?.failures || 0) >= i ? styles.filled : ''}`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            {(isDM || isMine) && (combatant.deathSaves?.successes || 0) < 3 && (combatant.deathSaves?.failures || 0) < 3 && (
                                                                <button
                                                                    className={`${styles.saveBtn} ${styles.failBtn}`}
                                                                    onClick={() => updateCombatantDeathSaves(combatant.id, 'failure')}
                                                                    title="Add Failure"
                                                                >
                                                                    <X size={12} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className={styles.combatActions}>
                                                    {(isDM || isMine) && (
                                                        <button
                                                            className={styles.actionBtn}
                                                            onClick={() => setConditionPickerTarget({
                                                                id: combatant.id,
                                                                name: combatant.name,
                                                                conditions: combatant.conditions || []
                                                            })}
                                                            title="Manage conditions"
                                                        >
                                                            <AlertTriangle size={14} />
                                                        </button>
                                                    )}
                                                    {session.combat.isActive && !isMine && (
                                                        <button
                                                            className={styles.actionBtn}
                                                            onClick={() => handleAttack(combatant.id, combatant.name)}
                                                            title="Attack this target"
                                                        >
                                                            <Swords size={14} />
                                                        </button>
                                                    )}
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
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Chat & Voice */}
                    <div className={styles.sidebar}>
                        <div className={styles.voiceSection}>
                            <VoiceChat
                                sessionCode={sessionCode || ''}
                                playerId={playerId || ''}
                                playerName={playerName}
                                participants={[
                                    { id: session.dmId, name: session.dmName },
                                    ...session.players
                                        .filter(p => p.odid !== session.dmId)
                                        .map(p => ({ id: p.odid, name: p.odisplayName }))
                                ]}
                            />
                        </div>

                        <div className={styles.chatSection}>
                            <TextChat
                                messages={session.recentMessages}
                                onSendMessage={sendMessage}
                                playerId={playerId || ''}
                                isDM={isDM}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
