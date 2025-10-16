import time
import uuid
import jwt
from typing import Literal, Optional
from datetime import datetime, timedelta, timezone
from app.core.settings import settings, PRIVATE_KEY, PUBLIC_KEY, ALGO


TokenType = Literal["access", "refresh"]

def _now() -> datetime:
    return datetime.now(timezone.utc)

def _exp(minutes: int = 0, days: int = 0) -> datetime:
    return _now() + timedelta(days=days, minutes=minutes)


def _base_claims(sub: str, ttype: TokenType, extra: Optional[dict]=None) -> dict:
    now = _now()
    claims = {
        "iss": settings.JWT_ISS,
        "aud": settings.JWT_AUD,
        "iat": int(now.timestamp()),
        "nbf": int(now.timestamp()),
        "sub": sub,
        "typ": ttype
    }
    if extra:
        claims.update(extra)
    return claims



def create_access_token(user_id: int, email: str) -> str:
    claims = _base_claims(sub=str(user_id), ttype="access", extra={
        "email": email,
        "scope": "user",
        "exp": int(_exp(minutes=settings.ACCESS_TTL_MIN).timestamp())
    })
    return jwt.encode(claims, PRIVATE_KEY, algorithm=ALGO)
    
def create_refresh_token(user_id: int) -> str:
    jti = str(uuid.uuid4())
    claims = _base_claims(sub=str(user_id), ttype="refresh", extra={
        "jti": jti,
        "exp": int(_exp(days=settings.REFRESH_TTL_DAYS).timestamp())
    })
    return jwt.encode(claims, PRIVATE_KEY, algorithm=ALGO)

class JWTError(Exception): ...

def decode_token(token: str, expected_type: TokenType) -> dict:
    try:
        claims = jwt.decode(
            token,
            PUBLIC_KEY,
            algorithms=[ALGO],
            audience=settings.JWT_AUD,
            options={"require": ["exp", "iat", "nbf", "sub", "typ"]}
        )
    except jwt.PyJWTError as e:
        raise JWTError(str(e))
    if claims.get("typ") != expected_type:
        raise JWTError("invalid token type")
    return claims

