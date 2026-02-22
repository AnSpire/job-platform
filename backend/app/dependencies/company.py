from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.db import get_async_session
from app.repositories.Company import CompanyRepository
from app.services.Company import CompanyService


def get_company_repository(
    session: AsyncSession = Depends(get_async_session),
) -> CompanyRepository:
    return CompanyRepository(session=session)


def get_company_service(
    repo: CompanyRepository = Depends(get_company_repository),
) -> CompanyService:
    return CompanyService(repo)
