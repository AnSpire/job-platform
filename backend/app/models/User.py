from app.models.Base import DCBase
from datetime import datetime
from sqlalchemy import String, Text, CheckConstraint, func
from sqlalchemy.dialects.postgresql import CITEXT
from sqlalchemy.orm import  Mapped, mapped_column



class User(DCBase):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    email: Mapped[str] = mapped_column(CITEXT, unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    first_name: Mapped[str] = mapped_column(String(80), nullable=False)
    last_name: Mapped[str] = mapped_column(String(80), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now(),
        nullable=False,
        init=False
    )

    __table_args__ = (
        CheckConstraint("role IN ('student', 'employer', 'admin')", name="check_role"),
    )