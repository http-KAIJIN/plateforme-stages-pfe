import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.application import Application
from app.models.stage import Stage
from app.models.user import User
from app.schemas.application import ApplicationCreate, ApplicationRead, ApplicationUpdate
from app.services.activity_log_service import log_activity
from app.services.email_service import send_email
from app.services.notification_service import create_notification
from app.utils.dependencies import get_current_user, require_roles

router = APIRouter()


@router.post("", response_model=ApplicationRead, status_code=status.HTTP_201_CREATED)
def create_application(
    payload: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("student", "admin")),
):
    stage = db.get(Stage, payload.stage_id)
    if not stage or stage.status != "published":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Published stage not found")
    student_id = current_user.id
    existing = db.query(Application).filter_by(stage_id=payload.stage_id, student_id=student_id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Application already exists")
    application = Application(**payload.model_dump(), student_id=student_id)
    db.add(application)
    create_notification(db, stage.company_id, "Nouvelle candidature", f"Une candidature a ete envoyee pour {stage.title}.")
    log_activity(db, "create_application", current_user.id, f"Applied to stage {stage.title}")
    db.commit()
    db.refresh(application)
    return application


@router.get("", response_model=list[ApplicationRead])
def list_applications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Application).join(Stage)
    if current_user.role == "student":
        query = query.filter(Application.student_id == current_user.id)
    elif current_user.role == "company":
        query = query.filter(Stage.company_id == current_user.id)
    elif current_user.role not in {"admin", "supervisor"}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    return query.order_by(Application.submitted_at.desc()).all()


@router.put("/{application_id}", response_model=ApplicationRead)
def update_application(
    application_id: uuid.UUID,
    payload: ApplicationUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("company", "admin")),
):
    application = db.get(Application, application_id)
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    if current_user.role != "admin" and application.stage.company_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    application.status = payload.status
    if payload.status in {"accepted", "rejected"}:
        title = "Candidature acceptee" if payload.status == "accepted" else "Candidature refusee"
        message = f"Votre candidature pour {application.stage.title} a ete {payload.status}."
        create_notification(db, application.student_id, title, message)
        background_tasks.add_task(send_email, application.student.email, title, message)
    log_activity(db, "update_application", current_user.id, f"Application {application.id} set to {payload.status}")
    db.commit()
    db.refresh(application)
    return application
