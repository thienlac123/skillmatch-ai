import logging
import uuid
from sqlalchemy.orm import Session

from app.models.freelancer_skill import FreelancerSkill
from app.models.job import Job
from app.models.job_skill import JobSkill
from app.models.match_result import MatchResult
from app.models.skill import Skill
from app.services.gemini_service import generate_match_explanation
from app.services.matching_service import calculate_match_score
from app.services.job_service import sync_job_skills

logger = logging.getLogger(__name__)


def create_match(
    db: Session,
    freelancer_id: uuid.UUID,
    job_id: uuid.UUID,
) -> MatchResult:
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise ValueError("Job not found")

    freelancer_skills_data = (
        db.query(FreelancerSkill, Skill.name)
        .join(Skill, Skill.id == FreelancerSkill.skill_id)
        .filter(FreelancerSkill.freelancer_id == freelancer_id)
        .all()
    )

    job_skills_data = (
        db.query(JobSkill, Skill.name)
        .join(Skill, Skill.id == JobSkill.skill_id)
        .filter(JobSkill.job_id == job_id)
        .all()
    )

    if not job_skills_data:
        sync_job_skills(db, job)
        job_skills_data = (
            db.query(JobSkill, Skill.name)
            .join(Skill, Skill.id == JobSkill.skill_id)
            .filter(JobSkill.job_id == job_id)
            .all()
        )

    result = calculate_match_score(
        freelancer_skills_data=freelancer_skills_data,
        job_skills_data=job_skills_data,
    )

    # Bọc try-except theo chuẩn Phần 22: Gemini lỗi không làm sập API
    try:
        explanation = generate_match_explanation(
            score=result["score"],
            strengths=result["strengths"],
            gaps=result["gaps"],
        )
    except Exception as ex:
        logger.warning(f"Gemini API failed: {ex}. Using fallback explanation.")
        explanation = (
            "AI explanation is temporarily unavailable. "
            "The match score was calculated successfully "
            "using the backend matching engine."
        )

    match = MatchResult(
        job_id=job_id,
        freelancer_id=freelancer_id,
        score=result["score"],
        strengths=result["strengths"],
        gaps=result["gaps"],
        explanation=explanation,
    )

    db.add(match)
    db.commit()
    db.refresh(match)

    return match