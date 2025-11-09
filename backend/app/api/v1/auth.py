from fastapi import APIRouter, Depends
from app.dto.Auth import LoginRequest, TokenPair, RefreshTokenRequest
from app.services.auth import AuthService
from app.dependencies.dependencies import get_auth_service
auth_router = APIRouter()


@auth_router.post("/login", response_model=TokenPair)
async def login(payload: LoginRequest, auth_service: AuthService = Depends(get_auth_service)):
    return await auth_service.login_user(payload)


@auth_router.post("/refresh")
async def refresh_tokens(payload: RefreshTokenRequest, service: AuthService = Depends(get_auth_service)):
    return await service.refresh_token(payload.refresh_token)


    
