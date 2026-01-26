from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Security
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security_jwt import decode_token, JWTError
from app.dependencies.dependencies import get_user_service
from app.dependencies.employer import get_employer_service
from app.services.user import UserService
from app.services.Employer import EmployerService
from app.models import User
from app.dto.User import UserRead


bearer_scheme = HTTPBearer(auto_error=True)

#TODO Отрефакторит гад функцию
#TODO Решить вопрос 
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(bearer_scheme),
    user_service: UserService = Depends(get_user_service),
    employer_service: EmployerService = Depends(get_employer_service)
) -> UserRead:
    token = credentials.credentials
    try:
        claims = decode_token(token, expected_type="access")  
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    user_id = int(claims["sub"])
    user: UserRead = await user_service.get_user_by_id(user_id)
    if user.role is not None:
        if user.role == "employer":
            employer_profile = await employer_service.get_by_user_id(user_id)
            user.employer_id = employer_profile.id

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    
    print("INFO:  ", user)

    return user
