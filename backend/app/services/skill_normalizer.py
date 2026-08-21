import re

# Từ điển chuẩn hóa bao quát các mảng công nghệ chính
SKILL_ALIASES = {
    # --- Frontend & Frameworks ---
    "reactjs": "react",
    "react.js": "react",
    "vuejs": "vue",
    "vue.js": "vue",
    "angularjs": "angular",
    "angular.js": "angular",
    "nextjs": "next.js",
    "next": "next.js",
    "nuxtjs": "nuxt.js",
    "nuxt": "nuxt.js",
    "sveltejs": "svelte",
    "tailwind": "tailwind css",
    "tailwindcss": "tailwind css",
    "bootstrap5": "bootstrap",
    "html": "html5",
    "css": "css3",

    # --- Languages ---
    "js": "javascript",
    "ts": "typescript",
    "py": "python",
    "golang": "go",
    "c#": "csharp",
    "c sharp": "csharp",
    "c++": "cpp",
    "c plus plus": "cpp",

    # --- Backend & Frameworks ---
    "node": "node.js",
    "nodejs": "node.js",
    "express": "express.js",
    "expressjs": "express.js",
    "nest": "nest.js",
    "nestjs": "nest.js",
    "fastapi": "fastapi",
    "fast api": "fastapi",
    "django rest framework": "drf",
    "springboot": "spring boot",
    "spring": "spring boot",
    "dotnet": "asp.net core",
    ".net": "asp.net core",
    ".net core": "asp.net core",
    "asp.net": "asp.net core",
    "aspnet": "asp.net core",
    "aspnet core": "asp.net core",
    "laravel php": "laravel",

    # --- Databases & Caching ---
    "postgres": "postgresql",
    "postgres sql": "postgresql",
    "psql": "postgresql",
    "mysql server": "mysql",
    "mssql": "sql server",
    "microsoft sql server": "sql server",
    "mongo": "mongodb",
    "redis cache": "redis",
    "elastic": "elasticsearch",

    # --- Mobile ---
    "react native": "react-native",
    "reactnative": "react-native",
    "flutter app": "flutter",

    # --- DevOps & Cloud ---
    "k8s": "kubernetes",
    "amazon web services": "aws",
    "google cloud": "gcp",
    "google cloud platform": "gcp",
    "azure cloud": "azure",
    "docker container": "docker",
    "ci/cd": "cicd",
    "ci cd": "cicd",

    # --- AI & Data ---
    "gemini api": "gemini",
    "google gemini": "gemini",
    "chatgpt": "openai",
    "gpt-4": "openai",
    "machine learning": "ml",
    "deep learning": "dl",
    "pytorch framework": "pytorch",
    "tf": "tensorflow",
}


def normalize_skill(skill: str) -> str:
    if not skill:
        return ""

    # 1. Chuyển về chữ thường và xóa khoảng trắng đầu/cuối
    value = skill.strip().lower()

    # 2. Xóa các ký tự đặc biệt thừa thãi (giữ lại +, #, ., -)
    value = re.sub(r"[^\w\s\+\#\.\-]", "", value)

    # 3. Chuẩn hóa khoảng trắng kép
    value = re.sub(r"\s+", " ", value)

    # 4. Tra từ điển Alias
    if value in SKILL_ALIASES:
        return SKILL_ALIASES[value]

    # 5. Quy tắc động (Dynamic fallback): Bỏ đuôi 'js' hoặc '.js' ở cuối từ
    dynamic_cleaned = re.sub(r"(\.js|js)$", "", value).strip()
    if dynamic_cleaned in SKILL_ALIASES:
        return SKILL_ALIASES[dynamic_cleaned]

    return value