import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.pfe import PFE
from app.models.user import User
from app.schemas.pfe import PFECreate, PFERead, PFEUpdate
from app.services.email_service import send_email
from app.services.notification_service import create_notification
from app.utils.dependencies import get_current_user, require_roles

router = APIRouter()


@router.post("", response_model=PFERead, status_code=status.HTTP_201_CREATED)
def create_pfe(
    payload: PFECreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "supervisor")),
):
    pfe = PFE(**payload.model_dump())
    if current_user.role == "supervisor" and pfe.supervisor_id is None:
        pfe.supervisor_id = current_user.id
    db.add(pfe)
    db.commit()
    db.refresh(pfe)
    return pfe


@router.get("", response_model=list[PFERead])
def list_pfe(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(PFE)
    if current_user.role == "student":
        query = query.filter(PFE.student_id == current_user.id)
    elif current_user.role == "company":
        query = query.filter(PFE.company_id == current_user.id)
    elif current_user.role == "supervisor":
        query = query.filter(PFE.supervisor_id == current_user.id)
    return query.order_by(PFE.created_at.desc()).all()


@router.put("/{pfe_id}", response_model=PFERead)
def update_pfe(
    pfe_id: uuid.UUID,
    payload: PFEUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "supervisor")),
):
    pfe = db.get(PFE, pfe_id)
    if not pfe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="PFE not found")
    if current_user.role == "supervisor" and pfe.supervisor_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(pfe, key, value)
    if payload.status == "approved":
        create_notification(db, pfe.student_id, "PFE valide", f"Votre PFE {pfe.title} a ete valide.")
        background_tasks.add_task(send_email, pfe.student.email, "PFE valide", f"Votre PFE {pfe.title} a ete valide.")
    db.commit()
    db.refresh(pfe)
    return pfe
