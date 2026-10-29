# JLPT MERN Platform (N5 → N3)

Nền tảng học tiếng Nhật toàn diện 4 kỹ năng (**Reading, Listening, Speaking, Writing**) từ N5 lên N3 xây dựng trên **MERN Stack** theo chuẩn kiến trúc **Software Engineering (SWE)**.

---

## 🚀 Cách 1: Khởi Chạy Với Docker (Khuyên Dùng Cho Máy Khác)

Hệ thống đã được đóng gói toàn diện với Docker & Docker Compose gồm 3 container độc lập:
1. **`jlpt-mongo`**: Database MongoDB 7.0 (có volume lưu trữ dữ liệu vĩnh viễn).
2. **`jlpt-server`**: Node.js + Express.js API (Tự động nạp 2.963 từ vựng + 620 chữ Hán + Tạo tài khoản Admin ngay lần đầu khởi chạy).
3. **`jlpt-client`**: React (Vite) đóng gói đa tầng với **Nginx**, tự động reverse proxy `/api/` về server chống lỗi CORS.

### Yêu cầu trên máy mới:
- Đã cài đặt **Docker** & **Docker Compose** (hoặc Docker Desktop trên Windows/macOS/Linux).

### Chạy chỉ với 1 câu lệnh duy nhất:
```bash
# Clone hoặc copy thư mục jlpt-mern-platform sang máy mới
cd jlpt-mern-platform

# Khởi chạy toàn bộ hệ thống (MongoDB + Backend + Frontend Nginx)
docker compose up --build -d
```

### Truy cập hệ thống:
- **Ứng dụng Web (Frontend)**: Mở trình duyệt truy cập `http://localhost` (hoặc `http://<ip-máy-chủ>`)
- **Backend API**: `http://localhost:5000/api/v1/health`
- **Tài khoản Super Admin mặc định**:
  - Email: `admin@jlpt.vn`
  - Mật khẩu: `AdminPassword123!`

### Các lệnh Docker hữu ích:
```bash
# Xem log hệ thống
docker compose logs -f

# Dừng hệ thống
docker compose down

# Dừng và xóa sạch volume dữ liệu nếu muốn làm mới hoàn toàn
docker compose down -v
```

---

## 💻 Cách 2: Khởi Chạy Thủ Công Không Dùng Docker (Local Dev)

### Yêu cầu:
- Node.js >= 18
- npm >= 9

### Cài đặt và Chạy:

1. **Cài đặt dependencies**:
   ```bash
   cd jlpt-mern-platform
   cd server && npm install
   cd ../client && npm install
   ```

2. **Chạy server backend**:
   ```bash
   cd server
   npm run dev   # Server sẽ chạy tại http://localhost:5000
   ```
   *(Nếu không cấu hình `MONGODB_URI`, server tự động kích hoạt In-Memory MongoDB để dev ngay lập tức!)*

3. **Chạy client frontend**:
   ```bash
   cd client
   npm run dev   # Vite chạy tại http://localhost:5173
   ```

---

## 📁 Cấu Trúc Hệ Thống (Dockerized MERN Architecture)

```text
jlpt-mern-platform/
├── docker-compose.yml       # Orchestration cho Mongo, Backend và Frontend
├── server/
│   ├── Dockerfile           # Alpine Node.js production image
│   ├── .dockerignore
│   ├── src/
│   │   ├── config/          # db.js, env.js
│   │   ├── controllers/     # authController, srsController, adminController, vocabController
│   │   ├── middlewares/     # authMiddleware (JWT + Role RBAC), errorHandler
│   │   ├── models/          # User, StudyProgress (FSRS), Vocabulary, Kanji
│   │   ├── routes/          # /api/v1/{auth, srs, admin, vocab, kanji, dictionary}
│   │   ├── data/openjlpt/   # Offline JSON corpus (2.963 từ vựng, 620 chữ Hán)
│   │   └── server.js
│   └── package.json
└── client/
    ├── Dockerfile           # Multi-stage build (Node build -> Nginx alpine serving)
    ├── nginx.conf           # Nginx reverse proxy /api/ -> server:5000 + SPA fallback
    ├── .dockerignore
    ├── src/
    │   ├── context/         # AuthContext (JWT), ThemeContext (Dark Mode)
    │   ├── features/        # ClassroomSession (5 phases), KanjiStrokePad, SpeakingStudio, ReadingReader
    │   ├── pages/           # Dashboard, KanaChart, KanjiDojo, AdminDashboard
    │   └── App.jsx
    └── package.json
```
