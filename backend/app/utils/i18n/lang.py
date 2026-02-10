from __future__ import annotations
from typing import Literal, Optional
from fastapi import Request

Lang = Literal["en", "es", "ru"]
DEFAULT_LANG: Lang = "en"
SUPPORTED: set[str] = {"en", "es", "ru"}

def _parse_accept_language(value: str | None) -> Optional[str]:
    """
    Очень простой парсер: берет первый язык (es-ES -> es).
    Этого обычно достаточно для учебного задания.
    """
    if not value:
        return None
    first = value.split(",")[0].strip().lower()
    # es-es -> es
    return first.split("-")[0]

def get_lang(request: Request) -> Lang:
    # 1) query param ?lang=
    q = (request.query_params.get("lang") or "").lower().strip()
    if q in SUPPORTED:
        return q  # type: ignore[return-value]

    # 2) Accept-Language header
    h = _parse_accept_language(request.headers.get("Accept-language"))
    if h in SUPPORTED:
        return h  # type: ignore[return-value]

    # 3) default
    return DEFAULT_LANG
