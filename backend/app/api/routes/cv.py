import os
import uuid

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.freelancer_profile import FreelancerProfile
from app.models.user import User, UserRole
from app.services.cv_service import extract_text_from_pdf


router = APIRouter(
    prefix="/freelancers",
    tags=["CV"],
)


UPLOAD_DIR = "uploads/cv"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True,
)


@router.post("/me/cv")
async def upload_cv(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != UserRole.FREELANCER:
        raise HTTPException(
            status_code=403,
            detail="Only freelancers can upload CV",
        )

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported",
        )

    filename = f"{uuid.uuid4()}.pdf"

    file_path = os.path.join(
        UPLOAD_DIR,
        filename,
    )

    content = await file.read()

    with open(file_path, "wb") as output:
        output.write(content)

    extracted_text = extract_text_from_pdf(
        file_path
    )

    profile = (
        db.query(FreelancerProfile)
        .filter(
            FreelancerProfile.user_id
            == current_user.id
        )
        .first()
    )

    if profile is None:
        profile = FreelancerProfile(
            user_id=current_user.id
        )

        db.add(profile)

    profile.cv_text = extracted_text

    db.commit()

    return {
        "message": "CV uploaded successfully",
        "filename": filename,
        "text_length": len(extracted_text),
    }