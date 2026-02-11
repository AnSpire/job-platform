# app/services/vacancy.py

from __future__ import annotations

from typing import Sequence

from fastapi import HTTPException
from app.dto.Vacancy import VacancyCreate, VacancyRead, VacancyUpdate
from app.dto.VacancyTranslation import VacancyTranslationCreate
from app.models.Vacancy import Vacancy
from app.repositories.Vacancy import VacancyRepository
from app.repositories.VacancyTranslation import VacancyTranslationRepository
from app.repositories.Exceptions import (
    NotFoundError,
    ConflictError,
    ForeignKeyError,
    ConstraintError,
)
from app.utils.i18n.lang import Lang


class VacancyService:
    def __init__(self, repo: VacancyRepository, translation_repo: VacancyTranslationRepository):
        self.repo = repo
        self.translation_repo = translation_repo
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

    async def get_vacancy(self, vacancy_id: int, *, lang: Lang = "ru") -> VacancyRead:
        try:
            vacancy = await self.repo.get_localized_by_id(vacancy_id, lang=lang)
            if not vacancy:
                raise NotFoundError("vacancy not found")
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

    async def list_vacancies(
        self,
        *,
        limit: int = 50,
        offset: int = 0,
        lang: Lang = "ru",
    ) -> Sequence[VacancyRead]:
        vacancies = await self.repo.list_all_localized(lang=lang, limit=limit, offset=offset)
        return [VacancyRead.model_validate(v) for v in vacancies]

    async def update_vacancy(
        self,
        vacancy_id: int,
        data: VacancyUpdate,
        *,
        lang: Lang = "ru",
    ) -> VacancyRead:
        translated_fields = {"title", "description", "requirements", "responsibilities"}
        try:
            update_data = data.model_dump(exclude_unset=True)
            base_update_data = {k: v for k, v in update_data.items() if k not in translated_fields}
            translated_update_data = {k: v for k, v in update_data.items() if k in translated_fields}

            vacancy = await self.repo.get_by_id(vacancy_id)

            if base_update_data:
                vacancy = await self.repo.update(vacancy_id, VacancyUpdate(**base_update_data))

            if lang != "ru" and translated_update_data:
                if (
                    translated_update_data.get("title", "__missing__") is None
                    or translated_update_data.get("description", "__missing__") is None
                ):
                    raise ConstraintError("title and description cannot be null for translation")

                translation = await self.translation_repo.get_raw_by_vacancy_and_lang(vacancy_id, lang)
                source = translation or vacancy

                translation_payload = VacancyTranslationCreate(
                    title=translated_update_data.get("title", source.title),
                    description=translated_update_data.get("description", source.description),
                    requirements=translated_update_data.get("requirements", source.requirements),
                    responsibilities=translated_update_data.get("responsibilities", source.responsibilities),
                )
                await self.translation_repo.upsert(vacancy_id, lang, translation_payload)

            if lang == "ru" and translated_update_data:
                vacancy = await self.repo.update(vacancy_id, VacancyUpdate(**translated_update_data))

            await self.session.commit()
            localized = await self.repo.get_localized_by_id(vacancy_id, lang=lang)
            if not localized:
                raise NotFoundError("vacancy not found")
            return VacancyRead.model_validate(localized)

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
