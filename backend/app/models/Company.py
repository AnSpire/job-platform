from datetime import datetime
from typing import List
from sqlalchemy import String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.Base import DCBase
from app.models.Vacancy import Vacancy
from app.models.Employer import Employer
class Company(DCBase):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    website: Mapped[str] = mapped_column(String(255), nullable=True)
    industry: Mapped[str] = mapped_column(String(100), nullable=True)
    location: Mapped[str] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)

    employers: Mapped[List[Employer]] = relationship("Employer", back_populates="company", cascade="all, delete")
    vacancies: Mapped[List[Vacancy]] = relationship("Vacancy", back_populates="company", cascade="all, delete")

    def __repr__(self):
        return f"<Company id={self.id} name={self.name!r}>"
