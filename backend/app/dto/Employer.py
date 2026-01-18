from typing import Annotated
from pydantic import BaseModel, EmailStr, StringConstraints, ConfigDict
from typing import Optional

class EmployerCreate(BaseModel):
    user_id: int
    company_id: int | None = None
    position: Annotated[str, StringConstraints(min_length=1, max_length=80)] | None = None


class EmployerRead(BaseModel):
    id: int
    user_id: int
    company_id: int | None
    position: str | None

    class Config:
        from_attributes = True


class EmployerUpdate(BaseModel):
    company_id: int | None = None
    position: Annotated[str, StringConstraints(min_length=1, max_length=100)] | None = None
