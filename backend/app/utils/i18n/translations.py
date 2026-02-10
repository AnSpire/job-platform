from __future__ import annotations
from typing import Any, Literal

Lang = Literal["en", "es", "ru"]

MESSAGES: dict[str, dict[Lang, str]] = {
    # универсальные
    "errors.internal": {
        "en": "Internal server error",
        "es": "Error interno del servidor",
        "ru": "Внутренняя ошибка сервера",
    },
    "errors.not_found": {
        "en": "Not found",
        "es": "No encontrado",
        "ru": "Не найдено",
    },
    "errors.validation": {
        "en": "Validation error",
        "es": "Error de validación",
        "ru": "Ошибка валидации",
    },

    # доменные
    "errors.user_not_found": {
        "en": "User not found",
        "es": "Usuario no encontrado",
        "ru": "Пользователь не найден",
    },
    "errors.vacancy_not_found": {
        "en": "Vacancy not found",
        "es": "Vacante no encontrada",
        "ru": "Вакансия не найдена",
    },

    # с параметрами
    "errors.field_required": {
        "en": "Field '{field}' is required",
        "es": "El campo '{field}' es obligatorio",
        "ru": "Поле '{field}' обязательно",
    },
}

MESSAGES.update({
    "errors.string_too_short": {
        "en": "Field '{field}' is too short (min {min})",
        "es": "El campo '{field}' es demasiado corto (mín {min})",
        "ru": "Поле '{field}' слишком короткое (минимум {min})",
    },
    "errors.string_too_long": {
        "en": "Field '{field}' is too long (max {max})",
        "es": "El campo '{field}' es demasiado largo (máx {max})",
        "ru": "Поле '{field}' слишком длинное (максимум {max})",
    },
    "errors.invalid_int": {
        "en": "Field '{field}' must be an integer",
        "es": "El campo '{field}' debe ser un entero",
        "ru": "Поле '{field}' должно быть целым числом",
    },
    "errors.invalid_float": {
        "en": "Field '{field}' must be a number",
        "es": "El campo '{field}' debe ser un número",
        "ru": "Поле '{field}' должно быть числом",
    },
})

DEFAULT_LANG: Lang = "en"

def t(key: str, lang: Lang, **params: Any) -> str:
    row = MESSAGES.get(key)
    if not row:
        template = key
    else:
        template = row.get(lang) or row.get(DEFAULT_LANG) or key

    try:
        return template.format(**params)
    except Exception:
        return template
