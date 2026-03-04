from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.Base import DCBase

if TYPE_CHECKING:
    from app.models.User import User
    from app.models.Vacancy import Vacancy


class SavedVacancy(DCBase):
    __tablename__ = "saved_vacancies"

    id: Mapped[int] = mapped_column(primary_key=True, init=False)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    vacancy_id: Mapped[int] = mapped_column(
        ForeignKey("vacancies.id", ondelete="CASCADE"),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now(),
        nullable=False,
        init=False,
    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="saved_vacancies",
        init=False,
    )
    vacancy: Mapped["Vacancy"] = relationship(
        "Vacancy",
        back_populates="saved_by_users",
        init=False,
    )

    __table_args__ = (
        UniqueConstraint("user_id", "vacancy_id", name="uq_saved_vacancy_user_vacancy"),
    )
