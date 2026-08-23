import uuid
from sqlalchemy.orm import Session

from app.models.job import Job
from app.models.job_skill import JobSkill
from app.models.skill import Skill
from app.models.user import User
from app.schemas.job import JobCreate, JobUpdate
from app.services.skill_normalizer import normalize_skill


def sync_job_skills(db: Session, job: Job, replace: bool = False):
    if replace:
        db.query(JobSkill).filter(JobSkill.job_id == job.id).delete()

    existing_skill_ids = {
        row.skill_id
        for row in db.query(JobSkill).filter(JobSkill.job_id == job.id).all()
    }

    raw_skills = [
        value.strip()
        for value in job.required_skills.split(",")
        if value.strip()
    ]

    for index, skill_name in enumerate(raw_skills):
        normalized = normalize_skill(skill_name)
        skill = (
            db.query(Skill)
            .filter(Skill.normalized_name == normalized)
            .first()
        )
        if skill is None:
            skill = Skill(name=skill_name, normalized_name=normalized)
            db.add(skill)
            db.flush()

        if skill.id in existing_skill_ids:
            continue

        importance = 5.0 if index < 2 else 3.0 if index == 2 else 2.0
        required_level = "advanced" if index < 2 else "intermediate"
        db.add(JobSkill(
            job_id=job.id,
            skill_id=skill.id,
            importance=importance,
            required_level=required_level,
        ))

    db.commit()


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

    sync_job_skills(db, job)

    return job


def get_jobs(
    db: Session,
    client_id=None,
):
    query = db.query(Job)
    if client_id is not None:
        query = query.filter(Job.client_id == client_id)
    return (
        query
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
        sync_job_skills(db, job, replace=True)

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