# app/i18n/validation_map.py
from __future__ import annotations
from typing import Any
from app.utils.i18n.translations import t
from app.utils.i18n.lang import Lang

TYPE_TO_KEY: dict[str, str] = {
    "missing": "errors.field_required",
    "string_too_short": "errors.string_too_short",
    "string_too_long": "errors.string_too_long",
}

def translate_validation_error(lang: Lang, e: dict[str, Any]) -> str:
    err_type = str(e.get("type") or "")
    key = TYPE_TO_KEY.get(err_type)
    if not key:
        # fallback: пусть будет оригинальный msg (лучше, чем ничего)
        return str(e.get("msg") or t("errors.validation", lang))

    loc = e.get("loc") or []
    field = "field"
    if isinstance(loc, (list, tuple)) and len(loc) > 0:
        field = str(loc[-1])

    params: dict[str, Any] = {"field": field}

    ctx = e.get("ctx") or {}
    if isinstance(ctx, dict):
        if "min_length" in ctx:
            params["min"] = ctx["min_length"]
        if "max_length" in ctx:
            params["max"] = ctx["max_length"]

    return t(key, lang, **params)
