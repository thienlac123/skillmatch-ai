import uuid

from sqlalchemy.orm import Session

from app.models.application import Application, ApplicationStatus
from app.models.freelancer_skill import FreelancerSkill
from app.models.job import Job
from app.models.job_skill import JobSkill
from app.models.skill import Skill
from app.models.user import User
from app.services.matching_service import calculate_match_score


def calculate_application_score(db: Session, job_id: uuid.UUID, freelancer_id: uuid.UUID) -> float:
    freelancer_skills = (
        db.query(FreelancerSkill, Skill.name)
        .join(Skill, Skill.id == FreelancerSkill.skill_id)
        .filter(FreelancerSkill.freelancer_id == freelancer_id)
        .all()
    )
    job_skills = (
        db.query(JobSkill, Skill.name)
        .join(Skill, Skill.id == JobSkill.skill_id)
        .filter(JobSkill.job_id == job_id)
        .all()
    )
    return calculate_match_score(freelancer_skills, job_skills)["score"]


def create_application(db: Session, job_id, freelancer_id, data):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise ValueError("Job not found")

    existing = db.query(Application).filter(
        Application.job_id == job_id,
        Application.freelancer_id == freelancer_id,
    ).first()
    if existing:
        if existing.status != ApplicationStatus.REJECTED:
            raise ValueError("You already have an active application for this job")
        existing.cover_letter = data.cover_letter.strip()
        existing.proposed_budget = data.proposed_budget
        existing.delivery_days = data.delivery_days
        existing.match_score = calculate_application_score(db, job_id, freelancer_id)
        existing.status = ApplicationStatus.PENDING
        db.commit()
        db.refresh(existing)
        return existing

    application = Application(
        job_id=job_id,
        freelancer_id=freelancer_id,
        cover_letter=data.cover_letter.strip(),
        proposed_budget=data.proposed_budget,
        delivery_days=data.delivery_days,
        match_score=calculate_application_score(db, job_id, freelancer_id),
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


def get_my_applications(db: Session, freelancer_id):
    return db.query(Application).filter(
        Application.freelancer_id == freelancer_id,
    ).order_by(Application.created_at.desc()).all()


def get_job_applications(db: Session, job_id):
    applications = db.query(Application).filter(
        Application.job_id == job_id,
    ).order_by(Application.match_score.desc(), Application.created_at.asc()).all()
    for application in applications:
        freelancer = db.query(User).filter(User.id == application.freelancer_id).first()
        application.freelancer_name = freelancer.email if freelancer else None
        application.freelancer_email = freelancer.email if freelancer else None
    return applications


def update_application_status(db: Session, application, status):
    application.status = status
    db.commit()
    db.refresh(application)
    return application
