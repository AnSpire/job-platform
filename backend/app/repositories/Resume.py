from fastapi import Depends
from app.dependencies.dependencies import get_async_session
from app.models.Resume import Resume
from sqlalchemy.ext.asyncio import AsyncSession


class ResumeRepository:
    def __init__(self, session: AsyncSession = Depends(get_async_session)):
        self.session = session
    
    async def create_resume(self, resume: Resume):
        self.session.add(Resume)
        await self.session.commit()
        await self.session.refresh()
        return resume