from uuid import UUID

from pydantic import BaseModel


class MatchRequest(BaseModel):
    job_id: UUID


class MatchResponse(BaseModel):
    id: UUID
    job_id: UUID
    freelancer_id: UUID
    score: float
    strengths: list
    gaps: list
    explanation: str | None

    class Config:
        from_attributes = True