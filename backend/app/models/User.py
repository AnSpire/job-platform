# app/models/User.py
from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import CheckConstraint, String, Text, func
from sqlalchemy.dialects.postgresql import CITEXT
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.Base import DCBase

if TYPE_CHECKING:
    from app.models.Employer import Employer
    from app.models.Student import Student
    from app.models.Resume import Resume


class User(DCBase):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    email: Mapped[str] = mapped_column(CITEXT, unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)

    first_name: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)
    last_name: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)

    role: Mapped[str] = mapped_column(String(20), nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now(),
        nullable=False,
        init=False,
    )

    __table_args__ = (
        CheckConstraint("role IN ('student', 'employer', 'admin')", name="check_role"),
    )

    employer_profile: Mapped[Optional["Employer"]] = relationship(
        "Employer",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
        init=False,
        default=None,
    )

    student_profile: Mapped[Optional["Student"]] = relationship(
        "Student",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
        init=False,
        default=None,
    )

    resumes: Mapped[list["Resume"]] = relationship(
        "Resume",
        back_populates="user",
        cascade="all, delete-orphan",
        init=False,
    )

    def __str__(self) -> str:
        return f"User(id={self.id}, first_name={self.first_name}, email={self.email}, role={self.role})"
