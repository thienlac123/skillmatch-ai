from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User, UserRole
from app.schemas.match import (
    MatchRequest,
    MatchResponse,
)
from app.services.match_service import create_match


router = APIRouter(
    prefix="/matches",
    tags=["Matching"],
)


@router.post(
    "",
    response_model=MatchResponse,
)
def match(
    data: MatchRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    if current_user.role != UserRole.FREELANCER:
        raise HTTPException(
            status_code=403,
            detail="Only freelancers can request matching",
        )

    try:
        return create_match(
            db=db,
            freelancer_id=current_user.id,
            job_id=data.job_id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        )