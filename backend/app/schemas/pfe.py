import uuid
from datetime import date, datetime

from pydantic import BaseModel, Field


class PFECreate(BaseModel):
    title: str = Field(min_length=3, max_length=180)
    description: str = Field(min_length=10)
    student_id: uuid.UUID
    company_id: uuid.UUID | None = None
    supervisor_id: uuid.UUID | None = None
    application_id: uuid.UUID | None = None
    status: str = Field(default="proposed", pattern="^(proposed|approved|in_progress|completed|cancelled)$")
    start_date: date | None = None
    end_date: date | None = None


class PFEUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=180)
    description: str | None = Field(default=None, min_length=10)
    company_id: uuid.UUID | None = None
    supervisor_id: uuid.UUID | None = None
    status: str | None = Field(default=None, pattern="^(proposed|approved|in_progress|completed|cancelled)$")
    start_date: date | None = None
    end_date: date | None = None


class PFERead(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    student_id: uuid.UUID
    company_id: uuid.UUID | None
    supervisor_id: uuid.UUID | None
    application_id: uuid.UUID | None
    status: str
    start_date: date | None
    end_date: date | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
