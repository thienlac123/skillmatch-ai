from uuid import UUID

from pydantic import BaseModel, Field


class PublicFreelancerSkill(BaseModel):
    skill_id: UUID
    name: str
    level: str
    years_experience: float


class PublicFreelancerProfileResponse(BaseModel):
    user_id: UUID
    full_name: str | None
    bio: str | None
    experience_years: float
    cv_filename: str | None
    skills: list[PublicFreelancerSkill] = Field(default_factory=list)
