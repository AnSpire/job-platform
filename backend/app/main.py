from fastapi import FastAPI, APIRouter
from app.api.v1.User.user import user_router
from app.api.v1.auth import auth_router
from app.api.v1.Employer import employer_router
from app.api.v1.Company import company_router
from app.api.v1.Vacancy.Vacancy import vacancy_router
from app.api.v1.Vacancy.VacancyTranslation import vacancyTranslation_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.utils.i18n.lang import get_lang
from app.utils.i18n.translations import t
from app.utils.i18n.validation_map import translate_validation_error
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
app.include_router(company_router, prefix= base_prefix + "/companies", tags=["companies"])
app.include_router(vacancy_router, prefix= base_prefix + "/vacancies", tags=["vacancies"])
app.include_router(vacancyTranslation_router, prefix=base_prefix, tags=["vacancies"])


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

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    lang = get_lang(request)

    errors_out = []
    for e in exc.errors():
        # loc: ('body', 'title') -> "body.title"
        loc = ".".join(str(x) for x in e.get("loc", []) if x is not None)
        err_type = e.get("type")  # напр. "missing", "string_too_short", ...
        msg = e.get("msg")        # базовое (обычно EN) сообщение

        errors_out.append({
            "loc": loc,
            "type": err_type,
            "msg": translate_validation_error(lang, e),       # можно оставить как есть
        })

    return JSONResponse(
        status_code=422,
        content={
            "detail": t("errors.validation", lang),  # локализованная шапка
            "errors": errors_out,
            "lang": lang,
        },
    )

# app.include_router(base_router)