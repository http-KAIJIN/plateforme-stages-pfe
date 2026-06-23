import re
import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from pypdf import PdfReader
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.stage import Stage
from app.models.user import User
from app.utils.dependencies import get_current_user

router = APIRouter()

KEYWORDS = {
    "python", "sql", "machine learning", "docker", "kubernetes", "fastapi", "react",
    "postgresql", "javascript", "typescript", "linux", "git", "api", "data", "pandas",
}


def extract_pdf_text(file: UploadFile) -> str:
    try:
        reader = PdfReader(file.file)
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid PDF file") from exc


def detect_keywords(text: str) -> set[str]:
    lowered = text.lower()
    return {keyword for keyword in KEYWORDS if re.search(rf"\b{re.escape(keyword)}\b", lowered)}


@router.post("/match-cv")
def match_cv(
    file: UploadFile = File(...),
    stage_id: uuid.UUID | None = Form(default=None),
    offer_text: str | None = Form(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only PDF files are accepted")

    text = extract_pdf_text(file)
    target_text = offer_text or ""
    if stage_id:
        stage = db.get(Stage, stage_id)
        if not stage:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stage not found")
        target_text = f"{stage.title} {stage.description} {stage.requirements or ''}"

    cv_skills = detect_keywords(text)
    required_skills = detect_keywords(target_text) or detect_keywords(text)
    detected = sorted(cv_skills & required_skills if target_text else cv_skills)
    missing = sorted(required_skills - cv_skills)
    score = 100 if not required_skills else round((len(detected) / len(required_skills)) * 100)

    return {
        "compatibility": score,
        "detected_skills": detected,
        "missing_skills": missing,
    }
