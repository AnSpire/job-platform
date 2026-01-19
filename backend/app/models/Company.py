# app/models/Company.py
from __future__ import annotations

from datetime import datetime
from typing import Optional, TYPE_CHECKING

from sqlalchemy import String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.Base import DCBase

if TYPE_CHECKING:
    from app.models.Employer import Employer


class Company(DCBase):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(primary_key=True, init=False)

    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    website: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    industry: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now(),
        nullable=False,
        init=False,
    )

    # Вариант B: у Company нет прямых вакансий.
    # Компания связана с вакансиями через employers -> vacancies.
    employers: Mapped[list["Employer"]] = relationship(
        "Employer",
        back_populates="company",
        init=False,
        passive_deletes=True,
    )
