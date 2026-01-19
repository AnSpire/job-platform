from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.models.Employer import Employer
from app.dto.Employer import EmployerCreate, EmployerRead, EmployerUpdate
from app.repositories.Exceptions import (
    NotFoundError,
    ConflictError,
    ForeignKeyError,
    ConstraintError,
)


def _classify_integrity_error(e: IntegrityError) -> Exception:
    """
    Пытаемся различать причины IntegrityError.
    Самый надёжный способ — по имени constraint в Postgres (diag.constraint_name).
    Если БД/драйвер не поддерживает — падаем в общий ConstraintError.
    """
    orig = getattr(e, "orig", None)

    constraint = None
    diag = getattr(orig, "diag", None)
    if diag is not None:
        constraint = getattr(diag, "constraint_name", None)

    # Подстрой под реальные имена constraint в твоей БД (их можно посмотреть в миграциях/схеме)
    # Часто Alembic генерит имена вида: employers_user_id_key, employers_company_id_fkey и т.п.
    if constraint:
        c = constraint.lower()
        if "user_id" in c and ("key" in c or "unique" in c):
            return ConflictError("employer profile for this user already exists")
        if "fkey" in c or "foreign" in c:
            return ForeignKeyError("invalid references (foreign key constraint)")
        return ConstraintError(f"constraint violation: {constraint}")

    # Фоллбек: иногда можно понять по тексту (не идеально и зависит от БД)
    msg = str(orig).lower() if orig else str(e).lower()
    if "unique" in msg or "duplicate" in msg:
        return ConflictError("unique constraint violation")
    if "foreign key" in msg:
        return ForeignKeyError("foreign key constraint violation")
    return ConstraintError("integrity constraint violation")


class EmployerRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, data: EmployerCreate) -> Employer:
        employer = Employer(
            user_id=data.user_id,
            company_id=data.company_id,
            position=data.position,
        )
        self.session.add(employer)

        try:
            await self.session.flush()
        except IntegrityError as e:
            raise _classify_integrity_error(e) from e

        return employer

    async def get_raw_by_id(self, employer_id: int) -> Employer | None:
        result = await self.session.execute(select(Employer).where(Employer.id == employer_id))
        return result.scalar_one_or_none()

    async def get_by_id(self, employer_id: int) -> Employer:
        employer = await self.get_raw_by_id(employer_id)
        if not employer:
            raise NotFoundError("employer not found")
        return employer

    async def get_raw_by_user_id(self, user_id: int) -> Employer | None:
        result = await self.session.execute(select(Employer).where(Employer.user_id == user_id))
        return result.scalar_one_or_none()

    async def get_by_user_id(self, user_id: int) -> Employer:
        employer = await self.get_raw_by_user_id(user_id)
        if not employer:
            raise NotFoundError("employer not found")
        return employer

    # ---------- update ----------
    async def update(self, employer_id: int, data: EmployerUpdate) -> Employer:
        employer = await self.get_by_id(employer_id)

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(employer, field, value)

        try:
            await self.session.flush()
        except IntegrityError as e:
            raise _classify_integrity_error(e) from e

        return employer

    # ---------- delete ----------
    async def delete(self, employer_id: int) -> None:
        employer = await self.get_by_id(employer_id)
        await self.session.delete(employer)
        # flush, чтобы поймать ошибки (редко нужно, но симметрично)
        await self.session.flush()

    # ---------- helpers ----------
    @staticmethod
    def to_read(employer: Employer) -> EmployerRead:
        return EmployerRead.model_validate(employer)
