import uuid
from datetime import datetime

from pydantic import BaseModel


class NotificationRead(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    message: str
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}
