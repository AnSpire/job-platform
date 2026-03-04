from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.db import get_async_session
from app.dependencies.employer import get_employer_service
from app.dto.Employer import EmployerCompanyAssign, EmployerCreate, EmployerRead, EmployerUpdate
from app.services.Employer import EmployerService

employer_router = APIRouter()


@employer_router.post("/", response_model=EmployerRead)
async def create_employer(payload: EmployerCreate, session: AsyncSession = Depends(get_async_session), service: EmployerService = Depends(get_employer_service)):
    return await service.create_employer(payload)


@employer_router.get("/{employer_id}", response_model=EmployerRead)
async def get_employer(employer_id: int, session: AsyncSession = Depends(get_async_session), service: EmployerService = Depends(get_employer_service)):
    return await service.get_by_employer_id(employer_id)


@employer_router.patch("/{employer_id}", response_model=EmployerRead)
async def update_employer(employer_id: int, payload: EmployerUpdate, session: AsyncSession = Depends(get_async_session), service: EmployerService = Depends(get_employer_service)):
    return await service.update_employer(employer_id, payload)


@employer_router.patch("/{employer_id}/company", response_model=EmployerRead)
async def assign_employer_company(
    employer_id: int,
    payload: EmployerCompanyAssign,
    session: AsyncSession = Depends(get_async_session),
    service: EmployerService = Depends(get_employer_service),
):
    return await service.assign_company(employer_id, payload)


@employer_router.delete("/{employer_id}", status_code=204)
async def delete_employer(employer_id: int, session: AsyncSession = Depends(get_async_session), service: EmployerService = Depends(get_employer_service)):
    await service.delete_employer(employer_id)
