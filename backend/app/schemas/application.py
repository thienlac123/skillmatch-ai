from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.application import ApplicationStatus


class ApplicationCreate(BaseModel):
    job_id: UUID
    cover_letter: str = Field(min_length=20, max_length=5000)
    proposed_budget: float | None = Field(default=None, ge=0)
    delivery_days: int | None = Field(default=None, ge=1, le=365)


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus


class ApplicationResponse(BaseModel):
    id: UUID
    job_id: UUID
    freelancer_id: UUID
    cover_letter: str
    proposed_budget: float | None
    delivery_days: int | None
    match_score: float | None
    status: ApplicationStatus
    created_at: datetime
    freelancer_name: str | None = None
    freelancer_email: str | None = None

    class Config:
        from_attributes = True
