import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.database.session import get_db
from app.models.pfe import PFE
from app.models.report import Report
from app.models.user import User
from app.schemas.report import ReportRead
from app.services.activity_log_service import log_activity
from app.services.notification_service import create_notification
from app.utils.dependencies import get_current_user

router = APIRouter()


def _can_access_pfe(user: User, pfe: PFE) -> bool:
    return user.role == "admin" or user.id in {pfe.student_id, pfe.company_id, pfe.supervisor_id}


@router.post("/{pfe_id}/upload", response_model=ReportRead, status_code=status.HTTP_201_CREATED)
def upload_report(
    pfe_id: uuid.UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pfe = db.get(PFE, pfe_id)
    if not pfe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="PFE not found")
    if not _can_access_pfe(current_user, pfe):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")

    settings = get_settings()
    if not file.filename or Path(file.filename).suffix.lower() not in {".pdf", ".doc", ".docx"}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file extension")
    max_size = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)
    if size > max_size:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="File too large")
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)
    safe_name = f"{uuid.uuid4()}_{Path(file.filename or 'rapport').name}"
    file_path = upload_dir / safe_name
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    report = Report(
        pfe_id=pfe.id,
        author_id=current_user.id,
        filename=file.filename or safe_name,
        file_path=str(file_path),
        content_type=file.content_type,
    )
    db.add(report)
    if pfe.supervisor_id and pfe.supervisor_id != current_user.id:
        create_notification(db, pfe.supervisor_id, "Rapport depose", f"Un rapport a ete depose pour {pfe.title}.")
    log_activity(db, "upload_report", current_user.id, f"Uploaded report for PFE {pfe.title}")
    db.commit()
    db.refresh(report)
    return report


@router.get("", response_model=list[ReportRead])
def list_reports(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Report).join(PFE)
    if current_user.role == "student":
        query = query.filter(PFE.student_id == current_user.id)
    elif current_user.role == "company":
        query = query.filter(PFE.company_id == current_user.id)
    elif current_user.role == "supervisor":
        query = query.filter(PFE.supervisor_id == current_user.id)
    return query.order_by(Report.created_at.desc()).all()


@router.get("/{report_id}/download")
def download_report(
    report_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    report = db.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    if not _can_access_pfe(current_user, report.pfe):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    path = Path(report.file_path)
    if not path.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    return FileResponse(path, media_type=report.content_type, filename=report.filename)
