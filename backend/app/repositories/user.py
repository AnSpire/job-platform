from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from app.dto.User import UserRead, UserInDB, UserUpdate, UserCreate
from app.models.User import User
from sqlalchemy.exc import IntegrityError
from app.repositories.Exceptions import (
    NotFoundError,
    ConflictError,
    ConstraintError,
)


def _classify_user_integrity_error(e: IntegrityError) -> Exception:
    """
    Классификация IntegrityError для User.
    В идеале отличаем причины по имени constraint в Postgres:
    orig.diag.constraint_name.
    """
    orig = getattr(e, "orig", None)

    constraint = None
    diag = getattr(orig, "diag", None)
    if diag is not None:
        constraint = getattr(diag, "constraint_name", None)

    # 1) Самый надёжный путь — по имени constraint
    if constraint:
        c = constraint.lower()

        # Подстрой под реальные имена constraint в твоей БД
        # Часто: users_email_key (unique)
        if "email" in c and ("key" in c or "unique" in c):
            return ConflictError("email already exists")

        return ConstraintError(f"constraint violation: {constraint}")

    # 2) Фоллбек — по тексту (хуже, зависит от драйвера/БД)
    msg = str(orig).lower() if orig else str(e).lower()
    if "unique" in msg or "duplicate" in msg:
        return ConflictError("unique constraint violation")
    return ConstraintError("integrity constraint violation")


class UserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session


    async def create_user(self, user: User) -> User:
        new_user = User(
            email=user.email,
            password_hash=user.password_hash,
            first_name=user.first_name,
            last_name=user.last_name,
            role=user.role,
        )
        print("\n\nNEW USER: " + str(new_user) + "\n\n")


        self.session.add(new_user)
        try:
            await self.session.flush()
        except IntegrityError as e:
            raise _classify_user_integrity_error(e) from e

        return new_user
    

    # async def get_user_by_email(self, email: str) -> User:
    #     query = (
    #         select(User)
    #         .where(User.email == email)
    #     )
    #     result = await self.session.execute(query)
    #     user = result.scalar_one_or_none()

    #     if not user:
    #         raise HTTPException(status_code=404, detail="user not found")

    #     return UserRead.model_validate(user)
    

    # async def get_user_with_password_by_email(self, email: str) -> UserInDB | None:
    #     query = select(User).where(User.email == email)
    #     result = await self.session.execute(query)
    #     user = result.scalar_one_or_none()

    #     if not user:
    #         return None

    #     return UserInDB.model_validate(user)


    async def get_raw_by_id(self, user_id: int) -> User | None:
        result = await self.session.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()


    async def get_raw_by_email(self, email: str) -> User | None:
        result = await self.session.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()


    async def get_by_id(self, user_id: int) -> User:
        user = await self.get_raw_by_id(user_id)
        if not user:
            raise NotFoundError("user not found")
        return user


    
    async def get_by_email(self, email: str) -> User:
        user = await self.get_raw_by_email(email)
        if not user:
            raise NotFoundError("user not found")
        return user



    async def update_user(self, user_id: int, data: UserUpdate) -> User:
        user = await self.get_raw_by_id(user_id)
        if not user:
            raise NotFoundError("user not found")

        update_data = data.model_dump(exclude_unset=True)

        allowed_fields = {"first_name", "last_name"}

        for field, value in update_data.items():
            if field in allowed_fields:
                setattr(user, field, value)
        
        try:
            await self.session.flush()
        except IntegrityError as e:
            raise _classify_user_integrity_error(e) from e
        
        return user
        