# AI SkillGap — Personalized Career Readiness & Roadmap Generator

**Tagline:** Know where you stand. Know what to learn next.

A complete internship-level full-stack AI/ML career readiness project using:

- Frontend: React + Vite + React Router + Axios + Lucide React
- Backend: Python + FastAPI + Pydantic + SQLAlchemy
- Database: MySQL
- Resume parsing: PyMuPDF
- Skill normalization and deterministic readiness engine
- Optional OpenAI-compatible LLM explanations with deterministic fallback
- Personalized prerequisite-aware roadmap
- Curated free resources
- Project recommendations
- What-If score simulator
- Analysis history

## Project structure

```text
ai-skillgap/
├── backend/
├── frontend/
├── database/
├── tests/
├── .env.example
└── README.md
```

## Windows setup

### 1. MySQL
Create the database:

```sql
CREATE DATABASE ai_skillgap CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend
Open PowerShell in the project root:

```powershell
python -m venv backend\.venv
.\backend\.venv\Scripts\activate
pip install -r backend\requirements.txt
```

Copy `.env.example` to `.env` and change `YOUR_PASSWORD`.

Seed:

```powershell
python -m backend.seed.seed_data
```

Run:

```powershell
uvicorn backend.main:app --reload --port 8000
```

API docs:

`http://127.0.0.1:8000/docs`

### 3. React frontend
Open a second PowerShell:

```powershell
cd frontend
npm install
npm run dev
```

Open:

`http://localhost:5173`

## Demo flow

1. Open Analyze Skills.
2. Choose one of six career roles.
3. Enter skills or upload a PDF resume.
4. Run analysis.
5. View readiness score.
6. Review Strong / Improvement / Missing skills.
7. Open Roadmap.
8. Open Resources.
9. Review Projects.
10. Use What-If simulator.
11. Check History.

## Readiness methodology

For each required role skill:

- Strong = 1.0
- Improvement = 0.5
- Missing = 0.0

The score is the weighted average using role-skill importance.

Prerequisites are inserted before dependent skills in the roadmap.

## Security / engineering notes

- PDF-only upload validation
- Upload size limit
- CORS configuration
- `.env` excluded from Git
- SQLAlchemy ORM instead of raw SQL in application logic
- LLM is optional; core functionality works without an API key
- Error messages are returned through FastAPI HTTP exceptions

## Future improvements

- JWT authentication
- bcrypt password hashing
- OCR for scanned resumes
- richer NLP skill extraction
- PostgreSQL production deployment
- Celery/background jobs
- richer LLM explanations
- automated job-description parsing
- cloud deployment and CI/CD
