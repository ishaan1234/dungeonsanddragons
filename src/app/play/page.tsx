'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, Users, Crown, Copy, Check, LogOut, X,
    Swords, MessageCircle, Settings, Plus,
    Shield, Heart, ChevronRight, Bell
} from 'lucide-react';
import { createSession, joinSession, GameSession, signInAnon } from '@/lib/firebase';
import { useSession } from '@/contexts/SessionContext';
import VoiceChat from '@/components/multiplayer/VoiceChat';
import TextChat from '@/components/multiplayer/TextChat';
import styles from './page.module.css';

export default function PlayPage() {
    const [view, setView] = useState<'menu' | 'create' | 'join' | 'lobby' | 'game'>('menu');
    const [sessionName, setSessionName] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [characterName, setCharacterName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

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
        leave,
        updateCombatantDeathSaves,
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

    // Handle session state changes
    useEffect(() => {
        if (session) {
            if (session.status === 'lobby') {
                setView('lobby');
            } else if (session.status === 'playing') {
                setView('game');
            }
        }
    }, [session?.status]);

    const handleCreateSession = async () => {
        if (!sessionName.trim() || !playerId) return;
        setLoading(true);
        setError(null);

        try {
            const code = await createSession(playerId, playerName, sessionName);
            setSessionCode(code);
            await joinSession(code, playerId, playerName);
        } catch (err) {
            setError('Failed to create session. Please try again.');
        }
        setLoading(false);
    };

    const handleJoinSession = async () => {
        if (!joinCode.trim() || !playerId) return;
        setLoading(true);
        setError(null);

        try {
            const result = await joinSession(joinCode, playerId, playerName, undefined, characterName);
            if (result) {
                setSessionCode(joinCode.toUpperCase());
            } else {
                setError('Session not found. Check the code and try again.');
            }
        } catch (err) {
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

                    <div className={styles.formGroup}>
                        <label>Your Name</label>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="Adventurer"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Character Name (optional)</label>
                        <input
                            type="text"
                            value={characterName}
                            onChange={(e) => setCharacterName(e.target.value)}
                            placeholder="Gandalf the Gray"
                        />
                    </div>

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

                    {error && <div className={styles.error}>{error}</div>}

                    <button
                        className="btn btn-gold btn-lg"
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
                                    ...session.players.map(p => ({ id: p.odid, name: p.odisplayName }))
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
                                disabled={session.players.length === 0}
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
                        <div className={styles.gameHeader}>
                            <h2>{session.name}</h2>
                            <div className={styles.gameStatus}>
                                <span className={styles.roundBadge}>Round {session.combat.round}</span>
                                {session.combat.isActive && currentCombatant && (
                                    <span className={styles.turnInfo}>
                                        {currentCombatant.name}'s Turn
                                    </span>
                                )}
                            </div>
                        </div>

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
                                    ...session.players.map(p => ({ id: p.odid, name: p.odisplayName }))
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
