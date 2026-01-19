# app/models/Resume.py
from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.Base import DCBase

if TYPE_CHECKING:
    from app.models.User import User
    from app.models.Application import Application


class Resume(DCBase):
    __tablename__ = "resumes"

    id: Mapped[int] = mapped_column(primary_key=True, init=False)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(String(150), nullable=False)
    file_path: Mapped[str] = mapped_column(String(255), nullable=False)

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

    user: Mapped["User"] = relationship(
        "User",
        back_populates="resumes",
        init=False,
    )

    applications: Mapped[list["Application"]] = relationship(
        "Application",
        back_populates="resume",
        cascade="all, delete-orphan",
        init=False,
        passive_deletes=True,
    )
