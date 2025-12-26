import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, onSnapshot, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { Spell, Character } from '@/types';

// Firebase configuration - Replace with your own config
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abc123",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics (client-side only)
let analytics;
if (typeof window !== 'undefined') {
    isSupported().then(yes => yes && (analytics = getAnalytics(app)));
}
export { analytics };

// Session Types
export interface SessionPlayer {
    odid: string;
    odisplayName: string;
    characterId?: string | null;
    characterName?: string | null;
    isReady: boolean;
    joinedAt: number;
}

export interface ChatMessage {
    id: string;
    odplayerId: string;
    playerName: string;
    content: string;
    type: 'message' | 'roll' | 'system';
    rollResult?: {
        formula: string;
        total: number;
        dice: number[];
    };
    timestamp: number;
    isSecret?: boolean;
}

export interface SessionCombatant {
    id: string;
    name: string;
    type: 'player' | 'monster';
    playerId?: string;
    initiative: number;
    armorClass: number;
    maxHitPoints: number;
    currentHitPoints: number;
    conditions: string[];
    deathSaves?: {
        successes: number;
        failures: number;
    };
}

export interface MapState {
    gridWidth: number;
    gridHeight: number;
    cellSize: number;
    fogGrid: boolean[][]; // true = revealed, false = hidden
    backgroundImage?: string;
}

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number; // in gold pieces
    quantity: number; // -1 for unlimited
    category: 'weapon' | 'armor' | 'potion' | 'gear' | 'magic' | 'other';
}

export interface Shop {
    isOpen: boolean;
    name: string;
    items: ShopItem[];
}

export interface GameSession {
    id: string;
    name: string;
    dmId: string;
    dmName: string;
    campaignId?: string;
    players: SessionPlayer[];
    status: 'lobby' | 'playing' | 'paused' | 'ended';
    createdAt: number;

    // Combat State (synced in real-time)
    combat: {
        isActive: boolean;
        round: number;
        currentTurn: number;
        combatants: SessionCombatant[];
    };

    // Chat messages (last 100)
    recentMessages: ChatMessage[];

    // Custom Content
    customSpells?: Spell[];

    // Battle Map with Fog of War
    map?: MapState;

    // Shop for buying/selling items
    shop?: Shop;

    // Player character data (synced by players for DM view)
    playerCharacters?: Record<string, Character>;
}

// Generate a random session code (6 characters)
export function generateSessionCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Create a new session
export async function createSession(dmId: string, dmName: string, sessionName: string): Promise<string> {
    const sessionCode = generateSessionCode();

    const session: GameSession = {
        id: sessionCode,
        name: sessionName,
        dmId,
        dmName,
        players: [],
        status: 'lobby',
        createdAt: Date.now(),
        combat: {
            isActive: false,
            round: 1,
            currentTurn: 0,
            combatants: [],
        },
        recentMessages: [],
        customSpells: [],
    };

    await setDoc(doc(db, 'sessions', sessionCode), session);
    return sessionCode;
}

// Add a custom spell to the session
export async function addCustomSpell(sessionCode: string, spell: Spell): Promise<void> {
    const sessionRef = doc(db, 'sessions', sessionCode);
    await updateDoc(sessionRef, {
        customSpells: arrayUnion(spell)
    });
}


// Join a session
export async function joinSession(
    sessionCode: string,
    playerId: string,
    displayName: string,
    characterId?: string,
    characterName?: string
): Promise<GameSession | null> {
    const sessionRef = doc(db, 'sessions', sessionCode.toUpperCase());
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) {
        return null;
    }

    const session = sessionSnap.data() as GameSession;

    // Check if player is the DM
    if (session.dmId === playerId) {
        return session;
    }

    // Check if player already in session
    const existingPlayer = session.players.find(p => p.odid === playerId);
    if (!existingPlayer) {
        const newPlayer: SessionPlayer = {
            odid: playerId,
            odisplayName: displayName,
            characterId: characterId ?? null,
            characterName: characterName ?? null,
            isReady: false,
            joinedAt: Date.now(),
        };

        await updateDoc(sessionRef, {
            players: arrayUnion(newPlayer)
        });
    }

    return session;
}

// Subscribe to session updates
export function subscribeToSession(
    sessionCode: string,
    callback: (session: GameSession | null) => void
): () => void {
    const sessionRef = doc(db, 'sessions', sessionCode.toUpperCase());

    return onSnapshot(sessionRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.data() as GameSession);
        } else {
            callback(null);
        }
    });
}

// Update combat state
export async function updateCombatState(
    sessionCode: string,
    combat: GameSession['combat']
): Promise<void> {
    const sessionRef = doc(db, 'sessions', sessionCode);
    await updateDoc(sessionRef, { combat });
}

// Send chat message
export async function sendChatMessage(
    sessionCode: string,
    message: ChatMessage
): Promise<void> {
    const sessionRef = doc(db, 'sessions', sessionCode);
    const sessionSnap = await getDoc(sessionRef);

    if (sessionSnap.exists()) {
        const session = sessionSnap.data() as GameSession;
        const messages = [...session.recentMessages, message].slice(-100); // Keep last 100
        await updateDoc(sessionRef, { recentMessages: messages });
    }
}

// Update session status
export async function updateSessionStatus(
    sessionCode: string,
    status: GameSession['status']
): Promise<void> {
    const sessionRef = doc(db, 'sessions', sessionCode);
    await updateDoc(sessionRef, { status });
}

// Leave session
export async function leaveSession(
    sessionCode: string,
    playerId: string
): Promise<void> {
    const sessionRef = doc(db, 'sessions', sessionCode);
    const sessionSnap = await getDoc(sessionRef);

    if (sessionSnap.exists()) {
        const session = sessionSnap.data() as GameSession;
        const updatedPlayers = session.players.filter(p => p.odid !== playerId);
        await updateDoc(sessionRef, { players: updatedPlayers });
    }
}

// Update combatant conditions
export async function updateCombatantConditions(
    sessionCode: string,
    combatantId: string,
    conditions: string[]
): Promise<void> {
    const sessionRef = doc(db, 'sessions', sessionCode);
    const sessionSnap = await getDoc(sessionRef);

    if (sessionSnap.exists()) {
        const session = sessionSnap.data() as GameSession;
        const updatedCombatants = session.combat.combatants.map(c =>
            c.id === combatantId ? { ...c, conditions } : c
        );
        await updateDoc(sessionRef, {
            combat: { ...session.combat, combatants: updatedCombatants }
        });
    }
}

// Anonymous auth for quick play
export async function signInAnon(): Promise<string> {
    const result = await signInAnonymously(auth);
    return result.user.uid;
}

// Map Functions for Fog of War

// Update the entire map state
export async function updateMapState(
    sessionCode: string,
    map: MapState
): Promise<void> {
    const sessionRef = doc(db, 'sessions', sessionCode);
    await updateDoc(sessionRef, { map });
}

// Reveal a single cell
export async function revealCell(
    sessionCode: string,
    x: number,
    y: number
): Promise<void> {
    const sessionRef = doc(db, 'sessions', sessionCode);
    const sessionSnap = await getDoc(sessionRef);

    if (sessionSnap.exists()) {
        const session = sessionSnap.data() as GameSession;
        if (session.map) {
            const newFogGrid = session.map.fogGrid.map(row => [...row]);
            if (newFogGrid[y] && newFogGrid[y][x] !== undefined) {
                newFogGrid[y][x] = true;
                await updateDoc(sessionRef, {
                    map: { ...session.map, fogGrid: newFogGrid }
                });
            }
        }
    }
}

// Hide a single cell
export async function hideCell(
    sessionCode: string,
    x: number,
    y: number
): Promise<void> {
    const sessionRef = doc(db, 'sessions', sessionCode);
    const sessionSnap = await getDoc(sessionRef);

    if (sessionSnap.exists()) {
        const session = sessionSnap.data() as GameSession;
        if (session.map) {
            const newFogGrid = session.map.fogGrid.map(row => [...row]);
            if (newFogGrid[y] && newFogGrid[y][x] !== undefined) {
                newFogGrid[y][x] = false;
                await updateDoc(sessionRef, {
                    map: { ...session.map, fogGrid: newFogGrid }
                });
            }
        }
    }
}

// Shop Functions

// Update the shop state
export async function updateShop(
    sessionCode: string,
    shop: Shop
): Promise<void> {
    const sessionRef = doc(db, 'sessions', sessionCode);
    await updateDoc(sessionRef, { shop });
}

// Toggle shop open/closed
export async function toggleShopOpen(
    sessionCode: string,
    isOpen: boolean
): Promise<void> {
    const sessionRef = doc(db, 'sessions', sessionCode);
    const sessionSnap = await getDoc(sessionRef);

    if (sessionSnap.exists()) {
        const session = sessionSnap.data() as GameSession;
        if (session.shop) {
            await updateDoc(sessionRef, {
                shop: { ...session.shop, isOpen }
            });
        }
    }
}

// Character Sync Functions

// Sync a player's character data to the session (for DM view)
export async function syncCharacterToSession(
    sessionCode: string,
    characterId: string,
    character: Character
): Promise<void> {
    const sessionRef = doc(db, 'sessions', sessionCode);
    const sessionSnap = await getDoc(sessionRef);

    if (sessionSnap.exists()) {
        const session = sessionSnap.data() as GameSession;
        const playerCharacters = session.playerCharacters || {};
        playerCharacters[characterId] = character;
        await updateDoc(sessionRef, { playerCharacters });
    }
}

// Update a synced character's data (used by DM)
export async function updateSyncedCharacter(
    sessionCode: string,
    characterId: string,
    updates: Partial<Character>
): Promise<void> {
    const sessionRef = doc(db, 'sessions', sessionCode);
    const sessionSnap = await getDoc(sessionRef);

    if (sessionSnap.exists()) {
        const session = sessionSnap.data() as GameSession;
        const playerCharacters = session.playerCharacters || {};
        if (playerCharacters[characterId]) {
            playerCharacters[characterId] = { ...playerCharacters[characterId], ...updates };
            await updateDoc(sessionRef, { playerCharacters });
        }
    }
}
