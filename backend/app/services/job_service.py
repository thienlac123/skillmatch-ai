import uuid
from sqlalchemy.orm import Session

from app.models.job import Job
from app.models.job_skill import JobSkill
from app.models.skill import Skill
from app.models.user import User
from app.schemas.job import JobCreate, JobUpdate
from app.services.skill_normalizer import normalize_skill


def create_job(
    db: Session,
    client: User,
    data: JobCreate,
):
    # 1. Tạo bản ghi Job
    job = Job(
        client_id=client.id,
        title=data.title,
        description=data.description,
        required_skills=data.required_skills,
        budget_min=data.budget_min,
        budget_max=data.budget_max,
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    # 2. Tự động bóc tách required_skills tạo skills và job_skills
    if data.required_skills:
        raw_skills = [
            s.strip() for s in data.required_skills.split(",") if s.strip()
        ]

        for index, skill_name in enumerate(raw_skills):
            normalized = normalize_skill(skill_name)

            # Tìm hoặc tạo kỹ năng trong bảng skills
            skill = (
                db.query(Skill).filter(Skill.name.ilike(skill_name)).first()
            )
            if not skill:
                skill = Skill(name=skill_name, normalized_name=normalized)
                db.add(skill)
                db.commit()
                db.refresh(skill)

            # Trọng số: 2 skill đầu có importance = 5.0, skill 3 = 3.0, skill 4 trở đi = 2.0
            if index == 0 or index == 1:
                importance_val = 5.0
                req_level = "advanced"
            elif index == 2:
                importance_val = 3.0
                req_level = "intermediate"
            else:
                importance_val = 2.0
                req_level = "intermediate"

            job_skill = JobSkill(
                job_id=job.id,
                skill_id=skill.id,
                importance=importance_val,
                required_level=req_level,
            )
            db.add(job_skill)

        db.commit()

    return job


def get_jobs(
    db: Session,
):
    return (
        db.query(Job)
        .order_by(Job.created_at.desc())
        .all()
    )


def get_job(
    db: Session,
    job_id: uuid.UUID,
):
    return (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )


def update_job(
    db: Session,
    job: Job,
    data: JobUpdate,
):
    if data.title is not None:
        job.title = data.title

    if data.description is not None:
        job.description = data.description

    if data.required_skills is not None:
        job.required_skills = data.required_skills

    if data.budget_min is not None:
        job.budget_min = data.budget_min

    if data.budget_max is not None:
        job.budget_max = data.budget_max

    db.commit()
    db.refresh(job)

    return job


def delete_job(
    db: Session,
    job: Job,
):
    db.delete(job)
    db.commit()