# SkillMatch AI

Nền tảng ứng dụng Trí tuệ Nhân tạo (AI) hỗ trợ kết nối và đối soát độ phù hợp giữa Freelancer và Công việc dựa trên kỹ năng, kinh nghiệm và yêu cầu thực tế.

---

## 📌 Tổng quan dự án (Overview)

**SkillMatch AI** hỗ trợ Freelancer tìm kiếm cơ hội việc làm phù hợp nhất thông qua việc phân tích chuyên sâu hồ sơ cá nhân/CV và bản mô tả công việc (Job Description).

Hệ thống tận dụng **Google Gemini API** cho các tác vụ:
* Trích xuất và chuẩn hóa kỹ năng từ CV và Job.
* Giải thích chi tiết lý do phù hợp / không phù hợp.
* Phân tích lỗ hổng kỹ năng (Skill Gaps).
* Tự động sinh lộ trình học tập, nâng cao trình độ cá nhân hóa (Roadmap).

> **Lưu ý kỹ thuật:** Điểm phù hợp (**Match Score**) được tính toán bởi **Weighted Matching Engine** độc lập ở Backend dựa trên thuật toán trọng số, đảm bảo tính khách quan và nhất quán thay vì để LLM chấm điểm tùy biến.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

### **Frontend**
* **Ngôn ngữ & Nền tảng:** JavaScript (ES6+), React.js, Vite
* **Giao diện & Tiện ích:** Tailwind CSS, Lucide React / Icons
* **Quản lý Routing & State:** React Router, TanStack Query (React Query)
* **Giao tiếp API:** Axios

### **Backend**
* **Framework:** Python, FastAPI
* **Data Validation & ORM:** Pydantic, SQLAlchemy, Alembic
* **Bảo mật:** JWT Authentication, Passlib (Bcrypt)

### **Cơ sở dữ liệu & Hạ tầng**
* **Database:** PostgreSQL 16
* **Containerization:** Docker, Docker Compose

### **Trí tuệ Nhân tạo (AI)**
* **LLM:** Google Gemini API (Phân tích hồ sơ, đánh giá skill gap, sinh roadmap)

### **Quản lý mã nguồn**
* **Hệ thống:** Git, GitHub
* **Quy chuẩn nhánh:** Git Flow (`main`, `develop`, `feature/*`)

---

## 📂 Cấu trúc thư mục (Project Structure)

```text
skillmatch-ai/
├── frontend/           # Ứng dụng React + Vite
├── backend/            # Mã nguồn FastAPI, Services, AI Agent & API
│   ├── app/
│   │   ├── ai/         # Gemini Client & Prompt Templates
│   │   ├── api/        # API Routers / Endpoints
│   │   ├── core/       # Cấu hình & Database Engine
│   │   ├── models/     # SQLAlchemy Database Models
│   │   ├── schemas/    # Pydantic Schemas (DTOs)
│   │   └── services/   # Business Logic & Matching Engine
├── docs/               # Tài liệu thiết kế hệ thống, ERD Diagram
├── sample-data/        # Dữ liệu mẫu (CV mẫu, JD mẫu)
├── docker-compose.yml  # Khởi chạy PostgreSQL Container
├── .env.example        # Biến môi trường mẫu
└── README.md           # Tài liệu hướng dẫn dự án

🔄 Luồng hoạt động MVP (MVP Flow)

Freelancer
    │
    ▼
Hồ sơ / CV (File / Text)
    │
    ▼
AI Phân tích Hồ sơ (Gemini API)
    │
    ▼
Chuẩn hóa Kỹ năng ───────┐
                         ▼
Job Description ──► AI Phân tích Job ──► Thuật toán so khớp có trọng số (Weighted Engine)
                                                  │
                                                  ▼
                                            Match Score (%)
                                                  │
                                                  ▼
                                      Điểm mạnh & Lỗ hổng kỹ năng (Skill Gaps)
                                                  │
                                                  ▼
                                      AI Giải thích chi tiết kết quả
                                                  │
                                                  ▼
                                      Lộ trình cải thiện kỹ năng (Roadmap)