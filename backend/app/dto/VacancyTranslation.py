from __future__ import annotations

from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, StringConstraints


Lang = Literal["en", "es"]
Title = Annotated[str, StringConstraints(min_length=1, max_length=120)]


class VacancyTranslationCreate(BaseModel):
    title: Title
    description: str
    requirements: str | None = None
    responsibilities: str | None = None


class VacancyTranslationRead(BaseModel):
    id: int
    vacancy_id: int
    lang: Lang
    title: str
    description: str
    requirements: str | None
    responsibilities: str | None

    model_config = ConfigDict(from_attributes=True)
