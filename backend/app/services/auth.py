from app.dto.Auth import LoginRequest, TokenPair
from app.repositories.user import UserRepository
from fastapi.exceptions import HTTPException
from fastapi import status
from app.core.security import check_password

class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo 
    async def login_user(self, payload: LoginRequest):
        user = await self.user_repo.get_user_with_password_by_email(payload.email)
        if not user or not check_password(payload.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        
    