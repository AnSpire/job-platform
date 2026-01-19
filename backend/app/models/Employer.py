# app/models/Employer.py
from __future__ import annotations

from typing import Optional, TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.Base import DCBase

if TYPE_CHECKING:
    from app.models.User import User
    from app.models.Company import Company
    from app.models.Vacancy import Vacancy


class Employer(DCBase):
    __tablename__ = "employers"

    id: Mapped[int] = mapped_column(primary_key=True, init=False)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )

    # nullable=True => логичнее SET NULL (а не CASCADE)
    company_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("companies.id", ondelete="SET NULL"),
        nullable=True,
    )

    position: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    user: Mapped["User"] = relationship(
        "User",
        back_populates="employer_profile",
        init=False,
    )

    company: Mapped[Optional["Company"]] = relationship(
        "Company",
        back_populates="employers",
        init=False,
    )

    vacancies: Mapped[list["Vacancy"]] = relationship(
        "Vacancy",
        back_populates="employer",
        cascade="all, delete-orphan",
        single_parent=True,
        init=False,
        passive_deletes=True,
    )
