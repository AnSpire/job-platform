from __future__ import annotations

from typing import Sequence

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.dto.VacancyTranslation import Lang, VacancyTranslationCreate
from app.models.Vacancy import Vacancy
from app.models.VacancyTranslation import VacancyTranslation
from app.repositories.Exceptions import ConstraintError, ConflictError, ForeignKeyError, NotFoundError


def _classify_vacancy_translation_integrity_error(e: IntegrityError) -> Exception:
    orig = getattr(e, "orig", None)

    constraint = None
    diag = getattr(orig, "diag", None)
    if diag is not None:
        constraint = getattr(diag, "constraint_name", None)

    if constraint:
        c = constraint.lower()

        if "fkey" in c or "foreign" in c:
            if "vacancy" in c:
                return ForeignKeyError("vacancy not found")
            return ForeignKeyError(f"foreign key violation: {constraint}")

        if "uq_vt_vacancy_lang" in c:
            return ConflictError("translation for this language already exists")

        if "check_vt_lang_en_es" in c:
            return ConstraintError("lang must be one of: en, es")

        if "unique" in c or c.endswith("_key") or "key" in c:
            return ConflictError("unique constraint violation")

        return ConstraintError(f"constraint violation: {constraint}")

    msg = str(orig).lower() if orig else str(e).lower()
    if "foreign key" in msg:
        return ForeignKeyError("foreign key violation")
    if "check constraint" in msg or "violates check constraint" in msg:
        return ConstraintError("check constraint violation")
    if "unique" in msg or "duplicate" in msg:
        return ConflictError("unique constraint violation")
    return ConstraintError("integrity constraint violation")


class VacancyTranslationRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def vacancy_exists(self, vacancy_id: int) -> bool:
        result = await self.session.execute(
            select(Vacancy.id).where(Vacancy.id == vacancy_id)
        )
        return result.scalar_one_or_none() is not None

    async def list_by_vacancy(self, vacancy_id: int) -> Sequence[VacancyTranslation]:
        result = await self.session.execute(
            select(VacancyTranslation)
            .where(VacancyTranslation.vacancy_id == vacancy_id)
            .order_by(VacancyTranslation.id.desc())
        )
        return result.scalars().all()

    async def get_raw_by_vacancy_and_lang(self, vacancy_id: int, lang: Lang) -> VacancyTranslation | None:
        result = await self.session.execute(
            select(VacancyTranslation).where(
                VacancyTranslation.vacancy_id == vacancy_id,
                VacancyTranslation.lang == lang,
            )
        )
        return result.scalars().first()

    async def get_by_vacancy_and_lang(self, vacancy_id: int, lang: Lang) -> VacancyTranslation:
        translation = await self.get_raw_by_vacancy_and_lang(vacancy_id, lang)
        if not translation:
            raise NotFoundError("translation not found")
        return translation

    async def upsert(self, vacancy_id: int, lang: Lang, data: VacancyTranslationCreate) -> VacancyTranslation:
        translation = await self.get_raw_by_vacancy_and_lang(vacancy_id, lang)

        if translation is None:
            translation = VacancyTranslation(
                vacancy_id=vacancy_id,
                lang=lang,
                title=data.title,
                description=data.description,
                requirements=data.requirements,
                responsibilities=data.responsibilities,
            )
            self.session.add(translation)
        else:
            translation.title = data.title
            translation.description = data.description
            translation.requirements = data.requirements
            translation.responsibilities = data.responsibilities

        try:
            await self.session.flush()
        except IntegrityError as e:
            raise _classify_vacancy_translation_integrity_error(e) from e

        return translation

    async def delete(self, vacancy_id: int, lang: Lang) -> None:
        translation = await self.get_raw_by_vacancy_and_lang(vacancy_id, lang)
        if not translation:
            raise NotFoundError("translation not found")

        await self.session.delete(translation)
        try:
            await self.session.flush()
        except IntegrityError as e:
            raise _classify_vacancy_translation_integrity_error(e) from e
