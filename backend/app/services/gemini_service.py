import json
import logging
import re
from google import genai
from app.core.config import settings
from app.schemas.roadmap_ai import GeneratedRoadmap

logger = logging.getLogger(__name__)

# Khởi tạo Client an toàn
try:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
except Exception as e:
    logger.error(f"Khong the khoi tao Gemini Client: {e}")
    client = None


def generate_match_explanation(
    score: float,
    strengths: list,
    gaps: list,
) -> str:
    prompt = f"""
You are an assistant explaining a freelancer-job match.

Match score:
{score}%

Matched strengths:
{strengths}

Skill gaps:
{gaps}

Provide a concise explanation containing:
1. Overall match
2. Main strengths
3. Main skill gaps
4. Practical recommendation

Important:
- Only use the provided data.
- Do not invent skills.
- Do not change the match score.
"""

    if client:
        try:
            response = client.models.generate_content(
                model="gemini-3.6-flash",
                contents=prompt,
            )
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            logger.warning(f"Goi Gemini API that bai: {e}. Chuyen sang fallback.")

    # Fallback an toàn nếu API gặp sự cố
    matched_names = [
        s.get("skill") if isinstance(s, dict) else str(s) for s in strengths
    ]
    gap_names = [
        g.get("skill") if isinstance(g, dict) else str(g) for g in gaps
    ]

    if score >= 80:
        assessment = "Strong match for this job."
    elif score >= 60:
        assessment = "Promising match with some gaps to address."
    elif score >= 40:
        assessment = "Partial match; targeted upskilling is recommended."
    else:
        assessment = "Low match at this time; review the skill gaps before applying."

    return (
        f"1. Overall match: {assessment} Estimated score: {score}%.\n"
        f"2. Main strengths: Matches well with {', '.join(matched_names) if matched_names else 'none of the listed skills'}.\n"
        f"3. Main skill gaps: {', '.join(gap_names) if gap_names else 'None'}.\n"
        "4. Practical recommendation: Close the listed gaps and make sure the portfolio demonstrates the required work."
    )


def _parse_json_response(raw_text: str) -> dict:
    text = raw_text.strip()
    fenced = re.search(r"```(?:json)?\s*(.*?)```", text, re.DOTALL | re.IGNORECASE)
    if fenced:
        text = fenced.group(1).strip()
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError as error:
        raise ValueError("Gemini returned invalid JSON") from error
    if not isinstance(parsed, dict):
        raise ValueError("Gemini roadmap response must be a JSON object")
    return parsed


def _generate_fallback_roadmap(
    skill_gaps: list[dict],
) -> GeneratedRoadmap:
    items = []

    for gap in skill_gaps:
        skill = str(gap.get("skill", "")).strip()

        if not skill:
            continue

        importance = gap.get("importance", 1)
        required_level = gap.get("required_level")

        if importance >= 4:
            priority = "high"
        elif importance >= 3:
            priority = "medium"
        else:
            priority = "low"

        if gap.get("gap_type") == "missing_skill":
            weeks = 3
            steps = [
                f"Learn the fundamentals of {skill}",
                f"Practice {skill} with hands-on exercises",
                f"Build a small project using {skill}",
            ]
        else:
            weeks = 4
            steps = [
                f"Review {skill} fundamentals",
                f"Practice {skill} at the required {required_level or 'target'} level",
                f"Build a project using {skill}",
            ]

        items.append(
            {
                "skill": skill,
                "priority": priority,
                "weeks": weeks,
                "steps": steps,
            }
        )

    if not items:
        raise ValueError("No valid skill gaps available for fallback roadmap")

    return GeneratedRoadmap(
        goal="Improve the missing skills required for the target job",
        items=items,
    )


def generate_roadmap(
    job_information: dict,
    freelancer_skills: list[dict],
    skill_gaps: list[dict],
) -> GeneratedRoadmap:
    if not skill_gaps:
        raise ValueError("No skill gaps found for roadmap generation")
    allowed_skills = {
        str(gap.get("skill", "")).strip().lower()
        for gap in skill_gaps
        if gap.get("skill")
    }
    prompt = f"""
You generate a learning roadmap for a freelancer.

Job information:
{json.dumps(job_information, ensure_ascii=True)}

Freelancer skills:
{json.dumps(freelancer_skills, ensure_ascii=True)}

Actual skill gaps:
{json.dumps(skill_gaps, ensure_ascii=True)}

Return ONLY valid JSON with this exact shape:
{{
  "goal": "one concrete learning goal",
  "items": [
    {{"skill": "one skill from Actual skill gaps", "priority": "high|medium|low", "weeks": 2, "steps": ["specific step"]}}
  ]
}}

Rules:
- Create items only for skills in Actual skill gaps.
- Do not invent, rename, merge, or add skills.
- Include every actual skill gap exactly once.
- Use 1 to 52 weeks and at least one concrete step per item.
- Base priorities on the supplied importance and required level.
"""
    if client is None:
        logger.warning("Gemini client unavailable. Using fallback roadmap.")
        return _generate_fallback_roadmap(skill_gaps)

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
            config={"response_mime_type": "application/json"},
        )
    except Exception as error:
        logger.warning(
            "Gemini roadmap generation failed. Using fallback roadmap: %s",
            error,
        )
        return _generate_fallback_roadmap(skill_gaps)

    if not response or not response.text:
        logger.warning("Gemini returned an empty roadmap. Using fallback roadmap.")
        return _generate_fallback_roadmap(skill_gaps)

    try:
        roadmap = GeneratedRoadmap.model_validate(_parse_json_response(response.text))
    except (ValueError, TypeError) as error:
        logger.warning("Invalid Gemini roadmap response: %s. Using fallback roadmap.", error)
        return _generate_fallback_roadmap(skill_gaps)

    returned_skills = [item.skill.strip().lower() for item in roadmap.items]
    if set(returned_skills) != allowed_skills or len(returned_skills) != len(set(returned_skills)):
        logger.warning("Gemini roadmap contains skills outside the actual gaps. Using fallback roadmap.")
        return _generate_fallback_roadmap(skill_gaps)

    return roadmap
