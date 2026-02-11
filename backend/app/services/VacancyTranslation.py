from __future__ import annotations

from typing import Sequence

from fastapi import HTTPException

from app.dto.VacancyTranslation import Lang, VacancyTranslationCreate, VacancyTranslationRead
from app.repositories.Exceptions import ConstraintError, ConflictError, ForeignKeyError, NotFoundError
from app.repositories.VacancyTranslation import VacancyTranslationRepository


class VacancyTranslationService:
    def __init__(self, repo: VacancyTranslationRepository):
        self.repo = repo
        self.session = repo.session

    async def list_vacancy_translations(self, vacancy_id: int) -> Sequence[VacancyTranslationRead]:
        exists = await self.repo.vacancy_exists(vacancy_id)
        if not exists:
            raise HTTPException(status_code=404, detail="Vacancy not found")

        rows = await self.repo.list_by_vacancy(vacancy_id)
        return [VacancyTranslationRead.model_validate(row) for row in rows]

    async def get_vacancy_translation(self, vacancy_id: int, lang: Lang) -> VacancyTranslationRead:
        try:
            translation = await self.repo.get_by_vacancy_and_lang(vacancy_id, lang)
            return VacancyTranslationRead.model_validate(translation)
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))

    async def upsert_vacancy_translation(
        self,
        vacancy_id: int,
        lang: Lang,
        payload: VacancyTranslationCreate,
    ) -> VacancyTranslationRead:
        exists = await self.repo.vacancy_exists(vacancy_id)
        if not exists:
            raise HTTPException(status_code=404, detail="Vacancy not found")

        try:
            translation = await self.repo.upsert(vacancy_id, lang, payload)
            await self.session.commit()
            await self.session.refresh(translation)
            return VacancyTranslationRead.model_validate(translation)

        except ConflictError:
            await self.session.rollback()
            raise HTTPException(status_code=409, detail="Conflict while saving translation")

        except ForeignKeyError as e:
            await self.session.rollback()
            raise HTTPException(status_code=400, detail=str(e))

        except ConstraintError as e:
            await self.session.rollback()
            raise HTTPException(status_code=400, detail=str(e))

    async def delete_vacancy_translation(self, vacancy_id: int, lang: Lang) -> None:
        try:
            await self.repo.delete(vacancy_id, lang)
            await self.session.commit()
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
