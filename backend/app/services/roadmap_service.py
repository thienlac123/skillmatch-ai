from sqlalchemy.orm import Session

from app.models.match_result import MatchResult
from app.models.roadmap import Roadmap


def create_roadmap(
    db: Session,
    freelancer_id,
    job_id,
):
    match = (
        db.query(MatchResult)
        .filter(
            MatchResult.job_id == job_id,
            MatchResult.freelancer_id == freelancer_id,
        )
        .order_by(
            MatchResult.created_at.desc()
        )
        .first()
    )

    if match is None:
        raise ValueError(
            "Match result not found"
        )

    roadmap_items = []

    for gap in match.gaps:

        roadmap_items.append({
            "skill": gap["skill"],
            "priority": (
                "high"
                if gap["importance"] >= 4
                else "medium"
            ),
            "steps": [
                f"Learn {gap['skill']} fundamentals",
                f"Practice {gap['skill']} with exercises",
                f"Build a small project using {gap['skill']}",
            ],
        })

    roadmap = Roadmap(
        freelancer_id=freelancer_id,
        job_id=job_id,
        items=roadmap_items,
    )

    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)

    return roadmap


def get_roadmap(
    db: Session,
    roadmap_id,
):
    return (
        db.query(Roadmap)
        .filter(
            Roadmap.id == roadmap_id
        )
        .first()
    )