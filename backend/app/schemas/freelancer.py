from uuid import UUID

from pydantic import BaseModel, Field


class FreelancerSkillProfile(BaseModel):
    skill_id: UUID
    name: str
    level: str
    years_experience: float


class FreelancerProfileResponse(BaseModel):
    user_id: UUID
    full_name: str | None
    bio: str | None
    experience_years: float
    cv_text: str | None
    cv_filename: str | None
    cv_text_preview: str | None
    skills: list[FreelancerSkillProfile] = Field(default_factory=list)

    class Config:
        from_attributes = True


class FreelancerProfileUpdate(BaseModel):
    full_name: str | None = None
    bio: str | None = None
    experience_years: float | None = Field(default=None, ge=0)