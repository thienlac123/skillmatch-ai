import uuid

from sqlalchemy import Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class JobSkill(Base):
    __tablename__ = "job_skills"

    job_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "jobs.id",
            ondelete="CASCADE",
        ),
        primary_key=True,
    )

    skill_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "skills.id",
            ondelete="CASCADE",
        ),
        primary_key=True,
    )

    importance: Mapped[float] = mapped_column(
        Float,
        default=1.0,
        nullable=False,
    )

    required_level: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )