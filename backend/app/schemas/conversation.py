from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ConversationCreate(BaseModel):
    job_id: UUID
    freelancer_id: UUID


class ConversationResponse(BaseModel):
    id: UUID
    job_id: UUID
    client_id: UUID
    freelancer_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    content: str = Field(min_length=1, max_length=5000)


class MessageResponse(BaseModel):
    id: UUID
    conversation_id: UUID
    sender_id: UUID
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
