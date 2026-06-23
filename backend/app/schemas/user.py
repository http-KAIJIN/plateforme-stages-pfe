import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    full_name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    role: str = Field(pattern="^(student|company|supervisor|admin)$")
    phone: str | None = None


class UserCreate(UserBase):
    password: str = Field(min_length=8)


class UserRead(UserBase):
    id: uuid.UUID
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=150)
    email: EmailStr | None = None
    role: str | None = Field(default=None, pattern="^(student|company|supervisor|admin)$")
    phone: str | None = None
    is_active: bool | None = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
