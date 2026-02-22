from __future__ import annotations

from fastapi import HTTPException

from app.dto.Company import CompanyCreate, CompanyRead, CompanyUpdate
from app.repositories.Company import CompanyRepository
from app.repositories.Exceptions import (
    ConflictError,
    ConstraintError,
    NotFoundError,
)


class CompanyService:
    def __init__(self, repo: CompanyRepository):
        self.repo = repo
        self.session = repo.session

    async def create_company(self, data: CompanyCreate) -> CompanyRead:
        try:
            company = await self.repo.create(data)
            await self.session.commit()
            await self.session.refresh(company)
            return self.repo.to_read(company)

        except ConflictError as e:
            await self.session.rollback()
            raise HTTPException(status_code=409, detail=str(e))

        except ConstraintError as e:
            await self.session.rollback()
            raise HTTPException(status_code=400, detail=str(e))

    async def list_companies(self, *, limit: int = 50, offset: int = 0) -> list[CompanyRead]:
        companies = await self.repo.list_all(limit=limit, offset=offset)
        return [self.repo.to_read(company) for company in companies]

    async def get_company(self, company_id: int) -> CompanyRead:
        try:
            company = await self.repo.get_by_id(company_id)
            return self.repo.to_read(company)

        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))

    async def update_company(self, company_id: int, data: CompanyUpdate) -> CompanyRead:
        try:
            company = await self.repo.update(company_id, data)
            await self.session.commit()
            await self.session.refresh(company)
            return self.repo.to_read(company)

        except NotFoundError as e:
            await self.session.rollback()
            raise HTTPException(status_code=404, detail=str(e))

        except ConflictError as e:
            await self.session.rollback()
            raise HTTPException(status_code=409, detail=str(e))

        except ConstraintError as e:
            await self.session.rollback()
            raise HTTPException(status_code=400, detail=str(e))

    async def delete_company(self, company_id: int) -> None:
        try:
            await self.repo.delete(company_id)
            await self.session.commit()

        except NotFoundError as e:
            await self.session.rollback()
            raise HTTPException(status_code=404, detail=str(e))
