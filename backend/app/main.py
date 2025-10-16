from fastapi import FastAPI, APIRouter
from app.api.v1.User.user import user_router
from app.api.v1.auth import auth_router

app = FastAPI()
base_router = APIRouter(prefix="/api/v1", tags=["base"])


base_router.include_router(user_router, prefix="/users", tags=["users"])
base_router.include_router(auth_router, prefix="/auth", tags=["auth"])

app.include_router(base_router)