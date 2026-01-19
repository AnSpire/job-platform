from fastapi import HTTPException, status
from app.repositories.user import UserRepository
from app.services.Employer import EmployerService
from app.dto.Employer import EmployerCreate
from app.dto.User import UserCreate, UserUpdate, UserRead
from app.core.security import hash_password
from app.models.User import User
from logging import getLogger

user_logger = getLogger(__name__)


class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo=user_repo


    async def create_user(self, user_data: UserCreate, employer_service: EmployerService):
        if user_data.email is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="email is required",
            )
        if user_data.password is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="password is required",
            )

        password_hash = hash_password(user_data.password)

        
        user = User(
            email=str(user_data.email),
            password_hash=password_hash,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            role=user_data.role or "student",
        )
        user_in_db = await self.user_repo.create_user(user)
        if user_data.role == "employer":
            employer = EmployerCreate(
                user_id=user_in_db.id
            )
            employer_in_db = await employer_service.create_employer(
                data=employer
            )

        return user_in_db

    

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
        # for key, value in update_data.items():
        #     setattr(user, key, value)

        return await self.user_repo.update_user(user.id, update_data)

    