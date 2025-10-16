from app.repositories.user import UserRepository
from app.services.user import UserService
from app.services.auth import AuthService
from app.dependencies.db import get_async_session
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession



def get_user_repository(session: AsyncSession= Depends(get_async_session)) -> UserRepository:
    return UserRepository(session=session)

def get_user_service(repository: UserRepository = Depends(get_user_repository)) -> UserService:
    return UserService(repository)

def get_auth_service(user_repo: UserRepository = Depends(get_user_repository)) -> AuthService:
    return AuthService(user_repo)
