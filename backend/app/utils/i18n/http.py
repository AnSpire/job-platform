# app/i18n/http.py
from __future__ import annotations
from typing import Any

def err(key: str, **params: Any) -> dict[str, Any]:
    return {"key": key, "params": params}
