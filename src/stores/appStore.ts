import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Character, Campaign, DiceRoll, Combat, GameSession, ChatMessage } from '@/types';

interface AppState {
    // User
    userId: string;
    userName: string;
    isHost: boolean;
    isDM: boolean;

    // Characters
    characters: Character[];
    activeCharacterId: string | null;

    // Campaigns
    campaigns: Campaign[];
    activeCampaignId: string | null;

    // Session
    currentSession: GameSession | null;
    isConnected: boolean;

    // Combat
    activeCombat: Combat | null;

    // Dice
    rollHistory: DiceRoll[];

    // Chat
    chatMessages: ChatMessage[];

    // UI
    sidebarCollapsed: boolean;
    chatPanelOpen: boolean;
    currentView: string;

    // Settings
    settings: {
        theme: 'dark' | 'light' | 'midnight' | 'forest';
        soundEnabled: boolean;
        musicVolume: number;
        sfxVolume: number;
        diceAnimations: boolean;
        showDiceRollConfirmation: boolean;
    };

    // Actions
    setUser: (id: string, name: string) => void;
    setIsHost: (isHost: boolean) => void;
    setIsDM: (isDM: boolean) => void;

    // Character actions
    addCharacter: (character: Character) => void;
    updateCharacter: (id: string, updates: Partial<Character>) => void;
    deleteCharacter: (id: string) => void;
    setActiveCharacter: (id: string | null) => void;

    // Campaign actions
    addCampaign: (campaign: Campaign) => void;
    updateCampaign: (id: string, updates: Partial<Campaign>) => void;
    deleteCampaign: (id: string) => void;
    setActiveCampaign: (id: string | null) => void;

    // Session actions
    setCurrentSession: (session: GameSession | null) => void;
    setIsConnected: (connected: boolean) => void;

    // Combat actions
    setActiveCombat: (combat: Combat | null) => void;

    // Dice actions
    addRoll: (roll: DiceRoll) => void;
    clearRollHistory: () => void;

    // Chat actions
    addChatMessage: (message: ChatMessage) => void;
    clearChat: () => void;

    // UI actions
    toggleSidebar: () => void;
    toggleChatPanel: () => void;
    setCurrentView: (view: string) => void;

    // Settings actions
    updateSettings: (settings: Partial<AppState['settings']>) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // Initial state
            userId: '',
            userName: 'Adventurer',
            isHost: false,
            isDM: false,

            characters: [],
            activeCharacterId: null,

            campaigns: [],
            activeCampaignId: null,

            currentSession: null,
            isConnected: false,

            activeCombat: null,

            rollHistory: [],

            chatMessages: [],

            sidebarCollapsed: false,
            chatPanelOpen: false,
            currentView: 'dashboard',

            settings: {
                theme: 'dark',
                soundEnabled: true,
                musicVolume: 50,
                sfxVolume: 70,
                diceAnimations: true,
                showDiceRollConfirmation: true,
            },

            // User actions
            setUser: (id, name) => set({ userId: id, userName: name }),
            setIsHost: (isHost) => set({ isHost }),
            setIsDM: (isDM) => set({ isDM }),

            // Character actions
            addCharacter: (character) =>
                set((state) => ({ characters: [...state.characters, character] })),

            updateCharacter: (id, updates) =>
                set((state) => ({
                    characters: state.characters.map((c) =>
                        c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c
                    ),
                })),

            deleteCharacter: (id) =>
                set((state) => ({
                    characters: state.characters.filter((c) => c.id !== id),
                    activeCharacterId: state.activeCharacterId === id ? null : state.activeCharacterId,
                })),

            setActiveCharacter: (id) => set({ activeCharacterId: id }),

            // Campaign actions
            addCampaign: (campaign) =>
                set((state) => ({ campaigns: [...state.campaigns, campaign] })),

            updateCampaign: (id, updates) =>
                set((state) => ({
                    campaigns: state.campaigns.map((c) =>
                        c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c
                    ),
                })),

            deleteCampaign: (id) =>
                set((state) => ({
                    campaigns: state.campaigns.filter((c) => c.id !== id),
                    activeCampaignId: state.activeCampaignId === id ? null : state.activeCampaignId,
                })),

            setActiveCampaign: (id) => set({ activeCampaignId: id }),

            // Session actions
            setCurrentSession: (session) => set({ currentSession: session }),
            setIsConnected: (connected) => set({ isConnected: connected }),

            // Combat actions
            setActiveCombat: (combat) => set({ activeCombat: combat }),

            // Dice actions
            addRoll: (roll) =>
                set((state) => ({
                    rollHistory: [roll, ...state.rollHistory].slice(0, 100), // Keep last 100 rolls
                })),

            clearRollHistory: () => set({ rollHistory: [] }),

            // Chat actions
            addChatMessage: (message) =>
                set((state) => ({
                    chatMessages: [...state.chatMessages, message].slice(-200), // Keep last 200 messages
                })),

            clearChat: () => set({ chatMessages: [] }),

            // UI actions
            toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
            toggleChatPanel: () => set((state) => ({ chatPanelOpen: !state.chatPanelOpen })),
            setCurrentView: (view) => set({ currentView: view }),

            // Settings actions
            updateSettings: (newSettings) =>
                set((state) => ({
                    settings: { ...state.settings, ...newSettings },
                })),
        }),
        {
            name: 'dnd-app-storage',
            partialize: (state) => ({
                userId: state.userId,
                userName: state.userName,
                characters: state.characters,
                campaigns: state.campaigns,
                rollHistory: state.rollHistory.slice(0, 20), // Only persist last 20 rolls
                settings: state.settings,
            }),
        }
    )
);
