from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.job import Job
from app.models.user import User, UserRole
from app.schemas.job import (
    JobCreate,
    JobResponse,
    JobUpdate,
)
from app.services.job_service import (
    create_job,
    delete_job,
    get_job,
    get_jobs,
    update_job,
)


router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"],
)


@router.post(
    "",
    response_model=JobResponse,
)
def create(
    data: JobCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != UserRole.CLIENT:
        raise HTTPException(
            status_code=403,
            detail="Only clients can create jobs",
        )

    return create_job(
        db,
        current_user,
        data,
    )


@router.get(
    "",
    response_model=list[JobResponse],
)
def list_jobs(
    db: Session = Depends(get_db),
):
    return get_jobs(db)


@router.get(
    "/{job_id}",
    response_model=JobResponse,
)
def detail(
    job_id: UUID,
    db: Session = Depends(get_db),
):
    job = get_job(db, job_id)

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    return job


@router.put(
    "/{job_id}",
    response_model=JobResponse,
)
def update(
    job_id: UUID,
    data: JobUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    job = get_job(db, job_id)

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    if job.client_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You cannot update this job",
        )

    return update_job(
        db,
        job,
        data,
    )


@router.delete(
    "/{job_id}",
)
def delete(
    job_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    job = get_job(db, job_id)

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    if job.client_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You cannot delete this job",
        )

    delete_job(db, job)

    return {
        "message": "Job deleted successfully",
    }