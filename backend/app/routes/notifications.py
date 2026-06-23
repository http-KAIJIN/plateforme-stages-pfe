import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.notification import Notification
from app.models.user import User
from app.schemas.notification import NotificationRead
from app.utils.dependencies import get_current_user

router = APIRouter()


@router.get("", response_model=list[NotificationRead])
def list_notifications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .all()
    )


@router.put("/{notification_id}/read", response_model=NotificationRead)
def mark_as_read(notification_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    notification = db.get(Notification, notification_id)
    if not notification or notification.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification
