import uuid
from datetime import date, datetime
from typing import Optional

from sqlalchemy import Date, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class PFE(Base):
    __tablename__ = "pfe"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(180), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    student_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    company_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    supervisor_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    application_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("applications.id", ondelete="SET NULL"), nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="proposed", nullable=False)
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    student: Mapped["User"] = relationship(back_populates="pfe_projects", foreign_keys=[student_id])
    company: Mapped[Optional["User"]] = relationship(foreign_keys=[company_id])
    supervisor: Mapped[Optional["User"]] = relationship(back_populates="supervised_pfe", foreign_keys=[supervisor_id])
    application: Mapped[Optional["Application"]] = relationship(back_populates="pfe")
    reports: Mapped[list["Report"]] = relationship(back_populates="pfe", cascade="all, delete-orphan")
