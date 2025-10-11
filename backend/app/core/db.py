from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base


DATABASE_URL = "postgresql+asyncpg://user:password@localhost:5432/mydb"

engine = create_async_engine(DATABASE_URL, echo=True)

async_session_maker: sessionmaker[AsyncSession] = sessionmaker(
    engine,
    expire_on_commit=False,
    class_=AsyncSession,
)

# Зависимость FastAPI
async def get_async_session() -> AsyncSession:
    async with async_session_maker() as session:
        yield session