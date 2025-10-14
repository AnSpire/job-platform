from typing import List
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.Base import DCBase
from app.models.User import User
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.Company import Company
from app.models.Vacancy import Vacancy


class Employer(DCBase):
    __tablename__ = "employers"

    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id", ondelete="CASCADE"))

    position: Mapped[str] = mapped_column(String(100), nullable=True)  

    user: Mapped[User] = relationship("User", back_populates="employer_profile")
    company: Mapped["Company"] = relationship("Company", back_populates="employers")
    vacancies: Mapped[List[Vacancy]] = relationship("Vacancy", back_populates="employer", cascade="all, delete")

    def __repr__(self):
        return f"<Employer id={self.id} user_id={self.user_id} company_id={self.company_id}>"
