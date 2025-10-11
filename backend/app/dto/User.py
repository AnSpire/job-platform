from typing import Annotated
from pydantic import BaseModel, EmailStr, StringConstraints

class UserCreate(BaseModel):
    email: EmailStr
    password: Annotated[str, StringConstraints(min_length=6)]
    first_name: Annotated[str, StringConstraints(min_length=1, max_length=80)]
    last_name: Annotated[str, StringConstraints(min_length=1, max_length=80)]
    role: Annotated[str, StringConstraints(pattern="^(student|employer|admin)$")]

class UserRead(BaseModel):
    id: str
    email: EmailStr
    first_name: str
    last_name: str
    role: str

    class Config:
        from_attributes = True