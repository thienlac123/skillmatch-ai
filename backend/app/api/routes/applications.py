from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.application import ApplicationStatus
from app.models.job import Job
from app.models.user import User, UserRole
from app.schemas.application import ApplicationCreate, ApplicationResponse, ApplicationStatusUpdate
from app.services.application_service import (
    create_application,
    get_job_applications,
    get_my_applications,
    update_application_status,
)

router = APIRouter(prefix="/applications", tags=["Applications"])


@router.post("", response_model=ApplicationResponse)
def apply(data: ApplicationCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.FREELANCER:
        raise HTTPException(status_code=403, detail="Only freelancers can apply to jobs")
    try:
        return create_application(db, data.job_id, current_user.id, data)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.get("/me", response_model=list[ApplicationResponse])
def my_applications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.FREELANCER:
        raise HTTPException(status_code=403, detail="Only freelancers can view applications")
    return get_my_applications(db, current_user.id)


@router.get("/jobs/{job_id}", response_model=list[ApplicationResponse])
def job_applications(job_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.CLIENT:
        raise HTTPException(status_code=403, detail="Only clients can review applicants")
    job = db.query(Job).filter(Job.id == job_id, Job.client_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return get_job_applications(db, job_id)


@router.patch("/{application_id}/status", response_model=ApplicationResponse)
def change_status(application_id: UUID, data: ApplicationStatusUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.CLIENT:
        raise HTTPException(status_code=403, detail="Only clients can update applications")
    from app.models.application import Application
    application = db.query(Application).join(Job, Job.id == Application.job_id).filter(
        Application.id == application_id,
        Job.client_id == current_user.id,
    ).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    if data.status == ApplicationStatus.PENDING:
        raise HTTPException(status_code=400, detail="Status can only change to accepted or rejected")
    return update_application_status(db, application, data.status)
