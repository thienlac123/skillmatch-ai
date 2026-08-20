from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, Field


class JobCreate(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=255,
    )

    description: str = Field(
        min_length=10,
    )

    required_skills: str

    budget_min: int | None = Field(
        default=None,
        ge=0,
    )

    budget_max: int | None = Field(
        default=None,
        ge=0,
    )


class JobUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    required_skills: str | None = None
    budget_min: int | None = None
    budget_max: int | None = None


class JobResponse(BaseModel):
    id: UUID
    client_id: UUID
    title: str
    description: str
    required_skills: str
    budget_min: int | None
    budget_max: int | None
    created_at: datetime

    class Config:
        from_attributes = True