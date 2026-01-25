# app/services/vacancy.py

from __future__ import annotations

from typing import Sequence

from fastapi import HTTPException
from app.dto.Vacancy import VacancyCreate, VacancyRead, VacancyUpdate
from app.models.Vacancy import Vacancy
from app.repositories.Vacancy import VacancyRepository
from app.repositories.Exceptions import (
    NotFoundError,
    ConflictError,
    ForeignKeyError,
    ConstraintError,
)


class VacancyService:
    def __init__(self, repo: VacancyRepository):
        self.repo = repo
        self.session = repo.session

    async def create_vacancy(self, data: VacancyCreate) -> VacancyRead:
        try:
            vacancy: Vacancy = await self.repo.create(data)
            await self.session.commit()
            await self.session.refresh(vacancy)
            # commit/refresh обычно делаем на уровне endpoint/UoW,
            # как и у тебя в create_employer (закомментировано).
            return VacancyRead.model_validate(vacancy)

        except ConflictError as e:
            await self.session.rollback()
            raise HTTPException(status_code=409, detail=str(e))

        except ForeignKeyError as e:
            await self.session.rollback()
            raise HTTPException(status_code=400, detail=str(e))

        except ConstraintError as e:
            await self.session.rollback()
            raise HTTPException(status_code=400, detail=str(e))

    async def get_vacancy(self, vacancy_id: int) -> VacancyRead:
        try:
            vacancy = await self.repo.get_by_id(vacancy_id)
            return VacancyRead.model_validate(vacancy)
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))

    async def list_vacancies_by_employer(
        self,
        employer_id: int,
        *,
        limit: int = 50,
        offset: int = 0,
    ) -> Sequence[VacancyRead]:
        vacancies = await self.repo.list_by_employer(
            employer_id,
            limit=limit,
            offset=offset,
        )
        return [VacancyRead.model_validate(v) for v in vacancies]

    async def update_vacancy(self, vacancy_id: int, data: VacancyUpdate) -> VacancyRead:
        try:
            vacancy = await self.repo.update(vacancy_id, data)
            await self.session.commit()
            await self.session.refresh(vacancy)
            return VacancyRead.model_validate(vacancy)

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

    async def delete_vacancy(self, vacancy_id: int) -> None:
        try:
            await self.repo.delete(vacancy_id)
            await self.session.commit()
        except NotFoundError as e:
            await self.session.rollback()
            raise HTTPException(status_code=404, detail=str(e))
