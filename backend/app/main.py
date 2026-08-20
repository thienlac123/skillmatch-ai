from fastapi import FastAPI

from app.api.routes.auth import router as auth_router
from app.api.routes.users import router as users_router
from app.api.routes.freelancers import router as freelancers_router


app = FastAPI(
    title="SkillMatch AI API",
    version="1.0.0",
    description="AI-assisted freelancer-job matching platform",
)


app.include_router(auth_router)
app.include_router(users_router)
app.include_router(freelancers_router)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "skillmatch-ai-api",
    }