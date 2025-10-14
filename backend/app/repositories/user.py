from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from fastapi import HTTPException
from app.dto.User import UserRead
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
        query = text("""
                SELECT email, first_name, last_name, role
                FROM users
                WHERE email= :email
            """)
        
        result = await self.session.execute(query, {"email": email})
        row = result.mappings().first()
        if not row:
            raise HTTPException(status_code=404, detail="user not found")
        return UserRead(**dict(row))


    