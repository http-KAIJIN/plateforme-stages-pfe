import uuid
from datetime import date, datetime

from pydantic import BaseModel, Field


class StageBase(BaseModel):
    title: str = Field(min_length=3, max_length=180)
    description: str = Field(min_length=10)
    requirements: str | None = None
    location: str | None = None
    duration: str | None = None
    stage_type: str = Field(default="internship", pattern="^(internship|pfe|internship_or_pfe)$")
    status: str = Field(default="published", pattern="^(draft|published|closed|archived)$")
    deadline: date | None = None


class StageCreate(StageBase):
    pass


class StageUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=180)
    description: str | None = Field(default=None, min_length=10)
    requirements: str | None = None
    location: str | None = None
    duration: str | None = None
    stage_type: str | None = Field(default=None, pattern="^(internship|pfe|internship_or_pfe)$")
    status: str | None = Field(default=None, pattern="^(draft|published|closed|archived)$")
    deadline: date | None = None


class StageRead(StageBase):
    id: uuid.UUID
    company_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
