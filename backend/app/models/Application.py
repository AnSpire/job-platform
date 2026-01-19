# app/models/Application.py
from __future__ import annotations

from datetime import datetime
from typing import Optional, TYPE_CHECKING
import enum

from sqlalchemy import CheckConstraint, Enum as SAEnum, ForeignKey, Text, UniqueConstraint, func, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.Base import DCBase

if TYPE_CHECKING:
    from app.models.Resume import Resume
    from app.models.Vacancy import Vacancy


class ApplicationStatus(enum.Enum):
    SENT = "sent"
    VIEWED = "viewed"
    INVITED = "invited"
    REJECTED = "rejected"
    ACCEPTED = "accepted"


class Application(DCBase):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(primary_key=True, init=False)

    message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now(),
        nullable=False,
        init=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
        init=False,
    )

    resume_id: Mapped[int] = mapped_column(
        ForeignKey("resumes.id", ondelete="CASCADE"),
        nullable=False,
    )
    vacancy_id: Mapped[int] = mapped_column(
        ForeignKey("vacancies.id", ondelete="CASCADE"),
        nullable=False,
    )

    status: Mapped[ApplicationStatus] = mapped_column(
        SAEnum(ApplicationStatus, name="application_status"),
        nullable=False,
        default=ApplicationStatus.SENT,
        server_default=text("'sent'"),
    )

    resume: Mapped["Resume"] = relationship(
        "Resume",
        back_populates="applications",
        init=False,
    )
    vacancy: Mapped["Vacancy"] = relationship(
        "Vacancy",
        back_populates="applications",
        init=False,
    )

    __table_args__ = (
        CheckConstraint("resume_id > 0 AND vacancy_id > 0", name="check_ids_positive"),
        # Защита от дублей: одно резюме не может откликнуться на одну вакансию дважды
        UniqueConstraint("resume_id", "vacancy_id", name="uq_application_resume_vacancy"),
    )

    def __repr__(self) -> str:
        return (
            f"<Application id={self.id} resume_id={self.resume_id} "
            f"vacancy_id={self.vacancy_id} status={self.status.value!r}>"
        )
