from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.auth import router as auth_router
from app.api.routes.cv import router as cv_router
from app.api.routes.freelancers import router as freelancers_router
from app.api.routes.jobs import router as jobs_router
from app.api.routes.matches import router as matches_router
from app.api.routes.roadmaps import router as roadmaps_router
from app.api.routes.applications import router as applications_router
from app.api.routes.conversations import router as conversations_router
from app.api.routes.users import router as users_router

app = FastAPI(
    title="SkillMatch AI API",
    version="1.0.0",
    description="AI-assisted freelancer-job matching platform",
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(freelancers_router)
app.include_router(jobs_router)
app.include_router(cv_router)
app.include_router(matches_router)
app.include_router(roadmaps_router)
app.include_router(applications_router)
app.include_router(conversations_router)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "skillmatch-ai-api",
    }