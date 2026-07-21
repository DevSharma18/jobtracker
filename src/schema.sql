CREATE TABLE IF NOT EXISTS users (
    id         SERIAL PRIMARY KEY,
    email      VARCHAR(255) UNIQUE NOT NULL,
    password   TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

CREATE TABLE IF NOT EXISTS jobs (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    company     VARCHAR(255) NOT NULL,
    role        VARCHAR(255) NOT NULL,
    status      VARCHAR(50) DEFAULT 'applied', 
    description TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analyses (
    id             SERIAL PRIMARY KEY,
    job_id         INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    resume_text    TEXT NOT NULL,
    match_score    INTEGER NOT NULL,
    missing_skills TEXT NOT NULL,
    action_plan    TEXT NOT NULL,
    created_at     TIMESTAMPTZ DEFAULT NOW()
);