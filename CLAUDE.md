# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Backend Dev Server**: `npm run start` or `node server.js` (from project root)
- **Frontend Dev Server**: `cd frontend && npm run dev`
- **Frontend Build**: `cd frontend && npm run build`
- **Frontend Lint**: `cd frontend && npm run lint`
- **Backend Lint**: Uses standard js conventions (no explicit linter script found).
- **Testing**: No test scripts found.

## Architecture & Structure

- **Backend**: Node.js Express server (`server.js`) connected to a PostgreSQL database (`src/db.js`).
    - **Routes**: Located in `src/routes/` (`auth.js`, `jobs.js`, `analyze.js`). 
    - **Authentication**: JWT-based authentication.
    - **WebSocket**: Uses Socket.io for real-time browser communication (`server.js`).
    - **AI Integration**: Integrates Google Generative AI (`@google/generative-ai` in `package.json`).
    - **File Processing**: PDF processing capabilities using `pdf-parse` and `pdf2json`.
- **Frontend**: React (Vite) application in the `frontend/` directory.
    - **Styling**: Tailwind CSS (`frontend/tailwind.config.js`).
    - **Animations/3D**: Uses Framer Motion (`framer-motion`) and React Three Fiber (`@react-three/fiber`, `three`).
    - **Main Component**: App logic primarily resides in `frontend/src/App.jsx`.
    - **Icons**: Lucide React (`lucide-react`).
    - **Realtime**: Connects to backend via `socket.io-client`.

## Important Notes
- Real-time events are dispatched via WebSocket (accessible via `app.get('io')` in backend routes).
- Ensure `.env` is properly configured for DB connection and JWT secrets before running the backend.
