from fastapi import FastAPI, APIRouter
from app.api.v1.User.user import user_router
from app.api.v1.auth import auth_router
from app.api.v1.Employer import employer_router
from app.api.v1.Vacancy import vacancy_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)

app = FastAPI()

base_prefix = "/api/v1"

app.include_router(user_router, prefix= base_prefix + "/users", tags=["users"])
app.include_router(auth_router, prefix= base_prefix + "/auth", tags=["auth"])
app.include_router(employer_router, prefix= base_prefix + "/employers", tags=["employers"])
app.include_router(vacancy_router, prefix= base_prefix + "/vacancies", tags=["vacancies"])


# base_router = APIRouter(prefix="/api/v1", tags=["base"])
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



# app.include_router(base_router)