from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.Vacancy import VacancyRepository
from app.dto.Vacancy import VacancyCreate, VacancyRead, VacancyUpdate
from app.repositories.Exceptions import NotFoundError, ConflictError, ConstraintError, ForeignKeyError


class VacancyService:
    def __init__(
        self, 
        session: AsyncSession, 
        vacancy_repo: VacancyRepository
    ):
        self.session = session
        self.repo = vacancy_repo


    async def create(self, vacancy_data: VacancyCreate) -> VacancyRead:
        try:
            created_vacancy = await self.repo.create(data=vacancy_data)

        except ConflictError as e:
            await self.session.rollback()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
        except NotFoundError as e:
            await self.session.rollback()
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
        except (ForeignKeyError, ConstraintError) as e:
            await self.session.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        except Exception:
            await self.session.rollback()
            raise
        
    