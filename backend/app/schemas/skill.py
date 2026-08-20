from uuid import UUID

from pydantic import BaseModel, Field


class SkillCreate(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=100,
    )
    level: str
    years_experience: float = Field(
        default=0,
        ge=0,
    )


class SkillResponse(BaseModel):
    id: UUID
    name: str
    normalized_name: str


class FreelancerSkillResponse(BaseModel):
    skill_id: UUID
    skill_name: str
    level: str
    years_experience: float