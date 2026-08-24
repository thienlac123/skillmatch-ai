from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User, UserRole
from app.schemas.roadmap import (
    RoadmapRequest,
    RoadmapResponse,
)
from app.services.roadmap_service import (
    create_roadmap,
    get_roadmap,
    get_roadmaps_for_freelancer,
)


router = APIRouter(
    prefix="/roadmaps",
    tags=["Roadmaps"],
)


@router.get(
    "",
    response_model=list[RoadmapResponse],
)
def list_roadmaps(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != UserRole.FREELANCER:
        raise HTTPException(
            status_code=403,
            detail="Only freelancers can view roadmaps",
        )

    return get_roadmaps_for_freelancer(db, current_user.id)


@router.post(
    "",
    response_model=RoadmapResponse,
)
def create(
    data: RoadmapRequest,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    if current_user.role != UserRole.FREELANCER:
        raise HTTPException(
            status_code=403,
            detail="Only freelancers can create roadmaps",
        )

    try:
        return create_roadmap(
            db=db,
            freelancer_id=current_user.id,
            job_id=data.job_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=422,
            detail=str(error),
        )
    except RuntimeError as error:
        raise HTTPException(status_code=503, detail=str(error))


@router.get(
    "/{roadmap_id}",
    response_model=RoadmapResponse,
)
def detail(
    roadmap_id: UUID,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    roadmap = get_roadmap(
        db,
        roadmap_id,
    )

    if roadmap is None:
        raise HTTPException(
            status_code=404,
            detail="Roadmap not found",
        )

    if roadmap.freelancer_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You cannot access this roadmap",
        )

    return roadmap