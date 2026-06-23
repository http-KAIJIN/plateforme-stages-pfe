import uuid

from sqlalchemy.orm import Session

from app.models.notification import Notification


def create_notification(db: Session, user_id: uuid.UUID, title: str, message: str) -> Notification:
    notification = Notification(user_id=user_id, title=title, message=message)
    db.add(notification)
    return notification
