from uuid import UUID

from sqlalchemy.orm import Session

from app.models.freelancer_profile import FreelancerProfile
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

    profile.full_name = data.full_name
    profile.bio = data.bio
    profile.experience_years = data.experience_years

    db.commit()
    db.refresh(profile)

    return profile