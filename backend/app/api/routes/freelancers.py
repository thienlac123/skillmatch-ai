from uuid import UUID

import os

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User, UserRole
from app.schemas.freelancer import (
    FreelancerProfileResponse,
    FreelancerProfileUpdate,
)
from app.schemas.freelancer_public import PublicFreelancerProfileResponse
from app.schemas.skill import SkillCreate
from app.services.freelancer_service import (
    get_freelancer_profile,
    get_freelancer_skills,
    update_freelancer_profile,
)
from app.services.skill_service import add_skill_to_freelancer

router = APIRouter(
    prefix="/freelancers",
    tags=["Freelancers"],
)

UPLOAD_DIR = "uploads/cv"


def profile_response(profile, skills):
    return {
        "user_id": profile.user_id,
        "full_name": profile.full_name,
        "bio": profile.bio,
        "experience_years": profile.experience_years,
        "cv_text": profile.cv_text,
        "cv_filename": profile.cv_filename,
        "cv_text_preview": profile.cv_text[:1200] if profile.cv_text else None,
        "skills": [
            {
                "skill_id": skill.id,
                "name": skill.name,
                "level": link.level,
                "years_experience": link.years_experience,
            }
            for link, skill in skills
        ],
    }


@router.get(
    "/{user_id}/public",
    response_model=PublicFreelancerProfileResponse,
)
def get_public_profile(
    user_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != UserRole.CLIENT:
        raise HTTPException(status_code=403, detail="Only clients can view public profiles")
    profile = get_freelancer_profile(db, user_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Freelancer profile not found")
    freelancer = db.query(User).filter(User.id == user_id).first()
    if not freelancer or freelancer.role != UserRole.FREELANCER:
        raise HTTPException(status_code=404, detail="Freelancer profile not found")
    return {
        "user_id": profile.user_id,
        "full_name": profile.full_name,
        "bio": profile.bio,
        "experience_years": profile.experience_years,
        "cv_filename": profile.cv_filename,
        "skills": [
            {
                "skill_id": skill.id,
                "name": skill.name,
                "level": link.level,
                "years_experience": link.years_experience,
            }
            for link, skill in get_freelancer_skills(db, user_id)
        ],
    }


@router.get("/me/cv")
def get_my_cv(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != UserRole.FREELANCER:
        raise HTTPException(status_code=403, detail="Only freelancers can view CV")

    profile = get_freelancer_profile(db, current_user.id)
    if not profile or not profile.cv_filename:
        raise HTTPException(status_code=404, detail="CV not found")

    file_path = os.path.join(UPLOAD_DIR, profile.cv_filename)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="CV file is unavailable")

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=profile.cv_filename,
        content_disposition_type="inline",
    )


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

    profile = update_freelancer_profile(
        db,
        current_user,
        data,
    )

    return profile_response(profile, get_freelancer_skills(db, current_user.id))


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
            "level": data.level,
            "years_experience": data.years_experience,
        },
    }


@router.get(
    "/{user_id}",
    response_model=FreelancerProfileResponse,
)
def get_profile(
    user_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Use the public profile endpoint")
    profile = get_freelancer_profile(
        db,
        user_id,
    )

    if profile is None:
        raise HTTPException(
            status_code=404,
            detail="Freelancer profile not found",
        )

    return profile_response(profile, get_freelancer_skills(db, user_id))