import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    email: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(30), index=True, nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    stages: Mapped[list["Stage"]] = relationship(back_populates="company", cascade="all, delete-orphan")
    applications: Mapped[list["Application"]] = relationship(back_populates="student", cascade="all, delete-orphan")
    supervised_pfe: Mapped[list["PFE"]] = relationship(back_populates="supervisor", foreign_keys="PFE.supervisor_id")
    pfe_projects: Mapped[list["PFE"]] = relationship(back_populates="student", foreign_keys="PFE.student_id")
    reports: Mapped[list["Report"]] = relationship(back_populates="author")
    notifications: Mapped[list["Notification"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    activity_logs: Mapped[list["ActivityLog"]] = relationship(back_populates="user")
