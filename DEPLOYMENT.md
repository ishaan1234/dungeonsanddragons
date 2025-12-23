# Deployment Guide

## Option 1: Vercel GitHub Integration (Recommended)
This is the easiest method. Vercel will automatically deploy whenever you push to your `master` branch.

1.  **Create a Vercel Account**: Go to [vercel.com](https://vercel.com) and sign up (login with GitHub is best).
2.  **Add New Project**:
    *   Click **"Add New..."** > **"Project"**.
    *   Select **"Continue with GitHub"**.
    *   Search for your repository: `dungeonsanddragons`.
    *   Click **"Import"**.
3.  **Configure Project**:
    *   **Framework Preset**: Next.js (should be auto-detected).
    *   **Root Directory**: `./` (default).
    *   **Environment Variables**: You **MUST** add your Firebase config here. copy the values from your `.env.local` (or `firebase.ts` if hardcoded, but env vars are better).
        *   `NEXT_PUBLIC_FIREBASE_API_KEY`
        *   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
        *   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
        *   etc.
4.  **Deploy**: Click **"Deploy"**.

Vercel will build your project and provide a URL (e.g., `dungeonsanddragons.vercel.app`).

### Automatic Deployments
*   Any push to `master` will trigger a **Production Deployment**.
*   Any push to other branches (e.g., `feature/xyz`) will trigger a **Preview Deployment** (with a unique URL for testing).

---

## Option 2: GitHub Actions (Custom CI/CD)
Use this if you need to run specific tests or scripts *before* deploying, or if you want manual control.

1.  **Get Vercel Tokens**:
    *   Go to Vercel Account Settings > Tokens > Create Token. Copy it.
    *   Install Vercel CLI locally: `npm i -g vercel`.
    *   Run `vercel login` and `vercel link` in your project to link it. This creates a `.vercel` folder (gitignored) with `projectId` and `orgId`.
2.  **Configure GitHub Secrets**:
    *   Go to your Repo Settings > Secrets and variables > Actions.
    *   Add `VERCEL_TOKEN` (from step 1).
    *   Add `VERCEL_ORG_ID` (from `.vercel/project.json` or Vercel dashboard).
    *   Add `VERCEL_PROJECT_ID` (from `.vercel/project.json` or Vercel dashboard).
3.  **Add Workflow File**:
    *   Create `.github/workflows/deploy.yml` with the content below.

```yaml
name: Vercel Production Deployment

on:
  push:
    branches:
      - master

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  Deploy-Production:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
        
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
        
      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
        
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```
