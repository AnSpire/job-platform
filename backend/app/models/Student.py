# app/models/Student.py
from __future__ import annotations

from typing import Optional, TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.Base import DCBase

if TYPE_CHECKING:
    from app.models.User import User


class Student(DCBase):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(primary_key=True, init=False)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )

    university: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    faculty: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    course: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Атрибут в Python безопасный, а колонка в БД остаётся "group" (если она уже была)
    group_name: Mapped[Optional[str]] = mapped_column("group", String(50), nullable=True)

    user: Mapped["User"] = relationship(
        "User",
        back_populates="student_profile",
        init=False,
    )

    def __repr__(self) -> str:
        return f"<Student id={self.id} user_id={self.user_id}>"
