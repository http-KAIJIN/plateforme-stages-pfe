import uuid
from datetime import datetime

from pydantic import BaseModel


class ActivityLogRead(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID | None
    action: str
    details: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
