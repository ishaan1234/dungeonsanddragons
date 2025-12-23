# 🐉 Realm of Adventures

A modern, immersive **Dungeons & Dragons Companion App** built for real-time multiplayer campaigns. Manage your characters, run combat encounters, and play with friends online—all in one beautiful interface.

![DnD App Banner](https://images.unsplash.com/photo-1610888301841-566530ec3d71?q=80&w=2072&auto=format&fit=crop)

## ✨ Key Features

### ⚔️ For the Party (Players)
-   **Interactive Character Sheet**: Track HP, AC, Abilities, Skills, and Features in a responsive, easy-to-read format.
-   **3D Dice Roller**: satisfying physics-based dice rolls directly in your browser.
-   **Spellbook**: Browse and manage your spells with detailed descriptions, casting times, and range.
-   **Real-Time Chat**: Communicate with your party using text and built-in roll commands (`/roll 1d20+5`).
-   **Voice Chat**: Integrated voice communication for seamless coordination.

### 👑 For the Dungeon Master (DM)
-   **Combat Tracker**: Manage initiative, track HP, and handle turns for all combatants.
-   **NPC Generator**: Instantly generate detailed NPCs with stats, traits, and roleplay tips. **Edit** them on the fly!
-   **Secret Rolls**: Keep the suspense alive. Type `/gmroll 1d20` to roll without players seeing the result.
-   **Death Saves**: Track successes and failures for unconscious characters directly in the combat UI.
-   **Session Notes**: A built-in notepad to keep track of plot hooks, loot, and important campaign events.
-   **Game Management**: Pause, Start, or End sessions with a click.

---

## 🚀 How to Play

### Joining a Game
1.  Navigate to **Play Online** in the sidebar.
2.  **Create Session** (for DMs) or **Join Session** (for Players).
3.  **DMs**: Share the unique **Session Code** with your players.
4.  **Players**: Enter the code and your name to join the lobby.

### During the Game
-   **Rolling Dice**: 
    -   Click the dice icon or type `/roll 2d6+3` in the chat.
    -   DMs can use `/gmroll` for secret checks.
-   **Combat**: 
    -   DMs can add monsters/players to the initiative tracker.
    -   Advance turns using the "Next Turn" button.
    -   Click the **Heart** icon to adjust HP.
    -   If a player drops to 0 HP, **Death Save** controls will appear.
-   **Communication**: Use the Voice Chat panel to talk, or stick to the robust text chat.

---

## 🛠️ Installation & Setup

### Prerequisites
-   Node.js 18+
-   A Firebase Project (Free Tier)

### 1. Clone & Install
```bash
git clone https://github.com/ishaan1234/dungeonsanddragons.git
cd dungeonsanddragons
npm install
```

### 2. Firebase Configuration
This app requires **Firebase** for real-time multiplayer.
1.  Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2.  Enable **Authentication** (Anonymous Sign-in).
3.  Enable **Firestore Database** (Start in Test Mode).
4.  Copy your web app configuration keys.
5.  Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```
    *(See `FIREBASE_SETUP.md` for a detailed guide)*

### 3. Run Locally
```bash
npm run dev
```
Visit `http://localhost:3000` to start your adventure.

---

## ☁️ Deployment

This app is optimized for **Vercel**.

1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  **IMPORTANT**: Add your Firebase Environment Variables in the Vercel Dashboard.
4.  Deploy!

*(See `DEPLOYMENT.md` for full deployment instructions)*

---

## 📚 Tech Stack
-   **Framework**: Next.js 15 (App Router)
-   **Language**: TypeScript
-   **Styling**: CSS Modules (Dark Fantasy Theme)
-   **Database**: Firebase Firestore (Real-time)
-   **Voice**: WebRTC
-   **UI**: Lucide React Icons, Framer Motion

---

*Happy Adventuring!* 🎲
