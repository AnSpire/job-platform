# ---- 1. Builder stage ----
FROM python:3.13-slim AS builder

WORKDIR /app

RUN pip install uv

# Для сборки psycopg2 из исходников
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
     build-essential \
     libpq-dev \
  && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen

# ---- 2. Финальный образ ----
FROM python:3.13-slim

WORKDIR /app

# Runtime зависимости для psycopg2: libpq.so.5 даёт пакет libpq5
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
     libpq5 \
     ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/.venv /app/.venv

ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

COPY . .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
