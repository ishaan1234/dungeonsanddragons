'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { GameSession, ChatMessage, SessionCombatant, MapState, Shop, subscribeToSession, updateCombatState, sendChatMessage, updateSessionStatus, leaveSession, updateCombatantConditions, updateMapState, revealCell, hideCell, updateShop } from '@/lib/firebase';
import { executeRoll } from '@/lib/dice';

interface SessionContextType {
    session: GameSession | null;
    sessionCode: string | null;
    playerId: string | null;
    playerName: string;
    isDM: boolean;
    isConnected: boolean;

    // Actions
    setSessionCode: (code: string | null) => void;
    setPlayerId: (id: string) => void;
    setPlayerName: (name: string) => void;

    // Combat actions
    updateCombat: (combat: GameSession['combat']) => Promise<void>;
    addCombatant: (combatant: SessionCombatant) => Promise<void>;
    removeCombatant: (combatantId: string) => Promise<void>;
    nextTurn: () => Promise<void>;
    updateCombatantHP: (combatantId: string, delta: number) => Promise<void>;
    updateCombatantDeathSaves: (combatantId: string, result: 'success' | 'failure') => Promise<void>;
    toggleCondition: (combatantId: string, condition: string) => Promise<void>;

    // Chat actions
    sendMessage: (content: string) => Promise<void>;
    sendRoll: (formula: string, reason?: string, isSecret?: boolean) => Promise<void>;

    // Session actions
    startGame: () => Promise<void>;
    pauseGame: () => Promise<void>;
    endGame: () => Promise<void>;
    leave: () => Promise<void>;

    // Map actions (Fog of War)
    updateMap: (map: MapState) => Promise<void>;
    toggleCell: (x: number, y: number) => Promise<void>;
    revealAll: () => Promise<void>;
    hideAll: () => Promise<void>;

    // Shop actions
    setShop: (shop: Shop) => Promise<void>;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
    // ... (keep creating variables)
    const [session, setSession] = useState<GameSession | null>(null);
    const [sessionCode, _setSessionCode] = useState<string | null>(null);
    const [playerId, _setPlayerId] = useState<string | null>(null);
    const [playerName, setPlayerName] = useState('Adventurer');
    const [isConnected, setIsConnected] = useState(false);

    // Initialize state from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedCode = localStorage.getItem('dnd_session_code');
            const savedId = localStorage.getItem('dnd_player_id');
            const savedName = localStorage.getItem('dnd_player_name');

            if (savedCode) _setSessionCode(savedCode);
            if (savedId) _setPlayerId(savedId);
            if (savedName) setPlayerName(savedName);
        }
    }, []);

    const setSessionCode = (code: string | null) => {
        _setSessionCode(code);
        if (code) {
            localStorage.setItem('dnd_session_code', code);
        } else {
            localStorage.removeItem('dnd_session_code');
        }
    };

    const setPlayerId = (id: string) => {
        _setPlayerId(id);
        if (id) {
            localStorage.setItem('dnd_player_id', id);
        }
    };

    // Update player name in storage
    useEffect(() => {
        if (playerName) {
            localStorage.setItem('dnd_player_name', playerName);
        }
    }, [playerName]);

    // Subscribe to session updates
    useEffect(() => {
        if (!sessionCode) {
            setSession(null);
            setIsConnected(false);
            return;
        }

        const unsubscribe = subscribeToSession(sessionCode, (updatedSession) => {
            setSession(updatedSession);
            setIsConnected(updatedSession !== null);
        });

        return () => unsubscribe();
    }, [sessionCode]);

    const isDM = session?.dmId === playerId;

    // Combat actions
    const updateCombat = useCallback(async (combat: GameSession['combat']) => {
        if (!sessionCode) return;
        await updateCombatState(sessionCode, combat);
    }, [sessionCode]);

    const addCombatant = useCallback(async (combatant: SessionCombatant) => {
        if (!session || !sessionCode) return;
        const newCombatants = [...session.combat.combatants, combatant]
            .sort((a, b) => b.initiative - a.initiative);
        await updateCombat({ ...session.combat, combatants: newCombatants });
    }, [session, sessionCode, updateCombat]);

    const removeCombatant = useCallback(async (combatantId: string) => {
        if (!session || !sessionCode) return;
        const newCombatants = session.combat.combatants.filter(c => c.id !== combatantId);
        await updateCombat({ ...session.combat, combatants: newCombatants });
    }, [session, sessionCode, updateCombat]);

    const nextTurn = useCallback(async () => {
        if (!session || !sessionCode) return;
        const { combat } = session;
        let newTurn = combat.currentTurn + 1;
        let newRound = combat.round;

        if (newTurn >= combat.combatants.length) {
            newTurn = 0;
            newRound += 1;
        }

        await updateCombat({ ...combat, currentTurn: newTurn, round: newRound });

        // Send system message about turn change
        const nextCombatant = combat.combatants[newTurn];
        if (nextCombatant) {
            await sendChatMessage(sessionCode, {
                id: `turn_${Date.now()}`,
                odplayerId: 'system',
                playerName: 'System',
                content: `It's ${nextCombatant.name}'s turn!`,
                type: 'system',
                timestamp: Date.now(),
            });
        }
    }, [session, sessionCode, updateCombat]);

    const updateCombatantHP = useCallback(async (combatantId: string, delta: number) => {
        if (!session || !sessionCode) return;
        const newCombatants = session.combat.combatants.map(c => {
            if (c.id !== combatantId) return c;
            const newHP = Math.max(0, Math.min(c.maxHitPoints, c.currentHitPoints + delta));
            // Reset death saves if healing
            const updates: Partial<SessionCombatant> = { currentHitPoints: newHP };
            if (delta > 0 && newHP > 0 && c.currentHitPoints <= 0) {
                updates.deathSaves = { successes: 0, failures: 0 };
            }
            return { ...c, ...updates };
        });
        await updateCombat({ ...session.combat, combatants: newCombatants });
    }, [session, sessionCode, updateCombat]);

    const updateCombatantDeathSaves = useCallback(async (combatantId: string, result: 'success' | 'failure') => {
        if (!session || !sessionCode) return;
        const newCombatants = session.combat.combatants.map(c => {
            if (c.id !== combatantId) return c;

            const saves = c.deathSaves || { successes: 0, failures: 0 };
            const newSaves = { ...saves };

            if (result === 'success') newSaves.successes = Math.min(3, saves.successes + 1);
            else newSaves.failures = Math.min(3, saves.failures + 1);

            return { ...c, deathSaves: newSaves };
        });
        await updateCombat({ ...session.combat, combatants: newCombatants });
    }, [session, sessionCode, updateCombat]);

    const toggleCondition = useCallback(async (combatantId: string, condition: string) => {
        if (!session || !sessionCode) return;
        const combatant = session.combat.combatants.find(c => c.id === combatantId);
        if (!combatant) return;

        const currentConditions = combatant.conditions || [];
        let newConditions: string[];

        if (currentConditions.includes(condition)) {
            newConditions = currentConditions.filter(c => c !== condition);
        } else {
            newConditions = [...currentConditions, condition];
        }

        await updateCombatantConditions(sessionCode, combatantId, newConditions);
    }, [session, sessionCode]);

    // Chat actions
    const sendMessage = useCallback(async (content: string) => {
        if (!sessionCode || !playerId) return;

        // Check for roll commands
        if (content.startsWith('/roll ') || content.startsWith('/r ')) {
            const formula = content.replace(/^\/r(oll)? /, '');
            await sendRoll(formula);
            return;
        }

        // Check for secret roll
        if (content.startsWith('/gmroll ')) {
            const formula = content.replace(/^\/gmroll /, '');
            await sendRoll(formula, undefined, true);
            return;
        }

        await sendChatMessage(sessionCode, {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            odplayerId: playerId,
            playerName,
            content,
            type: 'message',
            timestamp: Date.now(),
        });
    }, [sessionCode, playerId, playerName]);

    const sendRoll = useCallback(async (formula: string, reason?: string, isSecret: boolean = false) => {
        if (!sessionCode || !playerId) return;

        const roll = executeRoll(formula, playerName, reason);

        await sendChatMessage(sessionCode, {
            id: `roll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            odplayerId: playerId,
            playerName,
            content: reason || `rolled ${formula}`,
            type: 'roll',
            rollResult: {
                formula: roll.formula,
                total: roll.total,
                dice: roll.dice.map(d => d.result),
            },
            timestamp: Date.now(),
            isSecret,
        });
    }, [sessionCode, playerId, playerName]);

    // Session actions
    const startGame = useCallback(async () => {
        if (!sessionCode || !isDM) return;
        await updateSessionStatus(sessionCode, 'playing');
    }, [sessionCode, isDM]);

    const pauseGame = useCallback(async () => {
        if (!sessionCode || !isDM) return;
        await updateSessionStatus(sessionCode, 'paused');
    }, [sessionCode, isDM]);

    const endGame = useCallback(async () => {
        if (!sessionCode || !isDM) return;
        await updateSessionStatus(sessionCode, 'ended');
    }, [sessionCode, isDM]);

    const leave = useCallback(async () => {
        if (!sessionCode || !playerId) return;
        await leaveSession(sessionCode, playerId);
        setSessionCode(null);
    }, [sessionCode, playerId]);

    // Map actions (Fog of War)
    const updateMap = useCallback(async (map: MapState) => {
        if (!sessionCode) return;
        await updateMapState(sessionCode, map);
    }, [sessionCode]);

    const toggleCell = useCallback(async (x: number, y: number) => {
        if (!session || !sessionCode || !session.map) return;
        const isRevealed = session.map.fogGrid[y]?.[x];
        if (isRevealed) {
            await hideCell(sessionCode, x, y);
        } else {
            await revealCell(sessionCode, x, y);
        }
    }, [session, sessionCode]);

    const revealAllCells = useCallback(async () => {
        if (!session || !sessionCode || !session.map) return;
        const newFogGrid = session.map.fogGrid.map(row => row.map(() => true));
        await updateMapState(sessionCode, { ...session.map, fogGrid: newFogGrid });
    }, [session, sessionCode]);

    const hideAllCells = useCallback(async () => {
        if (!session || !sessionCode || !session.map) return;
        const newFogGrid = session.map.fogGrid.map(row => row.map(() => false));
        await updateMapState(sessionCode, { ...session.map, fogGrid: newFogGrid });
    }, [session, sessionCode]);

    // Shop actions
    const setShop = useCallback(async (shop: Shop) => {
        if (!sessionCode) return;
        await updateShop(sessionCode, shop);
    }, [sessionCode]);

    return (
        <SessionContext.Provider value={{
            session,
            sessionCode,
            playerId,
            playerName,
            isDM,
            isConnected,
            setSessionCode,
            setPlayerId,
            setPlayerName,
            updateCombat,
            addCombatant,
            removeCombatant,
            nextTurn,
            updateCombatantHP,
            updateCombatantDeathSaves,
            toggleCondition,
            sendMessage,
            sendRoll,
            startGame,
            pauseGame,
            endGame,
            leave,
            updateMap,
            toggleCell,
            revealAll: revealAllCells,
            hideAll: hideAllCells,
            setShop,
        }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}
