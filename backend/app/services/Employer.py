# app/services/employer.py

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.dto.Employer import EmployerCreate, EmployerRead, EmployerUpdate
from app.repositories.Employer import EmployerRepository
from app.repositories.Exceptions import (
    NotFoundError,
    ConflictError,
    ForeignKeyError,
    ConstraintError,
)


class EmployerService:
    def __init__(self, repo: EmployerRepository):
        self.repo = repo
        self.session = repo.session

    async def create_employer(self, data: EmployerCreate) -> EmployerRead:
        try:
            employer = await self.repo.create(data)
            # await self.session.commit()
            # await self.session.refresh(employer)
            return self.repo.to_read(employer)

        except ConflictError as e:
            await self.session.rollback()
            raise HTTPException(status_code=409, detail=str(e))

        except ForeignKeyError as e:
            await self.session.rollback()
            raise HTTPException(status_code=400, detail=str(e))

        except ConstraintError as e:
            await self.session.rollback()
            raise HTTPException(status_code=400, detail=str(e))

    async def get_employer(self, employer_id: int) -> EmployerRead:
        try:
            employer = await self.repo.get_by_id(employer_id)
            return self.repo.to_read(employer)
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))

    async def update_employer(self, employer_id: int, data: EmployerUpdate) -> EmployerRead:
        try:
            employer = await self.repo.update(employer_id, data)
            await self.session.commit()
            await self.session.refresh(employer)
            return self.repo.to_read(employer)

        except NotFoundError as e:
            await self.session.rollback()
            raise HTTPException(status_code=404, detail=str(e))

        except ConflictError as e:
            await self.session.rollback()
            raise HTTPException(status_code=409, detail=str(e))

        except ForeignKeyError as e:
            await self.session.rollback()
            raise HTTPException(status_code=400, detail=str(e))

        except ConstraintError as e:
            await self.session.rollback()
            raise HTTPException(status_code=400, detail=str(e))

    async def delete_employer(self, employer_id: int) -> None:
        try:
            await self.repo.delete(employer_id)
            await self.session.commit()
        except NotFoundError as e:
            await self.session.rollback()
            raise HTTPException(status_code=404, detail=str(e))
