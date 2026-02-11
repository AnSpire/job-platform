from fastapi import APIRouter, Depends, Request, status

from app.dependencies.vacancy import *
from app.dto.Vacancy import VacancyCreate, VacancyRead, VacancyUpdate
from app.services.Vacancy import VacancyService
from app.utils.i18n.lang import get_lang

vacancy_router = APIRouter()


@vacancy_router.get("/", response_model=list[VacancyRead])
async def list_vacancies(
    request: Request,
    service: VacancyService = Depends(get_vacancy_service),
):
    lang = get_lang(request)
    return await service.list_vacancies(lang=lang)


@vacancy_router.post("/", response_model=VacancyRead, status_code=status.HTTP_201_CREATED)
async def create_vacancy(payload: VacancyCreate, service: VacancyService = Depends(get_vacancy_service)):
    return await service.create_vacancy(payload)


@vacancy_router.get("/{vacancy_id}", response_model=VacancyRead)
async def get_vacancy(
    vacancy_id: int,
    request: Request,
    service: VacancyService = Depends(get_vacancy_service),
):
    lang = get_lang(request)
    return await service.get_vacancy(vacancy_id, lang=lang)


@vacancy_router.patch("/{vacancy_id}", response_model=VacancyRead)
async def update_vacancy(vacancy_id: int, payload: VacancyUpdate, service: VacancyService = Depends(get_vacancy_service)):
    return await service.update_vacancy(vacancy_id, payload)


@vacancy_router.delete("/{vacancy_id}", status_code=204)
async def delete_vacancy(vacancy_id: int, service: VacancyService = Depends(get_vacancy_service)):
    await service.delete_vacancy(vacancy_id)


@vacancy_router.get("/employer/{employer_id}")
async def list_vacancies_by_employer(employer_id: int, service: VacancyService = Depends(get_vacancy_service)):
    return await service.list_vacancies_by_employer(employer_id=employer_id)
