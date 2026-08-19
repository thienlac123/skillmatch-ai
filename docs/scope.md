# SkillMatch AI — Phạm vi MVP

## 1. Tổng quan sản phẩm

SkillMatch AI là nền tảng kết nối freelancer và công việc có sự hỗ trợ của AI, giúp freelancer tìm kiếm các công việc phù hợp dựa trên kỹ năng, kinh nghiệm và CV của họ.

Hệ thống phân tích hồ sơ freelancer và bản mô tả công việc, tính toán Điểm phù hợp (Match Score) minh bạch bằng thuật toán so khớp theo trọng số, giải thích kết quả so khớp bằng Gemini AI, xác định các lỗ hổng kỹ năng và tạo lộ trình phát triển cá nhân hóa.

## 2. Vai trò người dùng

### Freelancer

* Đăng ký và đăng nhập
* Tạo và cập nhật hồ sơ
* Quản lý kỹ năng và kinh nghiệm
* Tải lên CV định dạng PDF
* Xem các công việc hiện có
* Yêu cầu phân tích độ phù hợp
* Xem Điểm phù hợp (Match Score)
* Xem điểm mạnh và lỗ hổng kỹ năng
* Tạo và xem lộ trình phát triển

### Client

* Đăng ký và đăng nhập
* Tạo công việc
* Cung cấp bản mô tả công việc
* Xem các công việc đã tạo
* Sử dụng AI để phân tích yêu cầu công việc

## 3. Tính năng MVP

### Xác thực

* Xác thực bằng JWT
* Đăng ký
* Đăng nhập
* Phân quyền truy cập theo vai trò

### Hồ sơ Freelancer

* Thông tin cá nhân
* Giới thiệu bản thân
* Kinh nghiệm
* Kỹ năng
* Tải lên CV

### Phân tích CV

* Tải lên CV dạng PDF
* Trích xuất văn bản từ PDF
* Phân tích CV bằng Gemini
* Chuẩn hóa kỹ năng và kinh nghiệm
* Lưu trữ thông tin hồ sơ có cấu trúc

### Quản lý công việc

* Tạo công việc
* Xem danh sách công việc
* Xem chi tiết công việc
* Lưu trữ các yêu cầu công việc

### Phân tích công việc

* Phân tích mô tả công việc bằng Gemini
* Trích xuất các kỹ năng bắt buộc
* Xác định mức độ quan trọng của kỹ năng
* Xác định cấp độ kỹ năng yêu cầu
* Chuẩn hóa các yêu cầu

### So khớp (Matching)

* So sánh kỹ năng của freelancer với yêu cầu công việc
* Tính toán Điểm phù hợp (Match Score) theo trọng số
* Xác định điểm mạnh
* Xác định lỗ hổng kỹ năng
* Tạo giải thích bằng AI

### Lộ trình (Roadmap)

* Tạo lộ trình phát triển dựa trên các lỗ hổng kỹ năng
* Xác định mục tiêu học tập
* Ưu tiên các kỹ năng còn thiếu
* Sắp xếp lộ trình theo từng tuần

## 4. Trách nhiệm của AI

Gemini AI chịu trách nhiệm cho:

* Trích xuất thông tin
* Chuẩn hóa dữ liệu
* Phân tích công việc
* Phân tích hồ sơ
* Giải thích độ phù hợp
* Giải thích lỗ hổng kỹ năng
* Tạo lộ trình phát triển

Engine so khớp ở backend chịu trách nhiệm tính toán Điểm phù hợp (Match Score).

## 5. Nằm ngoài phạm vi MVP

Các tính năng sau chưa cần thiết cho bản MVP:

* Nhắn tin theo thời gian thực (Real-time chat)
* Hệ thống thanh toán
* Quản lý hợp đồng freelancer
* Quy trình ứng tuyển công việc
* Hệ thống thông báo
* Bảng điều khiển dành cho Admin
* Hệ thống gợi ý nâng cao
* Hạ tầng quy mô Production

## 6. Tiêu chí đánh giá thành công của MVP

Bản MVP cần thể hiện được một luồng hoàn chỉnh từ đầu đến cuối:

Freelancer đăng ký → tạo hồ sơ → tải lên CV → AI phân tích hồ sơ → Client tạo công việc → AI phân tích công việc → Freelancer yêu cầu so khớp → hệ thống tính toán Match Score → hệ thống hiển thị điểm mạnh và lỗ hổng kỹ năng → Gemini tạo giải thích → Gemini tạo lộ trình.