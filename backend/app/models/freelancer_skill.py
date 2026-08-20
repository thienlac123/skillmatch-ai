import uuid

from sqlalchemy import Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class FreelancerSkill(Base):
    __tablename__ = "freelancer_skills"

    freelancer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "freelancer_profiles.user_id",
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

    level: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    years_experience: Mapped[float] = mapped_column(
        Float,
        default=0,
        nullable=False,
    )