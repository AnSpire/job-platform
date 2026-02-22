from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.dto.Company import CompanyCreate, CompanyRead, CompanyUpdate
from app.models.Company import Company
from app.repositories.Exceptions import (
    ConflictError,
    ConstraintError,
    NotFoundError,
)


def _classify_integrity_error(e: IntegrityError) -> Exception:
    orig = getattr(e, "orig", None)

    constraint = None
    diag = getattr(orig, "diag", None)
    if diag is not None:
        constraint = getattr(diag, "constraint_name", None)

    if constraint:
        c = constraint.lower()
        if "name" in c and ("key" in c or "unique" in c):
            return ConflictError("company with this name already exists")
        return ConstraintError(f"constraint violation: {constraint}")

    msg = str(orig).lower() if orig else str(e).lower()
    if "unique" in msg or "duplicate" in msg:
        return ConflictError("unique constraint violation")
    return ConstraintError("integrity constraint violation")


class CompanyRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, data: CompanyCreate) -> Company:
        company = Company(
            name=data.name,
            description=data.description,
            website=data.website,
            industry=data.industry,
            location=data.location,
            logo_url=data.logo_url,
        )
        self.session.add(company)

        try:
            await self.session.flush()
        except IntegrityError as e:
            raise _classify_integrity_error(e) from e

        return company

    async def list_all(self, *, limit: int = 50, offset: int = 0) -> list[Company]:
        query = select(Company).order_by(Company.id.desc()).limit(limit).offset(offset)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_raw_by_id(self, company_id: int) -> Company | None:
        result = await self.session.execute(select(Company).where(Company.id == company_id))
        return result.scalar_one_or_none()

    async def get_by_id(self, company_id: int) -> Company:
        company = await self.get_raw_by_id(company_id)
        if not company:
            raise NotFoundError("company not found")
        return company

    async def update(self, company_id: int, data: CompanyUpdate) -> Company:
        company = await self.get_by_id(company_id)

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(company, field, value)

        try:
            await self.session.flush()
        except IntegrityError as e:
            raise _classify_integrity_error(e) from e

        return company

    async def delete(self, company_id: int) -> None:
        company = await self.get_by_id(company_id)
        await self.session.delete(company)
        await self.session.flush()

    @staticmethod
    def to_read(company: Company) -> CompanyRead:
        return CompanyRead.model_validate(company)
