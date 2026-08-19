# SkillMatch AI — Database Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    users ||--o| freelancer_profiles : "has"
    users ||--o{ jobs : "creates"
    
    freelancer_profiles ||--o{ freelancer_skills : "has"
    skills ||--o{ freelancer_skills : "belongs to"
    
    jobs ||--o{ job_skills : "requires"
    skills ||--o{ job_skills : "belongs to"
    
    freelancer_profiles ||--o{ match_results : "participates"
    jobs ||--o{ match_results : "evaluated in"
    
    match_results ||--o| roadmaps : "generates"

    users {
        uuid id PK
        string email
        string hashed_password
        string role
        datetime created_at
    }

    freelancer_profiles {
        uuid id PK
        uuid user_id FK
        string full_name
        string bio
        int experience_years
        string cv_url
        datetime created_at
    }

    skills {
        uuid id PK
        string name
        string category
    }

    freelancer_skills {
        uuid id PK
        uuid profile_id FK
        uuid skill_id FK
        string proficiency_level
        int years_of_experience
    }

    jobs {
        uuid id PK
        uuid client_id FK
        string title
        string description
        string status
        datetime created_at
    }

    job_skills {
        uuid id PK
        uuid job_id FK
        uuid skill_id FK
        int importance_weight
        string required_level
    }

    match_results {
        uuid id PK
        uuid profile_id FK
        uuid job_id FK
        float match_score
        string strengths_json
        string skill_gaps_json
        string ai_explanation
        datetime created_at
    }

    roadmaps {
        uuid id PK
        uuid match_result_id FK
        string title
        int duration_weeks
        string milestones_json
        datetime created_at
    }