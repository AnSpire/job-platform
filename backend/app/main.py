from fastapi import FastAPI, APIRouter
from app.api.v1.hello_world import hello_world_router
from app.api.v1.User.user import user_router

app = FastAPI()
base_router = APIRouter(prefix="/api/v1", tags=["base"])


base_router.include_router(hello_world_router)
base_router.include_router(user_router, prefix="/users")


app.include_router(base_router)