# app/models/VacancyTranslation.py
from __future__ import annotations

from typing import Optional, TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text, UniqueConstraint, Index, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.Base import DCBase

if TYPE_CHECKING:
    from app.models.Vacancy import Vacancy


class VacancyTranslation(DCBase):
    __tablename__ = "vacancy_translations"

    id: Mapped[int] = mapped_column(primary_key=True, init=False)

    vacancy_id: Mapped[int] = mapped_column(
        ForeignKey("vacancies.id", ondelete="CASCADE"),
        nullable=False,
    )

    # Только переводы. RU сидит в vacancies.
    lang: Mapped[str] = mapped_column(String(2), nullable=False)

    title: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    requirements: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    responsibilities: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    vacancy: Mapped["Vacancy"] = relationship(
        "Vacancy",
        back_populates="translations",
        init=False,
    )

    __table_args__ = (
        UniqueConstraint("vacancy_id", "lang", name="uq_vt_vacancy_lang"),
        Index("ix_vt_vacancy_lang", "vacancy_id", "lang"),

        # Запрещаем ru в таблице переводов, потому что ru — в vacancies
        CheckConstraint("lang IN ('en','es')", name="check_vt_lang_en_es"),
    )

    def __repr__(self) -> str:
        return f"<VacancyTranslation id={self.id} vacancy_id={self.vacancy_id} lang={self.lang!r}>"
