from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.freelancer_profile import FreelancerProfile
from app.models.freelancer_skill import FreelancerSkill
from app.models.skill import Skill
from app.models.user import User, UserRole
from app.services.skill_normalizer import normalize_skill

db = SessionLocal()

email_b = "freelancer_b@test.com"

# 1. Tìm hoặc tạo User Freelancer B
user_b = db.query(User).filter(User.email == email_b).first()
if not user_b:
    user_b = User(
        email=email_b,
        password_hash=hash_password("Password123!"),
        role=UserRole.FREELANCER,
    )
    db.add(user_b)
    db.commit()
    db.refresh(user_b)

# 2. Đảm bảo FreelancerProfile luôn tồn tại
profile_b = (
    db.query(FreelancerProfile)
    .filter(FreelancerProfile.user_id == user_b.id)
    .first()
)
if not profile_b:
    profile_b = FreelancerProfile(
        user_id=user_b.id,
        full_name="Junior Web Developer",
        bio="HTML, CSS, JS beginner",
    )
    db.add(profile_b)
    db.commit()
    db.refresh(profile_b)

# 3. Gán kỹ năng: HTML, CSS, JavaScript
skills_list = ["HTML", "CSS", "JavaScript"]
for s_name in skills_list:
    sk = db.query(Skill).filter(Skill.name.ilike(s_name)).first()
    if not sk:
        sk = Skill(name=s_name, normalized_name=normalize_skill(s_name))
        db.add(sk)
        db.commit()
        db.refresh(sk)

    f_skill = (
        db.query(FreelancerSkill)
        .filter(
            FreelancerSkill.freelancer_id == user_b.id,
            FreelancerSkill.skill_id == sk.id,
        )
        .first()
    )
    if not f_skill:
        db.add(
            FreelancerSkill(
                freelancer_id=user_b.id,
                skill_id=sk.id,
                level="intermediate",
                years_experience=1,
            )
        )

db.commit()
print(f"✅ Đã tạo Freelancer B thành công: {email_b}")
db.close()

