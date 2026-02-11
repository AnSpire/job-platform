# app/routers/vacancy_translation.py
from __future__ import annotations

from typing import Optional, Literal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.dependencies.db import get_async_session
from app.models.Vacancy import Vacancy
from app.models.VacancyTranslation import VacancyTranslation

from pydantic import BaseModel, ConfigDict, Field


# --- DTO (в этом же файле, чтобы было "самодостаточно") ---

Lang = Literal["en", "es"]


class VacancyTranslationCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=120)
    description: str = Field(..., min_length=1)
    requirements: Optional[str] = None
    responsibilities: Optional[str] = None


class VacancyTranslationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    vacancy_id: int
    lang: Lang
    title: str
    description: str
    requirements: Optional[str] = None
    responsibilities: Optional[str] = None


# --- Router ---

vacancyTranslation_router = APIRouter(
    prefix="/vacancies/{vacancy_id}/translations",
    tags=["VacancyTranslations"],
)


@vacancyTranslation_router.get(
    "/",
    response_model=list[VacancyTranslationRead],
)
async def list_vacancy_translations(
    vacancy_id: int,
    session: AsyncSession = Depends(get_async_session),
):
    # 404 если vacancy не существует — чтобы API было предсказуемым
    exists = (await session.execute(
        select(Vacancy.id).where(Vacancy.id == vacancy_id)
    )).scalar_one_or_none()
    if not exists:
        raise HTTPException(status_code=404, detail="Vacancy not found")

    stmt = select(VacancyTranslation).where(
        VacancyTranslation.vacancy_id == vacancy_id
    ).order_by(VacancyTranslation.id.desc())

    rows = (await session.execute(stmt)).scalars().all()
    return rows


@vacancyTranslation_router.get(
    "/{lang}",
    response_model=VacancyTranslationRead,
)
async def get_vacancy_translation(
    vacancy_id: int,
    lang: Lang,
    session: AsyncSession = Depends(get_async_session),
):
    stmt = select(VacancyTranslation).where(
        VacancyTranslation.vacancy_id == vacancy_id,
        VacancyTranslation.lang == lang,
    )
    vt = (await session.execute(stmt)).scalars().first()
    if not vt:
        raise HTTPException(status_code=404, detail="Translation not found")
    return vt


@vacancyTranslation_router.put(
    "/{lang}",
    response_model=VacancyTranslationRead,
)
async def upsert_vacancy_translation(
    vacancy_id: int,
    lang: Lang,
    payload: VacancyTranslationCreate,
    session: AsyncSession = Depends(get_async_session),
):
    # vacancy должна существовать
    exists = (await session.execute(
        select(Vacancy.id).where(Vacancy.id == vacancy_id)
    )).scalar_one_or_none()
    if not exists:
        raise HTTPException(status_code=404, detail="Vacancy not found")

    stmt = select(VacancyTranslation).where(
        VacancyTranslation.vacancy_id == vacancy_id,
        VacancyTranslation.lang == lang,
    )
    vt = (await session.execute(stmt)).scalars().first()

    if vt is None:
        vt = VacancyTranslation(
            vacancy_id=vacancy_id,
            lang=lang,
            title=payload.title,
            description=payload.description,
            requirements=payload.requirements,
            responsibilities=payload.responsibilities,
        )
        session.add(vt)
    else:
        vt.title = payload.title
        vt.description = payload.description
        vt.requirements = payload.requirements
        vt.responsibilities = payload.responsibilities

    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        # конфликты тут обычно из-за UNIQUE(vacancy_id, lang), но мы делаем upsert,
        # поэтому реальный конфликт будет редким (гонки). В 99% случаев это 409.
        raise HTTPException(status_code=409, detail="Conflict while saving translation")

    await session.refresh(vt)
    return vt


@vacancyTranslation_router.delete(
    "/{lang}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_vacancy_translation(
    vacancy_id: int,
    lang: Lang,
    session: AsyncSession = Depends(get_async_session),
):
    stmt = delete(VacancyTranslation).where(
        VacancyTranslation.vacancy_id == vacancy_id,
        VacancyTranslation.lang == lang,
    )
    result = await session.execute(stmt)
    await session.commit()

    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Translation not found")
