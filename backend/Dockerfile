# ---- 1. Builder stage ----
FROM python:3.13-slim AS builder

WORKDIR /app

RUN pip install uv

COPY pyproject.toml uv.lock ./

# uv создаст /app/.venv
RUN uv sync --frozen

# ---- 2. Финальный образ ----
FROM python:3.13-slim

WORKDIR /app

# Копируем окружение из builder
COPY --from=builder /app/.venv /app/.venv

# Добавляем виртуальное окружение в PATH
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Копируем весь проект
COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
