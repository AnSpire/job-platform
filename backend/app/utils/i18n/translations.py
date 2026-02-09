from __future__ import annotations
from typing import Any, Literal

Lang = Literal["en", "es"]

MESSAGES: dict[str, dict[Lang, str]] = {
    # универсальные
    "errors.internal": {
        "en": "Internal server error",
        "es": "Error interno del servidor",
    },
    "errors.not_found": {
        "en": "Not found",
        "es": "No encontrado",
    },
    "errors.validation": {
        "en": "Validation error",
        "es": "Error de validación",
    },

    # примеры доменных
    "errors.user_not_found": {
        "en": "User not found",
        "es": "Usuario no encontrado",
    },
    "errors.vacancy_not_found": {
        "en": "Vacancy not found",
        "es": "Vacante no encontrada",
    },

    # пример с параметром
    "errors.field_required": {
        "en": "Field '{field}' is required",
        "es": "El campo '{field}' es obligatorio",
    },
}

MESSAGES.update({
  "errors.field_required": {
    "en": "Field '{field}' is required",
    "es": "El campo '{field}' es obligatorio",
  },
  "errors.string_too_short": {
    "en": "Field '{field}' is too short (min {min})",
    "es": "El campo '{field}' es demasiado corto (mín {min})",
  },
  "errors.string_too_long": {
    "en": "Field '{field}' is too long (max {max})",
    "es": "El campo '{field}' es demasiado largo (máx {max})",
  },
  "errors.invalid_int": {
    "en": "Field '{field}' must be an integer",
    "es": "El campo '{field}' debe ser un entero",
  },
  "errors.invalid_float": {
    "en": "Field '{field}' must be a number",
    "es": "El campo '{field}' debe ser un número",
  },
})

DEFAULT_LANG: Lang = "en"

def t(key: str, lang: Lang, **params: Any) -> str:
    row = MESSAGES.get(key)
    if not row:
        # если ключ забыли добавить — вернём ключ, чтобы быстро заметить
        template = key
    else:
        template = row.get(lang) or row.get(DEFAULT_LANG) or key

    try:
        return template.format(**params)
    except Exception:
        # если параметры не совпали — вернём как есть, без падения
        return template
