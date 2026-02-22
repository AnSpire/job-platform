from fastapi import APIRouter, Depends, status

from app.dependencies.company import get_company_service
from app.dto.Company import CompanyCreate, CompanyRead, CompanyUpdate
from app.services.Company import CompanyService

company_router = APIRouter()


@company_router.get("/", response_model=list[CompanyRead])
async def list_companies(service: CompanyService = Depends(get_company_service)):
    return await service.list_companies()


@company_router.post("/", response_model=CompanyRead, status_code=status.HTTP_201_CREATED)
async def create_company(payload: CompanyCreate, service: CompanyService = Depends(get_company_service)):
    return await service.create_company(payload)


@company_router.get("/{company_id}", response_model=CompanyRead)
async def get_company(company_id: int, service: CompanyService = Depends(get_company_service)):
    return await service.get_company(company_id)


@company_router.patch("/{company_id}", response_model=CompanyRead)
async def update_company(
    company_id: int,
    payload: CompanyUpdate,
    service: CompanyService = Depends(get_company_service),
):
    return await service.update_company(company_id, payload)


@company_router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_company(company_id: int, service: CompanyService = Depends(get_company_service)):
    await service.delete_company(company_id)
