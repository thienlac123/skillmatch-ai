import uuid

from sqlalchemy.orm import Session

from app.models.job import Job
from app.models.user import User
from app.schemas.job import JobCreate, JobUpdate


def create_job(
    db: Session,
    client: User,
    data: JobCreate,
):
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