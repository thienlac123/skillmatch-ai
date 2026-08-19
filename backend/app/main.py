from fastapi import FastAPI

app = FastAPI(
    title="SkillMatch AI API",
    version="1.0.0",
    description="AI-assisted freelancer-job matching platform",
)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "skillmatch-ai-api"
    }