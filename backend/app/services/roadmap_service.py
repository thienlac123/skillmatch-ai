from sqlalchemy.orm import Session

from app.models.match_result import MatchResult
from app.models.roadmap import Roadmap
from app.models.freelancer_skill import FreelancerSkill
from app.models.job import Job
from app.models.skill import Skill
from app.services.gemini_service import generate_roadmap


def generate_fallback_roadmap(skill_gaps):
    items = []

    for gap in skill_gaps or []:
        skill = gap.get("skill")

        if not skill:
            continue

        importance = gap.get("importance", 3)
        required_level = gap.get(
            "required_level",
            "intermediate",
        )

        if importance >= 5:
            priority = "high"
        elif importance >= 3:
            priority = "medium"
        else:
            priority = "low"

        if required_level == "advanced":
            weeks = 4
        elif required_level == "intermediate":
            weeks = 3
        else:
            weeks = 2

        items.append(
            {
                "skill": skill,
                "priority": priority,
                "weeks": weeks,
                "steps": [
                    f"Learn the fundamentals of {skill}",
                    f"Practice {skill} with hands-on exercises",
                    f"Build a small project using {skill}",
                ],
            }
        )

    return {
        "goal": (
            "Improve the missing skills required "
            "for the target job"
        ),
        "items": items,
    }


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

    job = (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )

    if job is None:
        raise ValueError("Job not found")

    existing_roadmap = (
        db.query(Roadmap)
        .filter(
            Roadmap.freelancer_id == freelancer_id,
            Roadmap.job_id == job_id,
        )
        .order_by(Roadmap.created_at.desc())
        .first()
    )

    if existing_roadmap is not None:
        return existing_roadmap

    freelancer_skills = (
        db.query(
            FreelancerSkill,
            Skill.name,
        )
        .join(
            Skill,
            Skill.id == FreelancerSkill.skill_id,
        )
        .filter(
            FreelancerSkill.freelancer_id
            == freelancer_id
        )
        .all()
    )

    try:
        roadmap = generate_roadmap(
            job_information={
                "title": job.title,
                "description": job.description,
                "required_skills": job.required_skills,
            },
            freelancer_skills=[
                {
                    "skill": name,
                    "level": skill.level,
                    "years_experience": skill.years_experience,
                }
                for skill, name in freelancer_skills
            ],
            skill_gaps=match.gaps,
        )

        roadmap_goal = roadmap.goal

        roadmap_items = [
            item.model_dump()
            for item in roadmap.items
        ]

    except Exception as exc:
        print(
            f"Gemini roadmap generation failed: {exc}"
        )

        fallback = generate_fallback_roadmap(
            match.gaps
        )

        roadmap_goal = fallback["goal"]
        roadmap_items = fallback["items"]

    roadmap = Roadmap(
        freelancer_id=freelancer_id,
        job_id=job_id,
        goal=roadmap_goal,
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


def get_roadmaps_for_freelancer(
    db: Session,
    freelancer_id,
):
    return (
        db.query(Roadmap)
        .filter(
            Roadmap.freelancer_id
            == freelancer_id
        )
        .order_by(
            Roadmap.created_at.desc()
        )
        .all()
    )