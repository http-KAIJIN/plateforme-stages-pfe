import uuid
from datetime import datetime

from pydantic import BaseModel


class ReportRead(BaseModel):
    id: uuid.UUID
    pfe_id: uuid.UUID
    author_id: uuid.UUID
    filename: str
    content_type: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
