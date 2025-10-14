from __future__ import annotations
from datetime import datetime
from sqlalchemy import String, Text, ForeignKey, Enum, func, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.Base import DCBase
import enum

from app.models.Resume import Resume
from app.models.Vacancy import Vacancy



class ApplicationStatus(enum.Enum):
    SENT = "sent"           # отклик отправлен
    VIEWED = "viewed"       # работодатель просмотрел
    INVITED = "invited"     # приглашение на интервью
    REJECTED = "rejected"   # отказ
    ACCEPTED = "accepted"   # предложение о работе


class Application(DCBase):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    message: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), nullable=False, init=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now(), nullable=False, init=False
    )
    resume_id: Mapped[int] = mapped_column(
        ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False
    )
    vacancy_id: Mapped[int] = mapped_column(
        ForeignKey("vacancies.id", ondelete="CASCADE"), nullable=False
    )

    status: Mapped[ApplicationStatus] = mapped_column(
        Enum(ApplicationStatus, name="application_status"), 
        default=ApplicationStatus.SENT,
        nullable=False
    )

    
    resume: Mapped[Resume] = relationship("Resume", back_populates="applications", init=False)
    vacancy: Mapped[Vacancy] = relationship("Vacancy", back_populates="applications", init=False)

    __table_args__ = (
        CheckConstraint("resume_id > 0 AND vacancy_id > 0", name="check_ids_positive"),
    )

    def __repr__(self):
        return f"<Application id={self.id} resume_id={self.resume_id} vacancy_id={self.vacancy_id} status={self.status.value!r}>"
