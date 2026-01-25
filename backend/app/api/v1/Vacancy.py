from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies.db import get_async_session
from app.dependencies.vacancy import *
from app.dto.Vacancy import VacancyCreate, VacancyRead, VacancyUpdate
from app.services.Vacancy import VacancyService

vacancy_router = APIRouter()


@vacancy_router.post("/", response_model=VacancyRead)
async def create_vacancy(payload: VacancyCreate, service: VacancyService = Depends(get_vacancy_service)):
    return await service.create_vacancy(payload)


@vacancy_router.get("/{vacancy_id}", response_model=VacancyRead)
async def get_vacancy(vacancy_id: int, service: VacancyService = Depends(get_vacancy_service)):
    return await service.get_vacancy(vacancy_id)


@vacancy_router.patch("/{vacancy_id}", response_model=VacancyRead)
async def update_vacancy(vacancy_id: int, payload: VacancyUpdate, service: VacancyService = Depends(get_vacancy_service)):
    return await service.update_vacancy(vacancy_id, payload)


@vacancy_router.delete("/{vacancy_id}", status_code=204)
async def delete_vacancy(vacancy_id: int, service: VacancyService = Depends(get_vacancy_service)):
    await service.delete_vacancy(vacancy_id)
