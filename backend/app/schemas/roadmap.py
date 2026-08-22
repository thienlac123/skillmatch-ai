from uuid import UUID

from pydantic import BaseModel


class RoadmapRequest(BaseModel):
    job_id: UUID


class RoadmapResponse(BaseModel):
    id: UUID
    freelancer_id: UUID
    job_id: UUID
    items: list
    created_at: object

    class Config:
        from_attributes = True  