from psycopg import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from fastapi import Depends, HTTPException
from sqlalchemy.engine import RowMapping
from app.dto.User import UserRead
from app.models.User import User
from typing import cast

class UserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    
    async def create_user(self, user: User) -> dict | None:
        query = text("""
                    INSERT INTO users (email, password_hash, first_name, last_name, role)
                    VALUES (:email, :password_hash, :first_name, :last_name, :role)
                    RETURNING email, first_name, last_name, role, created_at 
                """)
        params = {
            "email": user.email,
            "password_hash": user.password_hash,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
        }

        try:
            result = await self.session.execute(query, params)
            await self.session.commit()
        except IntegrityError:
            await self.session.rollback()
            raise HTTPException(status_code=400, detail="email already exists")
        row = result.mappings().first()
        return dict(row) if row else None
    

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


    