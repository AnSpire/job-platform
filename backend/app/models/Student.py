from typing import List
from sqlalchemy import ForeignKey, String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.Base import DCBase
from app.models.User import User
from typing import TYPE_CHECKING



# class Student(DCBase):
#     __tablename__ = "students"

#     id: Mapped[int] = mapped_column(primary_key=True, init=False)

#     user_id: Mapped[int] = mapped_column(
#         ForeignKey("users.id", ondelete="CASCADE"),
#         unique=True,
#         nullable=False
#     )

#     university: Mapped[str] = mapped_column(String(255), nullable=True)
#     faculty: Mapped[str] = mapped_column(String(255), nullable=True)
#     course: Mapped[int] = mapped_column(Integer, nullable=True)
#     group: Mapped[str] = mapped_column(String(50), nullable=True)

#     user: Mapped["User"] = relationship(
#         "User",
#         back_populates="student_profile"
#     )

#     def __repr__(self):
#         return f"<Student id={self.id} user_id={self.user_id}>"

