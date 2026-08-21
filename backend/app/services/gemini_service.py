import logging
from google import genai
from app.core.config import settings

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

    return (
        f"1. Overall match: The candidate achieves an estimated match score of {score}%.\n"
        f"2. Main strengths: Matches well with requirements for {', '.join(matched_names) if matched_names else 'None'}.\n"
        f"3. Main skill gaps: Missing required skills: {', '.join(gap_names) if gap_names else 'None'}.\n"
        f"4. Practical recommendation: The candidate is a solid match for the core technical stack. Recommend bridging the missing skill gaps."
    )