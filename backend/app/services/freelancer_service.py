from uuid import UUID

from sqlalchemy.orm import Session

from app.models.freelancer_profile import FreelancerProfile
from app.models.freelancer_skill import FreelancerSkill
from app.models.skill import Skill
from app.models.user import User
from app.schemas.freelancer import FreelancerProfileUpdate


def get_freelancer_profile(
    db: Session,
    user_id: UUID,
):
    return (
        db.query(FreelancerProfile)
        .filter(
            FreelancerProfile.user_id == user_id
        )
        .first()
    )


def get_freelancer_skills(db: Session, user_id: UUID):
    return (
        db.query(FreelancerSkill, Skill)
        .join(Skill, Skill.id == FreelancerSkill.skill_id)
        .filter(FreelancerSkill.freelancer_id == user_id)
        .order_by(Skill.name.asc())
        .all()
    )


def update_freelancer_profile(
    db: Session,
    user: User,
    data: FreelancerProfileUpdate,
):
    profile = get_freelancer_profile(
        db,
        user.id,
    )

    if profile is None:
        profile = FreelancerProfile(
            user_id=user.id,
        )

        db.add(profile)

    if data.full_name is not None:
        profile.full_name = data.full_name
    if data.bio is not None:
        profile.bio = data.bio
    if data.experience_years is not None:
        profile.experience_years = data.experience_years

    db.commit()
    db.refresh(profile)

    return profile