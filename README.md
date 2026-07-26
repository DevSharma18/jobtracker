 # Job Tracker AI

  AI-powered career engineering platform that analyzes your resume
  against job descriptions and provides personalized skill gap
  analysis with actionable learning plans.

  ![Tech Stack](https://img.shields.io/badge/Node.js-339933?style=fla
  t&logo=node.js&logoColor=white)
  ![Tech Stack](https://img.shields.io/badge/React-61DAFB?style=flat&
  logo=react&logoColor=black)
  ![Tech Stack](https://img.shields.io/badge/PostgreSQL-4169E1?style=
  flat&logo=postgresql&logoColor=white)
  ![Tech Stack](https://img.shields.io/badge/Gemini%20AI-8E75FF?style
  =flat&logo=google&logoColor=white)

  ---

  ## Features

  - **Email/Password Authentication** — JWT-based secure login and
  signup
  - **Google OAuth 2.0** — One-click login with Google account
  - **Job Application Tracking** — Add, view, and manage job
  applications with status tracking
  - **Resume Analysis** — Upload PDF resume and get AI-powered match
  score against job descriptions
  - **Skill Gap Identification** — AI identifies missing skills from
  your resume
  - **Personalized Learning Plan** — 30-day actionable plan to close
  skill gaps
  - **Real-time Updates** — Live AI analysis status via WebSocket
  (Socket.io)
  - **3D Visualizations** — Interactive 3D sphere that responds to AI
  processing state
  - **Dark/Light Themes** — Bright login page with dark dashboard

  ---

  ## Tech Stack

  | Layer | Technology | Purpose |
  |-------|-----------|---------|
  | Frontend | React 19, Vite 8 | SPA framework and build tool |
  | Styling | Tailwind CSS 3 | Utility-first CSS framework |
  | Animations | Framer Motion | Page transitions and UI animations |
  | 3D Graphics | Three.js, React Three Fiber | Interactive 3D
  visualizations |
  | Icons | Lucide React | Icon library |
  | Backend | Node.js, Express 5 | REST API server |
  | Database | PostgreSQL | Persistent data storage |
  | Authentication | JWT, Passport.js | Token-based auth, Google
  OAuth |
  | File Upload | Multer | PDF file handling |
  | PDF Processing | pdf-parse | Text extraction from resumes |
  | AI | Google Gemini API | Resume analysis and skill gap detection
  |
  | Real-time | Socket.io | WebSocket communication |
  | Process Manager | PM2 | Production process management |
  | Reverse Proxy | Nginx | Static file serving, request proxying |
  | SSL | Let's Encrypt | Free HTTPS certificates |

  ---

  ## Architecture

  ┌──────────────────────────────────────────────────────────┐
  │                    EC2 Instance (Ubuntu)                  │
  │                                                          │
  │   ┌──────────┐    ┌──────────────┐    ┌──────────────┐  │
  │   │  Nginx   │───→│  Node.js/    │───→│  PostgreSQL   │  │
  │   │ (port 80 │    │  Express     │    │  (port 5432)  │  │
  │   │  & 443)  │    │  (port 3000) │    │              │  │
  │   └──────────┘    └──────────────┘    └──────────────┘  │
  │        │                │                                │
  │        │                ├──→ Google Gemini API           │
  │        │                └──→ Socket.io (WebSocket)       │
  │        │                                                 │
  │   Serves React                                        Stores
  users, jobs, analyses
  │   static files
  └──────────────────────────────────────────────────────────┘

  ---

  ## Getting Started

  ### Prerequisites

  - Node.js 22+
  - PostgreSQL 16+
  - Google Cloud Console account (for OAuth and Gemini API)
  - Gemini API key from [Google AI
  Studio](https://aistudio.google.com/apikey)

  ### Installation

  1. Clone the repository
  ```bash
  git clone https://github.com/DevSharma18/job-tracker.git
  cd job-tracker

  2. Install backend dependencies
  npm install

  3. Install frontend dependencies and build
  cd frontend
  npm install
  npm run build
  cd ..

  4. Create .env file in project root
  env
  PORT=3000
  NODE_ENV=development
  DATABASE_URL=postgresql://postgres:your_password@localhost:5432/job
  tracker
  JWT_SECRET=your_jwt_secret
  GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_CLIENT_SECRET=your_google_client_secret
  GEMINI_API_KEY=your_gemini_api_key
  CLIENT_URL=http://localhost:5173

  5. Set up PostgreSQL
  sudo -u postgres psql
  ALTER USER postgres WITH PASSWORD 'your_password';
  CREATE DATABASE jobtracker;
  \q

  6. Start the development server
  npm run start

  7. In a separate terminal, start the frontend dev server
  cd frontend
  npm run dev

  Open http://localhost:5173 in your browser.

  ---
  API Endpoints

  ┌───────┬──────────────────────────┬───────────────┬─────────┐
  │ Metho │         Endpoint         │  Description  │ Auth Re │
  │   d   │                          │               │ quired  │
  ├───────┼──────────────────────────┼───────────────┼─────────┤
  │ POST  │ /api/auth/signup         │ Register new  │ No      │
  │       │                          │ user          │         │
  ├───────┼──────────────────────────┼───────────────┼─────────┤
  │ POST  │ /api/auth/login          │ Login with em │ No      │
  │       │                          │ ail/password  │         │
  ├───────┼──────────────────────────┼───────────────┼─────────┤
  │ GET   │ /api/auth/google         │ Redirect to   │ No      │
  │       │                          │ Google OAuth  │         │
  ├───────┼──────────────────────────┼───────────────┼─────────┤
  │ GET   │ /api/auth/google/callbac │ Google OAuth  │ No      │
  │       │ k                        │ callback      │         │
  ├───────┼──────────────────────────┼───────────────┼─────────┤
  │ GET   │ /api/jobs                │ List all jobs │ Yes     │
  │       │                          │  for user     │         │
  ├───────┼──────────────────────────┼───────────────┼─────────┤
  │ POST  │ /api/jobs                │ Add new job   │ Yes     │
  │       │                          │ application   │         │
  ├───────┼──────────────────────────┼───────────────┼─────────┤
  │ POST  │ /api/jobs/:id/analyze    │ Upload resume │ Yes     │
  │       │                          │  and analyze  │         │
  ├───────┼──────────────────────────┼───────────────┼─────────┤
  │       │                          │ Get latest    │         │
  │ GET   │ /api/jobs/:id/analysis   │ analysis      │ Yes     │
  │       │                          │ result        │         │
  └───────┴──────────────────────────┴───────────────┴─────────┘

  ---
  Project Structure

  job-tracker/
  ├── frontend/
  │   ├── src/
  │   │   ├── App.jsx          # Main application component
  │   │   ├── index.css         # Global styles
  │   │   └── main.jsx          # Entry point
  │   ├── dist/                 # Production build output
  │   ├── tailwind.config.js
  │   └── vite.config.js
  ├── src/
  │   ├── db.js                 # PostgreSQL connection setup
  │   ├── schema.sql            # Database schema
  │   ├── middleware/
  │   │   └── protect.js        # JWT authentication middleware
  │   ├── routes/
  │   │   ├── auth.js           # Auth routes (signup, login, Google
  OAuth)
  │   │   ├── jobs.js           # Job CRUD routes
  │   │   └── analyze.js        # Resume analysis routes
  │   ├── services/
  │   │   ├── gemini.js         # Google Gemini AI integration
  │   │   └── googleAuth.js     # Google OAuth strategy
  │   └── utils/
  │       └── pdf.js            # PDF text extraction
  ├── nginx/
  │   └── job-tracker           # Nginx configuration
  ├── uploads/                  # Temporary resume storage
  ├── .env.example              # Environment variable template
  ├── server.js                 # Express server entry point
  └── package.json

  ---
  Environment Variables

  ┌──────────────────────┬─────────────────────────────┬──────────┐
  │       Variable       │         Description         │ Required │
  ├──────────────────────┼─────────────────────────────┼──────────┤
  │ PORT                 │ Server port (default: 3000) │ Yes      │
  ├──────────────────────┼─────────────────────────────┼──────────┤
  │ NODE_ENV             │ development or production   │ Yes      │
  ├──────────────────────┼─────────────────────────────┼──────────┤
  │ DATABASE_URL         │ PostgreSQL connection       │ Yes      │
  │                      │ string                      │          │
  ├──────────────────────┼─────────────────────────────┼──────────┤
  │ JWT_SECRET           │ Secret key for JWT signing  │ Yes      │
  ├──────────────────────┼─────────────────────────────┼──────────┤
  │ GOOGLE_CLIENT_ID     │ Google OAuth client ID      │ Yes      │
  ├──────────────────────┼─────────────────────────────┼──────────┤
  │ GOOGLE_CLIENT_SECRET │ Google OAuth client secret  │ Yes      │
  ├──────────────────────┼─────────────────────────────┼──────────┤
  │ GEMINI_API_KEY       │ Google Gemini API key       │ Yes      │
  ├──────────────────────┼─────────────────────────────┼──────────┤
  │ CLIENT_URL           │ Frontend URL for OAuth      │ Yes      │
  │                      │ redirects                   │          │
  └──────────────────────┴─────────────────────────────┴──────────┘

  ---
  Deployment

  See the deployment guide in the project repository. The app is
  deployed on AWS EC2 with:

  - Server: Ubuntu 24.04 on t2.micro (free tier)
  - Web Server: Nginx reverse proxy
  - Process Manager: PM2
  - Database: PostgreSQL (self-hosted)
  - SSL: Let's Encrypt (auto-renewing)
  - Domain: https://jobtracker.crabdance.com

  Production Commands

  # Check server status
  pm2 status

  # View logs
  pm2 logs job-tracker

  # Restart server
  pm2 restart job-tracker

  # Renew SSL certificate
  sudo certbot renew --dry-run

  ---
  License

  ISC

  ---
