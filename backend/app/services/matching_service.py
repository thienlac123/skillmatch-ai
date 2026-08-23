from app.services.skill_normalizer import normalize_skill


LEVELS = {
    "beginner": 1,
    "junior": 1,
    "intermediate": 2,
    "mid": 2,
    "advanced": 3,
    "senior": 3,
    "expert": 4,
}


def level_score(required_level: str, freelancer_level: str) -> float:
    required = LEVELS.get(str(required_level).lower(), 1)
    freelancer = LEVELS.get(str(freelancer_level).lower(), 1)
    return min(freelancer / required, 1.0)


def calculate_match_score(
    freelancer_skills_data,
    job_skills_data,
):
    # freelancer_skills_data là list các tuple: (FreelancerSkill, skill_name)
    freelancer_skill_map = {
        normalize_skill(skill_name): f_skill
        for f_skill, skill_name in freelancer_skills_data
    }

    total_weight = 0.0
    matched_weight = 0.0

    strengths = []
    gaps = []

    # job_skills_data là list các tuple: (JobSkill, skill_name)
    for j_skill, skill_name in job_skills_data:
        normalized_name = normalize_skill(skill_name)
        importance = j_skill.importance
        total_weight += importance

        freelancer_skill = freelancer_skill_map.get(normalized_name)

        if freelancer_skill:
            freelancer_level = getattr(freelancer_skill, "level", "intermediate")
            quality = level_score(j_skill.required_level, freelancer_level)
            matched_weight += importance * quality
            skill_result = {
                "skill": skill_name,
                "required_level": j_skill.required_level,
                "freelancer_level": freelancer_level,
                "importance": importance,
                "match_quality": round(quality * 100, 2),
            }
            if quality >= 1:
                strengths.append(skill_result)
            else:
                gaps.append({
                    **skill_result,
                    "gap_type": "level_gap",
                })
        else:
            gaps.append({
                "skill": skill_name,
                "required_level": j_skill.required_level,
                "importance": importance,
                "freelancer_level": None,
                "match_quality": 0,
                "gap_type": "missing_skill",
            })

    if total_weight == 0:
        return {
            "score": 0.0,
            "strengths": [],
            "gaps": [],
        }

    score = (matched_weight / total_weight) * 100.0

    return {
        "score": round(score, 2),
        "strengths": strengths,
        "gaps": gaps,
    }