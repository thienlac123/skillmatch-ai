from uuid import UUID

from pydantic import BaseModel

from app.models.user import UserRole


class UserResponse(BaseModel):
    id: UUID
    email: str
    role: UserRole

    class Config:
        from_attributes = True