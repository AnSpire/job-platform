from fastapi import APIRouter, Depends, status

from app.dependencies.vacancy_translation import get_vacancy_translation_service
from app.dto.VacancyTranslation import Lang, VacancyTranslationCreate, VacancyTranslationRead
from app.services.VacancyTranslation import VacancyTranslationService


vacancyTranslation_router = APIRouter(
    prefix="/vacancies/{vacancy_id}/translations",
    tags=["VacancyTranslations"],
)


@vacancyTranslation_router.get("/", response_model=list[VacancyTranslationRead])
async def list_vacancy_translations(
    vacancy_id: int,
    service: VacancyTranslationService = Depends(get_vacancy_translation_service),
):
    return await service.list_vacancy_translations(vacancy_id)


@vacancyTranslation_router.get("/{lang}", response_model=VacancyTranslationRead)
async def get_vacancy_translation(
    vacancy_id: int,
    lang: Lang,
    service: VacancyTranslationService = Depends(get_vacancy_translation_service),
):
    return await service.get_vacancy_translation(vacancy_id, lang)


@vacancyTranslation_router.put("/{lang}", response_model=VacancyTranslationRead)
async def upsert_vacancy_translation(
    vacancy_id: int,
    lang: Lang,
    payload: VacancyTranslationCreate,
    service: VacancyTranslationService = Depends(get_vacancy_translation_service),
):
    return await service.upsert_vacancy_translation(vacancy_id, lang, payload)


@vacancyTranslation_router.delete("/{lang}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_vacancy_translation(
    vacancy_id: int,
    lang: Lang,
    service: VacancyTranslationService = Depends(get_vacancy_translation_service),
):
    await service.delete_vacancy_translation(vacancy_id, lang)
