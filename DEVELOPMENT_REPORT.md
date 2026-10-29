# Báo Cáo Kỹ Thuật & Tổng Kết Quá Trình Phát Triển: JLPT MERN Platform (N5 → N3)

Tài liệu này ghi lại toàn bộ quá trình thiết kế, lập trình và hoàn thiện nền tảng học tiếng Nhật toàn diện 4 kỹ năng (**Reading, Listening, Speaking, Writing**) từ cấp độ **JLPT N5 lên N3** xây dựng trên **MERN Stack** theo tiêu chuẩn kỹ sư phần mềm (**Software Engineer - SWE**).

---

## 1. Tổng Quan Kiến Trúc Hệ Thống (System Architecture)

Dự án được tổ chức theo mô hình **Client-Server Monorepo** chuẩn mực, phân tách rõ ràng giữa Frontend (React/Nginx) và Backend (Node.js/Express) cùng cơ sở dữ liệu MongoDB:

```text
jlpt-mern-platform/
├── docker-compose.yml               # Đóng gói 3 container: MongoDB, Backend, Nginx Client
├── DEVELOPMENT_REPORT.md            # Báo cáo tổng kết toàn bộ dự án
├── README.md                        # Hướng dẫn cài đặt & vận hành hệ thống
│
├── server/                          # BACKEND: Node.js + Express.js + Mongoose
│   ├── Dockerfile                   # Docker image Node 20 Alpine siêu nhẹ
│   ├── src/
│   │   ├── config/                  # db.js (Kết nối linh hoạt MongoDB Atlas / In-Memory), env.js
│   │   ├── models/                  # User, Vocabulary, Kanji, StudyProgress (FSRS)
│   │   ├── controllers/             # authController, srsController, adminController, vocabController...
│   │   ├── middlewares/             # authMiddleware (JWT + RBAC Admin), errorHandler
│   │   ├── routes/                  # /api/v1/{auth, srs, admin, vocab, kanji, dictionary}
│   │   ├── data/openjlpt/           # Bộ ngữ liệu JSON offline đầy đủ N5, N4, N3
│   │   └── scripts/                 # seedOpenJLPT.js, autoSeed.js, createAdmin.js
│   └── package.json
│
└── client/                          # FRONTEND: React (Vite) + Tailwind CSS + Lucide Icons
    ├── Dockerfile                   # Multi-stage build (Vite Builder -> Nginx Production)
    ├── nginx.conf                   # Nginx Reverse Proxy /api/ & SPA Fallback routing
    ├── src/
    │   ├── api/                     # axiosClient.js (Tự động đính kèm JWT Bearer Token)
    │   ├── context/                 # AuthContext (JWT & User state), ThemeContext (Dark Mode)
    │   ├── components/              # Navbar, AuthModal, FuriganaText
    │   ├── features/                # 4 Kỹ Năng & Lớp Học:
    │   │   ├── classroom/           # ClassroomSession (Lớp học 5 giai đoạn thực chiến)
    │   │   ├── writing/             # KanjiStrokePad (Vẽ nét KanjiVG trên Canvas)
    │   │   ├── reading/             # ReadingReader (Furigana Ruby & Popup tra từ Jisho)
    │   │   └── speaking/            # SpeakingStudio (Shadowing Mic & Levenshtein score)
    │   └── pages/                   # Dashboard (Flashcard & Danh sách), KanaChart, KanjiDojo, AdminDashboard
    └── package.json
```

---

## 2. Các Phân Hệ Tính Năng Đã Hoàn Thành

### 2.1. Phân Hệ Dữ Liệu Giáo Trình Toàn Diện (OpenJLPT Full Dataset)
- **Tích hợp nguồn mở OpenJLPT**: Tải về và cấu trúc hóa toàn bộ kho dữ liệu mở phân cấp N5, N4, N3 lưu offline cục bộ tại `server/src/data/openjlpt/`.
- **Quy mô dữ liệu trong MongoDB**:
  - **2.963 Từ vựng**: N5 (674 từ), N4 (630 từ), N3 (1.659 từ).
  - **640 Chữ Hán (Kanji)**: N5 (84 chữ), N4 (169 chữ), N3 (387 chữ).
- **Cấu trúc trường chuẩn mực**: Mỗi từ vựng đều có chữ Hán, Hiragana, Romaji, thẻ `<ruby>` Furigana HTML, loại từ, nghĩa và câu ví dụ song ngữ kèm file âm thanh bản xứ **Tatoeba**.
- **Thanh phân trang (Pagination)**: Xử lý hiển thị 30 thẻ/trang, hỗ trợ tìm kiếm Debounce 300ms trên toàn bộ gần 3.000 từ vựng.

### 2.2. Phân Hệ 4 Kỹ Năng Ngôn Ngữ Thực Chiến
1. **Writing (Luyện viết nét Kanji)**:
   - Tích hợp thư viện **HanziWriter** kết hợp dữ liệu vector nét **KanjiVG** (`hanzi-writer-data-jp`).
   - Chấm điểm số lần viết sai trên Canvas, kiểm tra thứ tự nét theo thời gian thực và hỗ trợ xem mẫu chuyển động nét vẽ.
2. **Reading (Luyện đọc hiểu & Furigana)**:
   - Hiển thị bài đọc tiếng Nhật gắn thẻ `<ruby>` Furigana chuẩn W3C.
   - Hỗ trợ công tắc 1-chạm bật/tắt hiển thị Furigana.
   - Click vào bất kỳ từ nào để mở **Popup Tra cứu Từ điển Jisho** thông qua lớp Express Proxy phía Backend (giải quyết triệt để lỗi chặn CORS của trình duyệt).
3. **Speaking (Luyện phát âm & Shadowing)**:
   - Sử dụng **Web Speech API** (`SpeechRecognition` với ngôn ngữ `ja-JP`).
   - Áp dụng thuật toán **Levenshtein Distance** đo khoảng cách chỉnh sửa chuỗi để tính tỷ lệ phần trăm chính xác (%) giọng đọc của học viên so với câu mẫu.
4. **Kana & Bộ Gõ Tiếng Nhật (IME Engine)**:
   - Bảng chữ cái tương tác Hiragana & Katakana có phát âm Audio Web Speech API.
   - Nhúng thư viện **WanaKana** trực tiếp vào ô nhập liệu: học viên gõ Romaji (VD: `arigatou`) sẽ tự động chuyển thành chữ Hiragana (`ありがとう`) mà không cần cài bàn phím tiếng Nhật trên máy.

### 2.3. Lớp Học 1-1 Tương Tác (Interactive Classroom Mode)
Mô phỏng trải nghiệm học tập 1-1 với giáo viên bản xứ qua 5 giai đoạn sư phạm tuần tự:
- **Giai đoạn 1 (Giảng bài)**: Thầy cô giới thiệu 5 từ vựng mới, phát âm mẫu và giải thích ngữ cảnh sử dụng.
- **Giai đoạn 2 (Luyện nói)**: Học sinh bật micro đọc lại câu (Shadowing) và nhận điểm phát âm ngay tại chỗ.
- **Giai đoạn 3 (Phản xạ trắc nghiệm)**: Bài test 5 câu hỏi 4 đáp án chọn nghĩa đúng của từ vựng, báo đúng/sai lập tức.
- **Giai đoạn 4 (Lên bảng viết chữ Hán)**: Học sinh cầm bút/chuột vẽ chữ Hán trọng tâm của bài trên bảng vẽ Canvas.
- **Giai đoạn 5 (Đánh giá & Lưu FSRS)**: Đánh giá độ thuộc bài theo 4 mức độ: *Chưa nhớ (Ôn sau 10p), Hơi khó (Ôn ngày mai), Nhớ tốt (Ôn sau 3 ngày), Thuộc làu (Ôn sau 7 ngày)*.

### 2.4. Xác Thực JWT & Quản Lý Tiến Độ (FSRS SRS Algorithm)
- **Bảo mật**: Mã hóa mật khẩu người dùng với `bcrypt` (Salt = 10 rounds).
- **Cơ chế Token**: JWT Token thời hạn 7 ngày, lưu trữ tại Client và tự động đính kèm qua Axios Request Interceptor.
- **Chuỗi Streak**: Tự động theo dõi chuỗi ngày học liên tục (`🔥 X ngày`) mỗi khi học viên đăng nhập mỗi ngày.
- **Lưu trữ FSRS**: Dữ liệu ngày ôn tập tiếp theo (`due date`), số lần học (`reps`), số lần quên (`lapses`) được lưu vĩnh viễn vào MongoDB liên kết với `userId`.

### 2.5. Phân Quyền Quản Trị Viên & Admin Control Center (`/admin`)
- **Tài khoản Super Admin**:
  - Email: `admin@jlpt.vn`
  - Mật khẩu: `AdminPassword123!`
  - Quyền hạn: `admin` (Role-based Access Control - RBAC).
- **Tính năng Trang Quản Trị**:
  - Xem thống kê toàn hệ thống: Tổng học viên, Tổng từ vựng, Tổng Kanji, Lượt ôn tập FSRS.
  - Bảng quản lý học viên: Xem danh sách, email, streak và xóa tài khoản rác.
  - Form thêm từ vựng mới: Cho phép Admin bổ sung từ mới, Hiragana, cấp độ JLPT, nghĩa tiếng Việt và câu ví dụ trực tiếp vào MongoDB.

### 2.6. Chế Độ Dark Mode Toàn Diện (Theme Engine)
- Tích hợp `ThemeContext` lưu cấu hình vào `localStorage` và tự động nhận diện thiết lập của hệ điều hành.
- Nút chuyển đổi Mặt trời ☀️ / Mặt trăng 🌙 trên Navbar.
- Toàn bộ 4 kỹ năng, Popup từ điển và đặc biệt là bảng vẽ Canvas Kanji (tự đổi nét vẽ sáng `#f8fafc` và viền xám `#475569`) được tối ưu chống mỏi mắt khi học ban đêm.

### 2.7. Cơ Chế Kết Nối MongoDB Siêu Bền Vững (Resilient Hybrid Connection)
- Tự động ưu tiên kết nối cụm **MongoDB Atlas Cloud**.
- Nếu đường truyền mạng chập chờn hoặc địa chỉ IP chưa được Whitelist trên Atlas, hệ thống sẽ **tự động chuyển đổi mượt mà sang In-Memory MongoDB Server** (`mongodb-memory-server`) mà không bị crash server, đảm bảo trải nghiệm lập trình không gián đoạn.

### 2.8. Đóng Gói Docker & Docker Compose Chuẩn Công Nghiệp
- **`server/Dockerfile`**: Đóng gói Node.js 20 Alpine siêu gọn nhẹ, chứa sẵn toàn bộ dữ liệu OpenJLPT.
- **`client/Dockerfile`**: Multi-stage build (Vite build $\rightarrow$ Nginx Alpine production).
- **`client/nginx.conf`**: Bật nén Gzip, xử lý định tuyến SPA chống lỗi 404, và tự động **Reverse Proxy `/api/` về container Backend**, triệt tiêu hoàn toàn lỗi CORS.
- **`docker-compose.yml`**: Khởi chạy toàn bộ hệ thống gồm 3 container (`jlpt-mongo`, `jlpt-server`, `jlpt-client`) chỉ bằng 1 câu lệnh duy nhất:
  ```bash
  docker compose up --build -d
  ```

---

## 3. Nhật Ký Commits Git Chính

| Mã Commit | Thông điệp Commit (Conventional Commits) | Mô tả ngắn gọn |
| :--- | :--- | :--- |
| `d8fefa1` | `feat: complete Sprint 1 & 2 full-stack foundation` | Khởi tạo cấu trúc MERN, Schema, API từ vựng/Kanji & giao diện React |
| `3452d18` | `fix: auto-seed data on startup and enrich dataset` | Thêm cơ chế tự động nạp dữ liệu khi DB trống |
| `9ca94be` | `feat: implement full dark mode across all pages` | Tích hợp Dark Mode toàn diện với ThemeContext |
| `6953c45` | `feat: import full OpenJLPT dataset with 2963 vocab and 620 kanji` | Nạp 100% dữ liệu OpenJLPT N5-N3 và thanh phân trang |
| `8e588f8` | `feat: implement JWT auth and interactive Classroom Mode` | Hoàn thành xác thực JWT, chuỗi Streak và Lớp học 5 giai đoạn |
| `2a5a4a8` | `feat: complete Super Admin Control Center` | Khởi tạo tài khoản `admin@jlpt.vn`, bảng quản trị `/admin` |
| `7266749` | `feat: add complete Docker containerization` | Thêm Dockerfile, Nginx config và `docker-compose.yml` |
| `ee6fb0d` | `fix(db): add automatic in-memory fallback` | Cơ chế tự động fallback DB khi mất kết nối mạng ngoài |

---

## 4. Hướng Dẫn Vận Hành Nhanh

### 4.1. Chạy trên máy mới có Docker:
```bash
git clone <repo-url> jlpt-mern-platform
cd jlpt-mern-platform
docker compose up --build -d
```
Truy cập: `http://localhost`

### 4.2. Chạy trên máy phát triển (Local Development):
```bash
# Terminal 1: Backend API (port 5000)
cd server
npm run dev

# Terminal 2: Frontend Client (port 5173)
cd client
npm run dev
```
