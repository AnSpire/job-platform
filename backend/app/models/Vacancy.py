# app/models/Vacancy.py
from __future__ import annotations

from datetime import datetime
from typing import Optional, TYPE_CHECKING

from sqlalchemy import CheckConstraint, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.Base import DCBase

if TYPE_CHECKING:
    from app.models.Employer import Employer
    from app.models.Application import Application


class Vacancy(DCBase):
    __tablename__ = "vacancies"

    id: Mapped[int] = mapped_column(primary_key=True, init=False)

    title: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    requirements: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    responsibilities: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    salary_from: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    salary_to: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    currency: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)

    location: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    employment_type: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)

    # Вариант B: только employer_id, company_id нет
    employer_id: Mapped[int] = mapped_column(
        ForeignKey("employers.id", ondelete="CASCADE"),
        nullable=False,
    )

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

    employer: Mapped["Employer"] = relationship(
        "Employer",
        back_populates="vacancies",
        init=False,
    )

    applications: Mapped[list["Application"]] = relationship(
        "Application",
        back_populates="vacancy",
        cascade="all, delete-orphan",
        init=False,
        passive_deletes=True,
    )

    __table_args__ = (
        # NULL допустим; проверяем только если значение задано
        CheckConstraint("(salary_from IS NULL OR salary_from >= 0)", name="check_salary_from_positive"),
        CheckConstraint("(salary_to IS NULL OR salary_to >= 0)", name="check_salary_to_positive"),
        CheckConstraint(
            "(salary_from IS NULL OR salary_to IS NULL OR salary_from <= salary_to)",
            name="check_salary_range",
        ),
    )

    def __repr__(self) -> str:
        return f"<Vacancy id={self.id} title={self.title!r} employer_id={self.employer_id}>"
