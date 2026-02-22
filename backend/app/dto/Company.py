from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, StringConstraints


class CompanyCreate(BaseModel):
    name: Annotated[str, StringConstraints(min_length=1, max_length=120)]
    description: str | None = None
    website: Annotated[str, StringConstraints(max_length=255)] | None = None
    industry: Annotated[str, StringConstraints(max_length=100)] | None = None
    location: Annotated[str, StringConstraints(max_length=100)] | None = None
    logo_url: Annotated[str, StringConstraints(max_length=100)] | None = None


class CompanyRead(BaseModel):
    id: int
    name: str
    description: str | None
    website: str | None
    industry: str | None
    location: str | None
    logo_url: str | None

    class Config:
        from_attributes = True


class CompanyUpdate(BaseModel):
    name: Annotated[str, StringConstraints(min_length=1, max_length=120)] | None = None
    description: str | None = None
    website: Annotated[str, StringConstraints(max_length=255)] | None = None
    industry: Annotated[str, StringConstraints(max_length=100)] | None = None
    location: Annotated[str, StringConstraints(max_length=100)] | None = None
    logo_url: Annotated[str, StringConstraints(max_length=100)] | None = None
