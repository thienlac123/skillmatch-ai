# SkillMatch AI — Tổng quan kiến trúc (Architecture Overview)

## 1. Kiến trúc tổng thể (Architecture)
SkillMatch AI tuân theo mô hình kiến trúc phân lớp (Layered Architecture), tách biệt rõ ràng giữa Frontend, Backend API, Logic nghiệp vụ (Business Logic), Truy xuất dữ liệu (Data Access), Dịch vụ AI (AI Services) và Cơ sở dữ liệu (Database).

┌───────────────────────────────┐
│          React Frontend       │
│ JavaScript + Vite + Tailwind  │
└───────────────┬───────────────┘
                │ REST API
                ↓
┌───────────────────────────────┐
│         FastAPI Backend       │
├───────────────────────────────┤
│ Tầng API (API Layer)          │
│ Tầng dịch vụ (Service Layer)  │
│ Tầng truy xuất (Repository)   │
│ Tầng tích hợp AI (AI Layer)   │
└───────────────┬───────────────┘
                │
        ┌───────┴────────┐
        ↓                ↓
┌───────────────┐  ┌───────────────┐
│  PostgreSQL   │  │  Gemini API   │
│ Cơ sở dữ liệu │  │   Dịch vụ AI  │
└───────────────┘  └───────────────┘

---

## 2. Frontend
Phần Frontend được xây dựng bằng React và JavaScript.

**Trách nhiệm chính:**
* Giao diện người dùng (User interface).
* Các màn hình xác thực và phân quyền (Authentication screens).
* Quản lý hồ sơ Freelancer (Freelancer profile).
* Danh sách công việc (Job listing).
* Chi tiết công việc (Job detail).
* Hiển thị kết quả đối soát độ phù hợp (Match result).
* Hiển thị lộ trình học tập và phát triển (Roadmap).
* Xử lý và hiển thị các trạng thái: Đang tải (Loading), Lỗi (Error) và Dữ liệu trống (Empty states).

---

## 3. Backend
Phần Backend sử dụng framework FastAPI.

**Trách nhiệm chính:**
* Cung cấp các chuẩn REST API.
* Xác thực và phân quyền người dùng (Authentication & Authorization).
* Quản lý hồ sơ Freelancer (Profile management).
* Quản lý danh sách và thông tin công việc (Job management).
* Xử lý và trích xuất dữ liệu từ CV (CV processing).
* Công cụ đối soát độ phù hợp (Matching engine).
* Tích hợp và giao tiếp với AI (AI integration).
* Tự động khởi tạo lộ trình học tập (Roadmap generation).

---

## 4. Cơ sở dữ liệu (Database)
PostgreSQL dùng để lưu trữ:
* Người dùng (Users).
* Hồ sơ Freelancer (Freelancer profiles).
* Từ điển kỹ năng chuẩn hóa (Skills).
* Kỹ năng của Freelancer (Freelancer skills).
* Tin tuyển dụng/Công việc (Jobs).
* Kỹ năng yêu cầu của công việc (Job skills).
* Kết quả đối soát độ phù hợp (Match results).
* Lộ trình phát triển kỹ năng (Roadmaps).

---

## 5. Kiến trúc xử lý AI (AI Architecture)
AI không chịu trách nhiệm tính toán Điểm phù hợp (Match Score) cuối cùng. Hệ thống tách biệt hoàn toàn giữa việc đối soát tất định (Deterministic matching) và Trí tuệ nhân tạo tạo sinh (Generative AI):

```text
Hồ sơ Freelancer (Profile)
            +
Công việc (Job)
            ↓
Công cụ so khớp Backend (Backend Matching Engine)
            ↓
Điểm phù hợp tính theo trọng số (Weighted Match Score)
            ↓
Điểm mạnh / Lỗ hổng kỹ năng (Strengths / Skill Gaps)
            ↓
Gemini AI
            ↓
Giải thích chi tiết / Lộ trình phát triển (Explanation / Roadmap)
6. Kiểm định đầu ra AI (AI Validation)
Mọi phản hồi từ AI bắt buộc phải được kiểm định (validate) theo đúng cấu trúc schema mong đợi trước khi lưu vào cơ sở dữ liệu hoặc trả về qua API.

Backend cần xử lý tốt các tình huống:

Dữ liệu JSON không hợp lệ (Invalid JSON).

Thiếu các trường thông tin bắt buộc (Missing fields).

Lỗi phát sinh từ API (API errors).

Quá thời gian phản hồi (Timeout).

Kết quả đầu ra từ AI không đúng như mong đợi (Unexpected AI output).

7. Triển khai (Deployment)
Môi trường phát triển cục bộ sử dụng Docker Compose cùng với PostgreSQL. Ứng dụng được thiết kế theo hướng module hóa để các dịch vụ Frontend, Backend và Database có thể chạy độc lập và tích hợp linh hoạt thông qua các chuẩn giao tiếp REST API.