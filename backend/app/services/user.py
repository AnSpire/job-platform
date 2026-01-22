from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user import UserRepository
from app.services.Employer import EmployerService
from app.dto.Employer import EmployerCreate
from app.dto.User import UserCreate, UserUpdate, UserRead
from app.core.security import hash_password
from app.models.User import User
from logging import getLogger

from app.repositories.Exceptions import NotFoundError, ConflictError, ConstraintError, ForeignKeyError


user_logger = getLogger(__name__)


class UserService:
    def __init__(
            self,
            user_repo: UserRepository,
            session: AsyncSession
        ):
        self.user_repo=user_repo
        self.session=session


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
        try:
            password_hash = hash_password(user_data.password)

            
            user = User(
                email=str(user_data.email),
                password_hash=password_hash,
                first_name=user_data.first_name,
                last_name=user_data.last_name,
                role=user_data.role or "student",
            )

            created_user = await self.user_repo.create_user(user)

            if user_data.role == "employer":
                employer = EmployerCreate(user_id = created_user.id)
                await employer_service.create_employer(data = employer)

            await self.session.commit()
            await self.session.refresh(created_user)

            return UserRead.model_validate(created_user)

        except ConflictError as e:
            await self.session.rollback()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
        except NotFoundError as e:
            await self.session.rollback()
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
        except (ForeignKeyError, ConstraintError) as e:
            await self.session.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        except Exception:
            await self.session.rollback()
            raise


    async def get_user_by_id(self, user_id: int) -> UserRead:
        try:
            user = await self.user_repo.get_by_id(user_id)  # ORM
            return UserRead.model_validate(user)
        except NotFoundError as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    async def get_user_by_email(self, email: str) -> UserRead:
        try:
            user = await self.user_repo.get_by_email(email)  # ORM
            return UserRead.model_validate(user)
        except NotFoundError as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    async def update_user(self, user_id: int, data: UserUpdate) -> UserRead:
        try:
            user = await self.user_repo.update_user(user_id, data)  # flush внутри repo
            await self.session.commit()
            await self.session.refresh(user)
            return UserRead.model_validate(user)

        except NotFoundError as e:
            await self.session.rollback()
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
        except ConflictError as e:
            await self.session.rollback()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
        except (ForeignKeyError, ConstraintError) as e:
            await self.session.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        except Exception:
            await self.session.rollback()
            raise

    