from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.activity_log import ActivityLog
from app.models.user import User
from app.schemas.activity_log import ActivityLogRead
from app.utils.dependencies import require_roles

router = APIRouter()


@router.get("", response_model=list[ActivityLogRead])
def list_activity_logs(db: Session = Depends(get_db), current_user: User = Depends(require_roles("admin"))):
    return db.query(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(200).all()
