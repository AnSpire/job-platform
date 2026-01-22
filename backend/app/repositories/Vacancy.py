from __future__ import annotations

from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.models.Vacancy import Vacancy
from app.dto.Vacancy import VacancyCreate, VacancyUpdate  # подстрой под свои пути/имена DTO
from app.repositories.Exceptions import (
    NotFoundError,
    ConflictError,
    ConstraintError,
    ForeignKeyError,
)


def _classify_vacancy_integrity_error(e: IntegrityError) -> Exception:
    """
    Классификация IntegrityError для Vacancy.
    В идеале отличаем причины по имени constraint в Postgres:
    e.orig.diag.constraint_name
    """
    orig = getattr(e, "orig", None)

    constraint = None
    diag = getattr(orig, "diag", None)
    if diag is not None:
        constraint = getattr(diag, "constraint_name", None)

    if constraint:
        c = constraint.lower()

        # FK: employer_id -> employers.id
        # имена часто вида: vacancies_employer_id_fkey (или как в миграциях)
        if "fkey" in c or "foreign" in c:
            if "employer" in c:
                return ForeignKeyError("employer does not exist")
            return ForeignKeyError(f"foreign key violation: {constraint}")

        # CHECK constraints из модели
        if "check_salary_from_positive" in c:
            return ConstraintError("salary_from must be >= 0")
        if "check_salary_to_positive" in c:
            return ConstraintError("salary_to must be >= 0")
        if "check_salary_range" in c:
            return ConstraintError("salary_from must be <= salary_to")

        # Если вдруг появятся UNIQUE/другие ограничения
        if "unique" in c or c.endswith("_key") or "key" in c:
            return ConflictError("unique constraint violation")

        return ConstraintError(f"constraint violation: {constraint}")

    # Фоллбек по тексту (хуже, зависит от драйвера/БД)
    msg = str(orig).lower() if orig else str(e).lower()
    if "foreign key" in msg:
        return ForeignKeyError("foreign key violation")
    if "check constraint" in msg or "violates check constraint" in msg:
        return ConstraintError("check constraint violation")
    if "unique" in msg or "duplicate" in msg:
        return ConflictError("unique constraint violation")
    return ConstraintError("integrity constraint violation")


class VacancyRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, data: VacancyCreate) -> Vacancy:
        vacancy = Vacancy(
            title=data.title,
            description=data.description,
            requirements=data.requirements,
            responsibilities=data.responsibilities,
            salary_from=data.salary_from,
            salary_to=data.salary_to,
            currency=data.currency,
            location=data.location,
            employment_type=data.employment_type,
            employer_id=data.employer_id,
        )

        self.session.add(vacancy)
        try:
            await self.session.flush()
        except IntegrityError as e:
            raise _classify_vacancy_integrity_error(e) from e

        return vacancy

    async def get_raw_by_id(self, vacancy_id: int) -> Vacancy | None:
        result = await self.session.execute(
            select(Vacancy).where(Vacancy.id == vacancy_id)
        )
        return result.scalar_one_or_none()

    async def get_by_id(self, vacancy_id: int) -> Vacancy:
        vacancy = await self.get_raw_by_id(vacancy_id)
        if not vacancy:
            raise NotFoundError("vacancy not found")
        return vacancy

    async def list_by_employer(
        self,
        employer_id: int,
        *,
        limit: int = 50,
        offset: int = 0,
    ) -> Sequence[Vacancy]:
        result = await self.session.execute(
            select(Vacancy)
            .where(Vacancy.employer_id == employer_id)
            .order_by(Vacancy.created_at.desc(), Vacancy.id.desc())
            .limit(limit)
            .offset(offset)
        )
        return result.scalars().all()

    async def update(self, vacancy_id: int, data: VacancyUpdate) -> Vacancy:
        vacancy = await self.get_raw_by_id(vacancy_id)
        if not vacancy:
            raise NotFoundError("vacancy not found")

        update_data = data.model_dump(exclude_unset=True)

        allowed_fields = {
            "title",
            "description",
            "requirements",
            "responsibilities",
            "salary_from",
            "salary_to",
            "currency",
            "location",
            "employment_type",
        }

        for field, value in update_data.items():
            if field in allowed_fields:
                setattr(vacancy, field, value)

        try:
            await self.session.flush()
        except IntegrityError as e:
            raise _classify_vacancy_integrity_error(e) from e

        return vacancy

    async def delete(self, vacancy_id: int) -> None:
        vacancy = await self.get_raw_by_id(vacancy_id)
        if not vacancy:
            raise NotFoundError("vacancy not found")

        await self.session.delete(vacancy)
        try:
            await self.session.flush()
        except IntegrityError as e:
            raise _classify_vacancy_integrity_error(e) from e
