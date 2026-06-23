import uuid

from sqlalchemy.orm import Session

from app.models.activity_log import ActivityLog


def log_activity(db: Session, action: str, user_id: uuid.UUID | None = None, details: str | None = None) -> ActivityLog:
    log = ActivityLog(user_id=user_id, action=action, details=details)
    db.add(log)
    return log
