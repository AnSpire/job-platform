from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Security
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security_jwt import decode_token, JWTError
from app.dependencies.dependencies import get_user_service
from app.services.user import UserService
from app.models import User


bearer_scheme = HTTPBearer(auto_error=True)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(bearer_scheme),
    user_service: UserService = Depends(get_user_service)
) -> User:
    token = credentials.credentials
    try:
        claims = decode_token(token, expected_type="access")  
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    user_id = int(claims["sub"])
    user = await user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return user
