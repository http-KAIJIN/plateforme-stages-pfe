import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.stage import Stage
from app.models.user import User
from app.schemas.stage import StageCreate, StageRead, StageUpdate
from app.services.activity_log_service import log_activity
from app.utils.dependencies import get_current_user, require_roles

router = APIRouter()


@router.get("", response_model=list[StageRead])
def list_stages(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Stage)
    if current_user.role == "company":
        query = query.filter(Stage.company_id == current_user.id)
    elif current_user.role in {"student", "supervisor"}:
        query = query.filter(Stage.status == "published")
    return query.order_by(Stage.created_at.desc()).all()


@router.get("/{stage_id}", response_model=StageRead)
def get_stage(stage_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stage = db.get(Stage, stage_id)
    if not stage:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stage not found")
    if current_user.role == "company" and stage.company_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    if current_user.role in {"student", "supervisor"} and stage.status != "published":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    return stage


@router.post("", response_model=StageRead, status_code=status.HTTP_201_CREATED)
def create_stage(
    payload: StageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("company", "admin")),
):
    stage = Stage(**payload.model_dump(), company_id=current_user.id)
    db.add(stage)
    log_activity(db, "create_stage", current_user.id, f"Created stage {payload.title}")
    db.commit()
    db.refresh(stage)
    return stage


@router.put("/{stage_id}", response_model=StageRead)
def update_stage(
    stage_id: uuid.UUID,
    payload: StageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("company", "admin")),
):
    stage = db.get(Stage, stage_id)
    if not stage:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stage not found")
    if current_user.role != "admin" and stage.company_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(stage, key, value)
    db.commit()
    db.refresh(stage)
    return stage


@router.delete("/{stage_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_stage(
    stage_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("company", "admin")),
):
    stage = db.get(Stage, stage_id)
    if not stage:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stage not found")
    if current_user.role != "admin" and stage.company_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    db.delete(stage)
    db.commit()
