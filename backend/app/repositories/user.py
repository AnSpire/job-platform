from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from app.dto.User import UserRead, UserInDB, UserUpdate
from app.models.User import User
from sqlalchemy.exc import IntegrityError


class UserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session


    async def create_user(self, user: User) -> UserRead:
        new_user = User(
            email=user.email,
            password_hash=user.password_hash,
            first_name=user.first_name,
            last_name=user.last_name,
            role=user.role,
        )


        self.session.add(new_user)
        try:
            await self.session.commit()
            await self.session.refresh(new_user)
        except IntegrityError:
            await self.session.rollback()
            raise HTTPException(status_code=400, detail="email already exists")

        return UserRead.model_validate(new_user)
    

    async def get_user_by_email(self, email: str) -> UserRead:
        query = (
            select(User)
            .where(User.email == email)
        )
        result = await self.session.execute(query)
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=404, detail="user not found")

        return UserRead.model_validate(user)
    

    async def get_user_with_password_by_email(self, email: str) -> UserInDB | None:
        query = select(User).where(User.email == email)
        result = await self.session.execute(query)
        user = result.scalar_one_or_none()

        if not user:
            return None

        return UserInDB.model_validate(user)

    async def get_raw_user_by_id(self, user_id: int) -> User | None:
        query = select(User).where(User.id == user_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()


    async def get_user_by_id(self, user_id: int) -> UserRead:
        query = select(User).where(User.id == user_id)
        result = await self.session.execute(query)
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=404, detail="user not found")

        return UserRead.model_validate(user)


    async def update_user(self, user_id: int, data: UserUpdate) -> UserRead:
        user = await self.get_raw_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="user not found")

        update_data = data.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(user, field, value)

        try:
            await self.session.commit()
            await self.session.refresh(user)
        except IntegrityError:
            await self.session.rollback()
            raise HTTPException(status_code=400, detail="email already exists")

        return UserRead.model_validate(user)