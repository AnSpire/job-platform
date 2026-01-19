class RepositoryError(Exception):
    """Базовая ошибка слоя данных."""


class NotFoundError(RepositoryError):
    """Сущность не найдена."""


class ConflictError(RepositoryError):
    """Конфликт уникальности / уже существует."""


class ForeignKeyError(RepositoryError):
    """Неверные ссылки на связанные сущности (FK)."""


class ConstraintError(RepositoryError):
    """Прочие ограничения БД."""
