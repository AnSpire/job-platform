from app.dto.Auth import LoginRequest, TokenPair
from app.repositories.user import UserRepository
from fastapi.exceptions import HTTPException
from fastapi import status
from app.core.security import check_password
from app.core.security_jwt import create_access_token, create_refresh_token, decode_token, JWTError
from app.dto.User import UserInDB

class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo 
    async def login_user(self, payload: LoginRequest):
        user: UserInDB = await self.user_repo.get_user_with_password_by_email(payload.email)
        if not user or not check_password(payload.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        access_token = create_access_token(user_id=user.id, email=user.email)
        refresh_token = create_refresh_token(user_id=user.id)
        from app.core.settings import settings
        return TokenPair(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.ACCESS_TTL_MIN * 60,
        )

    async def refresh_token(self, refresh_token: str):
        try:
            claims = decode_token(token=refresh_token, expected_type="refresh")
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        
        user_id = int(claims["sub"])
        user = await self.user_repo.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=401, detail="user not found")
        access = create_access_token(user_id=user.id, email=user.email)
        new_refresh = create_refresh_token(user_id=user.id)

        from app.core.settings import settings
        return TokenPair(
            access_token=access,
            refresh_token=new_refresh,
            expires_in=settings.ACCESS_TTL_MIN * 60,
        )


        
    