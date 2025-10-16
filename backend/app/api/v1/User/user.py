from fastapi import APIRouter, Depends
from app.services.user import UserService
from app.dto.User import UserCreate
from app.dependencies.dependencies import get_user_service
user_router = APIRouter()


@user_router.get("/")
async def get_users(service: UserService = Depends(get_user_service)):
    return await service.list_users()


@user_router.post("/register")
async def create_user(user: UserCreate, service: UserService = Depends(get_user_service)):
    return await service.create_user(user)


