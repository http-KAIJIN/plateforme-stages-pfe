import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserRead, UserUpdate
from app.services.activity_log_service import log_activity
from app.utils.dependencies import require_roles

router = APIRouter()


@router.get("", response_model=list[UserRead])
def list_users(
    search: str | None = Query(default=None),
    role: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    query = db.query(User)
    if search:
        value = f"%{search.lower()}%"
        query = query.filter(or_(User.full_name.ilike(value), User.email.ilike(value)))
    if role:
        query = query.filter(User.role == role)
    return query.order_by(User.created_at.desc()).all()


@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(require_roles("admin"))):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserRead)
def update_user(
    user_id: uuid.UUID,
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(user, key, value)
    log_activity(db, "update_user", current_user.id, f"Updated user {user.email}")
    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(require_roles("admin"))):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete current admin account")
    log_activity(db, "delete_user", current_user.id, f"Deleted user {user.email}")
    db.delete(user)
    db.commit()
