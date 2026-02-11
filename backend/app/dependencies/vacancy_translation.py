from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.db import get_async_session
from app.repositories.VacancyTranslation import VacancyTranslationRepository
from app.services.VacancyTranslation import VacancyTranslationService


def get_vacancy_translation_repository(
    session: AsyncSession = Depends(get_async_session),
) -> VacancyTranslationRepository:
    return VacancyTranslationRepository(session)


def get_vacancy_translation_service(
    repository: VacancyTranslationRepository = Depends(get_vacancy_translation_repository),
) -> VacancyTranslationService:
    return VacancyTranslationService(repository)
