from typing import Literal

from pydantic import BaseModel, Field, field_validator


class GeneratedRoadmapItem(BaseModel):
    skill: str = Field(min_length=1, max_length=100)
    priority: Literal["low", "medium", "high"]
    weeks: int = Field(ge=1, le=52)
    steps: list[str] = Field(min_length=1, max_length=12)

    @field_validator("steps")
    @classmethod
    def validate_steps(cls, value: list[str]) -> list[str]:
        cleaned = [step.strip() for step in value if step.strip()]
        if not cleaned:
            raise ValueError("steps must contain at least one non-empty step")
        return cleaned


class GeneratedRoadmap(BaseModel):
    goal: str = Field(min_length=10, max_length=500)
    items: list[GeneratedRoadmapItem] = Field(min_length=1, max_length=50)
