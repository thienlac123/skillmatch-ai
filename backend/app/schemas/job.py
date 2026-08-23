from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, Field, model_validator


class JobCreate(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=255,
    )

    description: str = Field(
        min_length=10,
    )

    required_skills: str = Field(min_length=1)

    budget_min: int | None = Field(
        default=None,
        ge=0,
    )

    budget_max: int | None = Field(
        default=None,
        ge=0,
    )

    @model_validator(mode="after")
    def validate_budget(self):
        if (
            self.budget_min is not None
            and self.budget_max is not None
            and self.budget_max < self.budget_min
        ):
            raise ValueError("budget_max must be greater than or equal to budget_min")
        return self


class JobUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    required_skills: str | None = None
    budget_min: int | None = None
    budget_max: int | None = None

    @model_validator(mode="after")
    def validate_budget(self):
        if (
            self.budget_min is not None
            and self.budget_max is not None
            and self.budget_max < self.budget_min
        ):
            raise ValueError("budget_max must be greater than or equal to budget_min")
        return self


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