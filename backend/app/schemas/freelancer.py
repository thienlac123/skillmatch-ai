from uuid import UUID

from pydantic import BaseModel, Field


class FreelancerProfileResponse(BaseModel):
    user_id: UUID
    full_name: str | None
    bio: str | None
    experience_years: float
    cv_text: str | None

    class Config:
        from_attributes = True


class FreelancerProfileUpdate(BaseModel):
    full_name: str | None = None
    bio: str | None = None
    experience_years: float = Field(
        default=0,
        ge=0,
    )