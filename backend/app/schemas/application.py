import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class ApplicationCreate(BaseModel):
    stage_id: uuid.UUID
    cover_letter: str | None = None


class ApplicationUpdate(BaseModel):
    status: str = Field(pattern="^(submitted|reviewed|accepted|rejected|withdrawn)$")


class ApplicationRead(BaseModel):
    id: uuid.UUID
    stage_id: uuid.UUID
    student_id: uuid.UUID
    cover_letter: str | None
    status: str
    submitted_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
