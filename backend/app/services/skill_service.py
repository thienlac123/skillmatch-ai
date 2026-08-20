from sqlalchemy.orm import Session

from app.models.freelancer_skill import FreelancerSkill
from app.models.skill import Skill
from app.models.user import User
from app.schemas.skill import SkillCreate


def add_skill_to_freelancer(
    db: Session,
    user: User,
    data: SkillCreate,
):
    normalized_name = data.name.strip().lower()

    skill = (
        db.query(Skill)
        .filter(
            Skill.normalized_name == normalized_name
        )
        .first()
    )

    if skill is None:
        skill = Skill(
            name=data.name.strip(),
            normalized_name=normalized_name,
        )

        db.add(skill)
        db.flush()

    existing = (
        db.query(FreelancerSkill)
        .filter(
            FreelancerSkill.freelancer_id == user.id,
            FreelancerSkill.skill_id == skill.id,
        )
        .first()
    )

    if existing:
        existing.level = data.level
        existing.years_experience = data.years_experience

    else:
        freelancer_skill = FreelancerSkill(
            freelancer_id=user.id,
            skill_id=skill.id,
            level=data.level,
            years_experience=data.years_experience,
        )

        db.add(freelancer_skill)

    db.commit()

    return skill