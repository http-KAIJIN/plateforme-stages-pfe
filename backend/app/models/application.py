import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class Application(Base):
    __tablename__ = "applications"
    __table_args__ = (UniqueConstraint("stage_id", "student_id", name="uq_application_stage_student"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    stage_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("stages.id", ondelete="CASCADE"), nullable=False)
    student_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    cover_letter: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="submitted", nullable=False)
    submitted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    stage: Mapped["Stage"] = relationship(back_populates="applications")
    student: Mapped["User"] = relationship(back_populates="applications")
    pfe: Mapped[Optional["PFE"]] = relationship(back_populates="application")
