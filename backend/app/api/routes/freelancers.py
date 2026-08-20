from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User, UserRole
from app.schemas.freelancer import (
    FreelancerProfileResponse,
    FreelancerProfileUpdate,
)
from app.schemas.skill import SkillCreate
from app.services.freelancer_service import (
    get_freelancer_profile,
    update_freelancer_profile,
)
from app.services.skill_service import add_skill_to_freelancer

router = APIRouter(
    prefix="/freelancers",
    tags=["Freelancers"],
)


@router.get(
    "/{user_id}",
    response_model=FreelancerProfileResponse,
)
def get_profile(
    user_id: UUID,
    db: Session = Depends(get_db),
):
    profile = get_freelancer_profile(
        db,
        user_id,
    )

    if profile is None:
        raise HTTPException(
            status_code=404,
            detail="Freelancer profile not found",
        )

    return profile


@router.put(
    "/me",
    response_model=FreelancerProfileResponse,
)
def update_my_profile(
    data: FreelancerProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != UserRole.FREELANCER:
        raise HTTPException(
            status_code=403,
            detail="Only freelancers can update freelancer profiles",
        )

    return update_freelancer_profile(
        db,
        current_user,
        data,
    )


@router.post(
    "/me/skills",
)
def add_skill(
    data: SkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != UserRole.FREELANCER:
        raise HTTPException(
            status_code=403,
            detail="Only freelancers can manage skills",
        )

    skill = add_skill_to_freelancer(
        db,
        current_user,
        data,
    )

    return {
        "message": "Skill added successfully",
        "skill": {
            "id": str(skill.id),
            "name": skill.name,
            "normalized_name": skill.normalized_name,
        },
    }