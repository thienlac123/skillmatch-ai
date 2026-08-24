import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.match_result import MatchResult
from app.schemas.match import (
    MatchRequest,
    MatchResponse,
)
from app.services.match_service import create_match


router = APIRouter(
    prefix="/matches",
    tags=["Matching"],
)


@router.get(
    "/{match_id}",
    response_model=MatchResponse,
)
def get_match(
    match_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    match_result = db.query(MatchResult).filter(
        MatchResult.id == match_id,
        MatchResult.freelancer_id == current_user.id,
    ).first()

    if match_result is None:
        raise HTTPException(
            status_code=404,
            detail="Match result not found for the current user",
        )

    return match_result


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