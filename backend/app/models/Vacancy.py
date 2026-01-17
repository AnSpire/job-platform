from __future__ import annotations
from datetime import datetime
from sqlalchemy import String, Text, ForeignKey, Integer, CheckConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.Base import DCBase
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.Employer import Employer
    from app.models.Company import Company


class Vacancy(DCBase):
    __tablename__ = "vacancies"

    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    requirements: Mapped[str] = mapped_column(Text, nullable=True)
    responsibilities: Mapped[str] = mapped_column(Text, nullable=True)
    salary_from: Mapped[int] = mapped_column(Integer, nullable=True)
    salary_to: Mapped[int] = mapped_column(Integer, nullable=True)
    currency: Mapped[str] = mapped_column(String(10), nullable=True)
    location: Mapped[str] = mapped_column(String(100), nullable=True)
    employment_type: Mapped[str] = mapped_column(String(30), nullable=True)

    employer_id: Mapped[int] = mapped_column(ForeignKey("employers.id", ondelete="CASCADE"), nullable=False)

    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now(), nullable=False)

    employer: Mapped[Employer] = relationship("Employer", back_populates="vacancies")

    __table_args__ = (
        CheckConstraint("salary_from >= 0 AND salary_to >= 0", name="check_salary_positive"),
    )

    def __repr__(self):
        return f"<Vacancy id={self.id} title={self.title!r} company_id={self.company_id}>"
