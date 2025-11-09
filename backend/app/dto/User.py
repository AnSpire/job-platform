from typing import Annotated
from pydantic import BaseModel, EmailStr, StringConstraints, ConfigDict
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr | None = None
    password: Annotated[str, StringConstraints(min_length=6)] | None = None
    first_name: Annotated[str, StringConstraints(min_length=1, max_length=80)] | None = None
    last_name: Annotated[str, StringConstraints(min_length=1, max_length=80)] | None = None
    role: Annotated[str, StringConstraints(pattern="^(student|employer|admin)$")] | None = None


class UserRead(BaseModel):
    id: int
    email: EmailStr
    first_name: str | None = None
    last_name: str | None = None
    role: str | None = None

    class Config:
        from_attributes = True


class UserInDB(BaseModel):
    id: int
    email: str
    first_name: Optional[str] = None 
    last_name: Optional[str] = None
    role: str
    password_hash: str

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None

