from app.services.skill_normalizer import normalize_skill


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
            matched_weight += importance
            strengths.append({
                "skill": skill_name,
                "required_level": j_skill.required_level,
                "freelancer_level": getattr(freelancer_skill, "level", "intermediate"),
            })
        else:
            gaps.append({
                "skill": skill_name,
                "required_level": j_skill.required_level,
                "importance": importance,
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