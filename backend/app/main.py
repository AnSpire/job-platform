from fastapi import FastAPI, APIRouter
from app.api.v1.User.user import user_router
from app.api.v1.auth import auth_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)

app = FastAPI()
base_router = APIRouter(prefix="/api/v1", tags=["base"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # фронтенд (Vite)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    body = await request.body()
    logging.info(f"Incoming request: {request.method} {request.url} | Body: {body.decode()}")
    response = await call_next(request)
    return response


base_router.include_router(user_router, prefix="/users", tags=["users"])
base_router.include_router(auth_router, prefix="/auth", tags=["auth"])

app.include_router(base_router)