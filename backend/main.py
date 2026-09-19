from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routes import users, careers, resume, analysis, recommendations

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI SkillGap API", version="1.0.0")

# Development/demo frontend is intentionally fixed to one URL: http://localhost:5173.
# Vite's proxy also keeps API calls same-origin in the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(careers.router)
app.include_router(resume.router)
app.include_router(analysis.router)
app.include_router(recommendations.router)

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "AI SkillGap API"}
