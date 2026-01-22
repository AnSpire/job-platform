from __future__ import annotations

from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, StringConstraints, ConfigDict


Title = Annotated[str, StringConstraints(min_length=1, max_length=120)]
ShortStr30 = Annotated[str, StringConstraints(min_length=1, max_length=30)]
ShortStr100 = Annotated[str, StringConstraints(min_length=1, max_length=100)]
Currency = Annotated[str, StringConstraints(min_length=1, max_length=10)]


class VacancyCreate(BaseModel):
    title: Title
    description: str

    requirements: str | None = None
    responsibilities: str | None = None

    salary_from: int | None = None
    salary_to: int | None = None
    currency: Currency | None = None

    location: ShortStr100 | None = None
    employment_type: ShortStr30 | None = None

    employer_id: int


class VacancyRead(BaseModel):
    id: int
    employer_id: int

    title: str
    description: str
    requirements: str | None
    responsibilities: str | None

    salary_from: int | None
    salary_to: int | None
    currency: str | None

    location: str | None
    employment_type: str | None

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class VacancyUpdate(BaseModel):
    title: Title | None = None
    description: str | None = None

    requirements: str | None = None
    responsibilities: str | None = None

    salary_from: int | None = None
    salary_to: int | None = None
    currency: Currency | None = None

    location: ShortStr100 | None = None
    employment_type: ShortStr30 | None = None
