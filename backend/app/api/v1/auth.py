from fastapi import APIRouter, Depends
from app.dto.Auth import LoginRequest, TokenPair
from app.services.auth import AuthService
from app.dependencies.dependencies import get_auth_service
auth_router = APIRouter()


auth_router.post("/login")
async def login(payload: LoginRequest, response_model=TokenPair, auth_service: AuthService = get_auth_service()):
    return await auth_service.login_user(payload=payload)

    
