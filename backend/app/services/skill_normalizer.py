import re

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
    "bootstrap 5": "bootstrap",
    "html": "html5",
    "css": "css3",
    "sass": "scss",
    "redux toolkit": "redux",
    "rtk": "redux",
    "zustand state": "zustand",
    "socket.io": "socket.io",
    "socketio": "socket.io",
    "websockets": "websocket",
    "ws": "websocket",

    # --- Languages ---
    "js": "javascript",
    "ts": "typescript",
    "py": "python",
    "golang": "go",
    "c#": "csharp",
    "c sharp": "csharp",
    "c++": "cpp",
    "c plus plus": "cpp",
    "dart lang": "dart",
    "solidity lang": "solidity",

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

    # --- Databases, Caching & ORM ---
    "postgres": "postgresql",
    "postgres sql": "postgresql",
    "psql": "postgresql",
    "mysql server": "mysql",
    "mssql": "sql server",
    "microsoft sql server": "sql server",
    "mongo": "mongodb",
    "redis cache": "redis",
    "elastic": "elasticsearch",
    "prisma orm": "prisma",
    "entity framework": "ef core",
    "entity framework core": "ef core",
    "ef": "ef core",
    "mongoose js": "mongoose",

    # --- Mobile ---
    "react native": "react-native",
    "reactnative": "react-native",
    "flutter app": "flutter",

    # --- DevOps, Cloud & Tools ---
    "k8s": "kubernetes",
    "amazon web services": "aws",
    "google cloud": "gcp",
    "google cloud platform": "gcp",
    "azure cloud": "azure",
    "docker container": "docker",
    "ci/cd": "cicd",
    "ci cd": "cicd",
    "github actions": "cicd",
    "git version control": "git",
    "github": "git",
    "gitlab": "git",
    "kafka": "apache kafka",
    "rabbitmq": "rabbit-mq",

    # --- Web3 & Blockchain ---
    "web3.js": "web3",
    "web3js": "web3",
    "ethers.js": "ethers",
    "ethersjs": "ethers",
    "hardhat dev": "hardhat",
    "smart contract": "solidity",
    "smart contracts": "solidity",

    # --- AI, LLM & Data ---
    "gemini api": "gemini",
    "google gemini": "gemini",
    "chatgpt": "openai",
    "gpt-4": "openai",
    "gpt4": "openai",
    "machine learning": "ml",
    "deep learning": "dl",
    "pytorch framework": "pytorch",
    "tf": "tensorflow",
    "rag system": "rag",
    "langchain framework": "langchain",

    # --- Architecture, API & Testing ---
    "rest": "rest api",
    "restful": "rest api",
    "restful api": "rest api",
    "graphql api": "graphql",
    "unit test": "testing",
    "jest test": "jest",
    "cypress test": "cypress"
}


def normalize_skill(skill: str) -> str:
    if not skill:
        return ""

    # 1. Chuyển về chữ thường và xóa khoảng trắng đầu/cuối
    value = skill.strip().lower()

    # 2. Xóa các ký tự thừa thãi (giữ lại +, #, ., - và ký tự chữ/số)
    value = re.sub(r"[^\w\s\+\#\.\-]", "", value)

    # 3. Chuẩn hóa khoảng trắng kép thành khoảng trắng đơn
    value = re.sub(r"\s+", " ", value).strip()

    # 4. Tra trực tiếp từ điển Alias
    if value in SKILL_ALIASES:
        return SKILL_ALIASES[value]

    # 5. Quy tắc động (Fallback): Cắt bỏ hậu tố 'js' / '.js' nếu không phải ngoại lệ (như nestjs -> nest.js)
    dynamic_cleaned = re.sub(r"(\.js|js)$", "", value).strip()
    if dynamic_cleaned in SKILL_ALIASES:
        return SKILL_ALIASES[dynamic_cleaned]

    return value