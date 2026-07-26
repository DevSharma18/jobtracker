# Job Tracker AI

An AI-powered career engineering platform that analyzes resumes against job descriptions, identifies skill gaps, and generates personalized 30-day learning plans.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-lightgrey?style=flat-square)

---

## Live Demo

**[jobtracker.crabdance.com](https://jobtracker.crabdance.com)**

---

## Features

- **Dual Authentication** -- Email/password with JWT and Google OAuth 2.0
- **Job Pipeline Management** -- Track applications through statuses: Not Applied, Pending, Applied, In Review
- **AI Resume Analysis** -- Upload a PDF resume and receive a match score against any job description
- **Skill Gap Detection** -- Identifies specific skills missing from your resume relative to the role
- **Actionable Learning Plans** -- Generates a structured, step-by-step plan to close identified gaps
- **Real-time AI Feedback** -- WebSocket-powered live status updates during analysis via Socket.io
- **3D Interactive Visualizations** -- Dynamic Three.js sphere that responds to AI processing state

---

## Tech Stack

| Layer            | Technology              | Purpose                                      |
| ---------------- | ----------------------- | -------------------------------------------- |
| Frontend         | React 19, Vite 8        | Single-page application and build tool       |
| Styling          | Tailwind CSS 3          | Utility-first CSS framework                  |
| Animations       | Framer Motion           | Page transitions and micro-interactions      |
| 3D Graphics      | Three.js, R3F           | Interactive 3D visualizations                 |
| Backend          | Node.js, Express 5      | REST API server with middleware pipeline      |
| Database         | PostgreSQL 16           | Persistent relational data storage           |
| Auth             | JWT, Passport.js        | Token-based sessions, Google OAuth strategy  |
| File Handling    | Multer, pdf-parse       | PDF upload and text extraction               |
| AI               | Google Gemini API       | Resume analysis and skill gap detection      |
| WebSockets       | Socket.io               | Real-time bidirectional communication        |
| Process Mgmt     | PM2                     | Production process management and clustering |
| Reverse Proxy    | Nginx                   | Static file serving, request proxying        |
| SSL              | Let's Encrypt           | Automated TLS certificate management         |

---

## Architecture

```
                        Internet
                           |
                     [ Cloudflare DNS ]
                           |
                   [ Nginx :80 / :443 ]
                    /               \
       Static Files (React)    API Proxy (/api/*)
                                      |
                              [ Node.js :3000 ]
                              /       |       \
                        PostgreSQL  Socket.io  Gemini API
                         :5432     (WebSocket)
```

**Request Flow:**
1. Browser requests `https://jobtracker.crabdance.com`
2. Nginx serves React static files from `frontend/dist/`
3. API requests (`/api/*`) proxy to Node.js on port 3000
4. WebSocket connections (`/socket.io/*`) proxy to Node.js
5. Node.js queries PostgreSQL for data and calls Gemini API for analysis
6. Real-time analysis status pushed to browser via Socket.io

---

## Getting Started

### Prerequisites

- Node.js 22 or later
- PostgreSQL 16 or later
- Google Cloud Console account
- Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Installation

```bash
git clone https://github.com/DevSharma18/job-tracker.git
cd job-tracker
```

Install backend dependencies:

```bash
npm install
```

Install frontend dependencies and build:

```bash
cd frontend
npm install
npm run build
cd ..
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/jobtracker
JWT_SECRET=generate_with_openssl_rand_hex_32
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

### Database Setup

```bash
sudo -u postgres psql
```

```sql
ALTER USER postgres WITH PASSWORD 'your_password';
CREATE DATABASE jobtracker;
\q
```

### Run Development Servers

Terminal 1 -- Backend:

```bash
npm run start
```

Terminal 2 -- Frontend:

```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## API Endpoints

| Method | Endpoint                   | Description                   | Auth |
| ------ | -------------------------- | ----------------------------- | ---- |
| POST   | `/api/auth/signup`         | Register a new user           | No   |
| POST   | `/api/auth/login`          | Login with email and password | No   |
| GET    | `/api/auth/google`         | Redirect to Google OAuth      | No   |
| GET    | `/api/auth/google/callback`| Google OAuth callback         | No   |
| GET    | `/api/jobs`                | List all jobs for user        | Yes  |
| POST   | `/api/jobs`                | Add a new job application     | Yes  |
| POST   | `/api/jobs/:id/analyze`    | Upload resume and run analysis| Yes  |
| GET    | `/api/jobs/:id/analysis`   | Retrieve latest analysis      | Yes  |

---

## Project Structure

```
job-tracker/
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main application component
│   │   ├── index.css            # Global styles and Tailwind imports
│   │   └── main.jsx             # React entry point
│   ├── dist/                    # Production build output
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   └── vite.config.js           # Vite bundler configuration
├── src/
│   ├── db.js                    # PostgreSQL connection pool
│   ├── schema.sql               # Database table definitions
│   ├── middleware/
│   │   └── protect.js           # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js              # Signup, login, Google OAuth
│   │   ├── jobs.js              # Job application CRUD
│   │   └── analyze.js           # Resume upload and AI analysis
│   ├── services/
│   │   ├── gemini.js            # Google Gemini API integration
│   │   └── googleAuth.js        # Passport Google OAuth strategy
│   └── utils/
│       └── pdf.js               # PDF text extraction utility
├── nginx/
│   └── job-tracker              # Nginx reverse proxy configuration
├── uploads/                     # Temporary PDF storage (auto-cleaned)
├── .env.example                 # Environment variable template
├── server.js                    # Express server entry point
└── package.json
```

---

## Database Schema

```sql
users       id, email (unique), password, created_at
jobs        id, user_id (FK), company, role, status, description, created_at
analyses    id, job_id (FK), resume_text, match_score, missing_skills, action_plan, created_at
```

**Status values:** `not_applied`, `pending`, `applied`, `in_review`

---

## Deployment

Deployed on AWS EC2 free tier with the following production stack:

| Component    | Configuration                            |
| ------------ | ---------------------------------------- |
| Instance     | Ubuntu 24.04, t2.micro (1 vCPU, 1GB RAM)|
| Web Server   | Nginx reverse proxy                      |
| App Server   | Node.js managed by PM2                   |
| Database     | PostgreSQL 16 (self-hosted)              |
| SSL          | Let's Encrypt with auto-renewal          |
| Domain       | jobtracker.crabdance.com                 |

### Production Commands

```bash
pm2 status                         # Check running processes
pm2 logs job-tracker               # View application logs
pm2 restart job-tracker            # Restart the application
sudo certbot renew --dry-run       # Test SSL renewal
sudo systemctl status nginx        # Check Nginx status
```

---

## License

ISC
