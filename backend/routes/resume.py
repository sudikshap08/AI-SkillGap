from fastapi import APIRouter, UploadFile, File, HTTPException
from ..services.resume_parser import extract_pdf_text
from ..services.skill_extractor import extract_profile
from ..config import MAX_UPLOAD_MB

router = APIRouter(prefix="/api/resume", tags=["Resume"])

@router.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF resumes are supported.")
    content = await file.read()
    if len(content) > MAX_UPLOAD_MB * 1024 * 1024:
        raise HTTPException(413, f"PDF must be smaller than {MAX_UPLOAD_MB} MB.")
    try:
        text = extract_pdf_text(content)
        return extract_profile(text)
    except ValueError as e:
        raise HTTPException(400, str(e))
