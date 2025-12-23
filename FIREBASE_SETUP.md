# Firebase Setup Guide

## 1. Create a Project
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"** (or select an existing one).
3. Name it (e.g., "DnD-App") and click **Continue**.
4. Disable Google Analytics (optional, makes setup faster) and click **Create Project**.

## 2. Register Web App & Get Keys
1. On the project overview page, click the **Web icon** (`</>`) in the center (or go to Project Settings > General).
2. Enter a nickname (e.g., "DnD Web") and click **Register app**.
3. **Copy the Config**: You will see a code block with `const firebaseConfig = { ... }`.
   These are the values you need for your Vercel Environment Variables:
   - `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `storageBucket` → `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` → `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `NEXT_PUBLIC_FIREBASE_APP_ID`

## 3. Enable Authentication (REQUIRED)
*The app uses Anonymous Login so players don't need accounts.*
1. Go to **Build** > **Authentication** in the left sidebar.
2. Click **Get Started**.
3. Under "Sign-in method," click **Anonymous**.
4. Toggle **Enable** and click **Save**.

## 4. Enable Firestore Database (REQUIRED)
*This is where game sessions and chat are stored.*
1. Go to **Build** > **Firestore Database** in the left sidebar.
2. Click **Create Database**.
3. Choose a location (default is usually fine).
4. **Important**: Select **Start in Test mode**. 
   - This allows any user to read/write for 30 days, which is perfect for development.
   - *Note: Don't use "Production mode" yet or the app will fail with "Permission Denied" errors.*
5. Click **Create**.

---
**Done!** Once you add those Env Variables to specific in Step 2 to Vercel, your app will be fully functional.
