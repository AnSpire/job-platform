from __future__ import annotations

from datetime import datetime
from typing import Optional, TYPE_CHECKING
import enum

from sqlalchemy import Enum as SAEnum, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.Base import DCBase

if TYPE_CHECKING:
    from app.models.Application import Application


class InterviewFormat(enum.Enum):
    ONLINE = "online"
    ONSITE = "onsite"
    PHONE = "phone"


class InterviewStatus(enum.Enum):
    PLANNED = "planned"
    COMPLETED = "completed"
    CANCELED = "canceled"
    NO_SHOW = "no_show"


class Interview(DCBase):
    __tablename__ = "interviews"

    id: Mapped[int] = mapped_column(primary_key=True, init=False)

    application_id: Mapped[int] = mapped_column(
        ForeignKey("applications.id", ondelete="CASCADE"),
        nullable=False,
    )

    scheduled_at: Mapped[datetime] = mapped_column(nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False)

    format: Mapped[InterviewFormat] = mapped_column(
        SAEnum(InterviewFormat, name="interview_format"),
        nullable=False,
    )

    location_or_link: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    status: Mapped[InterviewStatus] = mapped_column(
        SAEnum(InterviewStatus, name="interview_status"),
        nullable=False,
        default=InterviewStatus.PLANNED,
    )

    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True, default=None)

    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now(),
        nullable=False,
        init=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
        init=False,
    )

    application: Mapped["Application"] = relationship(
        "Application",
        back_populates="interviews",
        init=False,
    )
