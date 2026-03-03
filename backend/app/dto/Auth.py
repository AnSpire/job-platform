from pydantic import BaseModel, EmailStr
from pydantic import Field
from typing import Annotated

class LoginRequest(BaseModel):
    email: EmailStr
    password: Annotated[str, Field(min_length=1)]


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int 


class RefreshTokenRequest(BaseModel):
    refresh_token: str