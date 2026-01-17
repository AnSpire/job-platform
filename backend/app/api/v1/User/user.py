from fastapi import APIRouter, Depends, Security
from app.services.user import UserService
from app.dto.User import UserCreate, UserRead, UserUpdate
from app.dependencies.dependencies import get_user_service
from app.dependencies.security import get_current_user
from fastapi.security import HTTPBearer
import logging

user_logger = logging.getLogger("user")
user_logger.setLevel(logging.INFO)

if not user_logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(name)s: %(message)s")
    handler.setFormatter(formatter)
    user_logger.addHandler(handler)


user_router = APIRouter()

bearer_scheme = HTTPBearer()

@user_router.get("/")
async def get_users(service: UserService = Depends(get_user_service)):
    return await service.list_users()


@user_router.post("/register")
async def create_user(user: UserCreate, service: UserService = Depends(get_user_service)):
    return await service.create_user(user)


@user_router.get(
    "/privateRoute",
    tags=["users"],
    summary="Private route (JWT required)",
    dependencies=[Security(bearer_scheme)]  
)
async def private_route(current_user: UserRead = Security(get_current_user)):
    return {"message": f"Hello, {current_user.first_name}!"}


@user_router.get("/me", response_model=UserRead, tags=["users"])
async def get_me(current_user: UserRead = Depends(get_current_user)):
    """
    Возвращает данные текущего пользователя.
    """
    return current_user


@user_router.patch("/me", response_model=UserRead, tags=["users"])
async def update_me(
    update_data: UserUpdate,
    current_user: UserRead = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
):
    """
    Обновляет данные текущего пользователя.
    """
    updated_user = await service.update_user(current_user.id, update_data)
    print(updated_user)
    return updated_user
