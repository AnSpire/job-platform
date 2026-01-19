from app.repositories.Employer import EmployerRepository
from app.services.Employer import EmployerService
from app.dependencies.db import get_async_session
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession



def get_employer_repository(
    session: AsyncSession = Depends(get_async_session),
) -> EmployerRepository:
    return EmployerRepository(session=session)

def get_employer_service(
    repo: EmployerRepository = Depends(get_employer_repository),
) -> EmployerService:
    return EmployerService(repo)
