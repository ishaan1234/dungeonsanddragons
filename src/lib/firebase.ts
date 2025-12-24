import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, onSnapshot, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

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
    };

    await setDoc(doc(db, 'sessions', sessionCode), session);
    return sessionCode;
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

// Anonymous auth for quick play
export async function signInAnon(): Promise<string> {
    const result = await signInAnonymously(auth);
    return result.user.uid;
}
