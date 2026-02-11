from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies.db import get_async_session
from app.repositories.Vacancy import VacancyRepository
from app.repositories.VacancyTranslation import VacancyTranslationRepository
from app.services.Vacancy import VacancyService


def get_vacancy_repository(session: AsyncSession = Depends(get_async_session)) -> VacancyRepository:
    return VacancyRepository(session)

def get_vacancy_translation_repository(session: AsyncSession = Depends(get_async_session)) -> VacancyTranslationRepository:
    return VacancyTranslationRepository(session)

def get_vacancy_service(
    repository: VacancyRepository = Depends(get_vacancy_repository),
    translation_repository: VacancyTranslationRepository = Depends(get_vacancy_translation_repository),
) -> VacancyService:
    return VacancyService(repository, translation_repository)
