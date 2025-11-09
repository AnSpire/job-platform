from fastapi.exceptions import HTTPException
from app.repositories.user import UserRepository
from app.dto.User import UserCreate, UserUpdate, UserRead
from app.core.security import hash_password
from app.models.User import User
from logging import getLogger
from typing import Any


user_logger = getLogger(__name__)


class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo=user_repo


    async def create_user(self, user_data: UserCreate):
        password_hash = hash_password(user_data.password)
        user = User(
            email=user_data.email,
            password_hash=password_hash,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            role="student"
        )
        response = await self.user_repo.create_user(user)
        return response
    

    async def get_user_by_id(self, id: int) -> UserRead:
        user = await self.user_repo.get_user_by_id(id)
        return user


    async def get_user_by_email(self, email: str) -> UserRead:
        user = await self.user_repo.get_user_by_email(email)
        return user


    async def list_users(self):
        ...
    
    
    async def update_user(self, user_id: int, data: UserUpdate):
        user = await self.user_repo.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        update_data: dict[str: Any] = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(user, key, value)

        await self.user_repo.update_user(user)
        return user
    