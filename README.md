<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/847b5472-cabb-4d96-a3df-14580f921f5d

## Run Locally

**Prerequisites:** Node.js

Layout: `frontend/` (React + Vite), `backend/` (Express + HTTP server), `database/` (repositories + `data/` JSON files), `backend/src/api/` (REST routes).

1. Install dependencies: `npm install`
2. Set `GEMINI_API_KEY` in `.env.local` (project root) for Gemini API calls
3. Run the app: `npm run dev` (starts `backend/src/server.ts` on port 3000)

Optional: `DATABASE_DATA_DIR` overrides where JSON data files are stored (default: `database/data/`).
