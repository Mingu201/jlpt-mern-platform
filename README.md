<div align="center">

# 🌸 JLPT Master Platform (N5 → N3)
### Nền Tảng Học Tiếng Nhật Toàn Diện 4 Kỹ Năng Chuẩn Kỹ Sư Phần Mềm (SWE)

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/Node.js-20_Alpine-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js 20" />
  <img src="https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/FSRS-v4.5-FF6F00?style=for-the-badge&logo=sparkfun&logoColor=white" alt="FSRS Algorithm" />
</p>

<p align="center">
  <b>Classroom 1-1 • Flashcard FSRS • Canvas KanjiVG • Web Speech ja-JP • WanaKana IME • Dark Mode</b>
</p>

---

</div>

## 📌 Giới Thiệu Dự Án

**JLPT Master Platform** là giải pháp phần mềm toàn diện hỗ trợ người học tiếng Nhật từ trình độ sơ cấp (**N5**) lên trung cấp (**N3**). Hệ thống được kiến trúc theo chuẩn mực công nghiệp **Client-Server Monorepo**, đóng gói đa tầng với Docker, tích hợp thuật toán ghi nhớ ngắt quãng tối tân **FSRS (Free Spaced Repetition Scheduler)** và bộ dữ liệu mở đồ sộ **OpenJLPT**.

---

## 🌟 Các Phân Hệ & Tính Năng Nổi Bật

### 1. 🎓 Lớp Học 1-1 Tương Tác (Interactive Classroom Session)
Mô phỏng lớp học thực chiến với giáo viên bản xứ qua 5 giai đoạn sư phạm tuần tự:
- **Giai đoạn 1 (Giảng bài)**: Giới thiệu 5 từ vựng trọng tâm, phát âm mẫu bản xứ và phân tích ngữ cảnh.
- **Giai đoạn 2 (Luyện nói - Shadowing)**: Bật micro nhận diện giọng nói `ja-JP` và chấm điểm phát âm tức thì.
- **Giai đoạn 3 (Phản xạ trắc nghiệm)**: Bài test 5 câu hỏi nhanh chọn nghĩa đúng, báo kết quả tức thời.
- **Giai đoạn 4 (Lên bảng viết chữ Hán)**: Cầm chuột/bút vẽ Kanji nét chuẩn trên Canvas chấm điểm thứ tự nét.
- **Giai đoạn 5 (Đánh giá FSRS)**: Lưu tiến độ ghi nhớ vào MongoDB (*Again, Hard, Good, Easy*).

---

### 2. ⚡ Võ Đài Ngữ Pháp JLPT (Grammar Mastery Engine)
- **483 Cấu trúc ngữ pháp mở rộng**: Đầy đủ 100% ngữ pháp N5 (134), N4 (139), N3 (210) lưu trữ offline tại `server/src/data/openjlpt/grammar.json`.
- **Cẩm nang tra cứu**: Công thức kết hợp (Structure), giải thích ngữ cảnh, lưu ý dùng từ (Caution) và ví dụ song ngữ có nút loa phát âm.
- **Luyện chia 8 thể động từ**: Rèn luyện *Thể Te, Thể Ta, Thể Phủ định Nai, Thể Khả năng, Thể Bị động, Thể Sai khiến, Thể Ý chí, Thể Điều kiện Ba*. Tích hợp bàn phím **WanaKana IME** tự động gõ Romaji chuyển Hiragana trực tiếp!
- **Đố vui phản xạ**: Bộ đề trắc nghiệm ngẫu nhiên điền trợ từ và cấu trúc câu có giải thích chi tiết.

---

### 3. ✍️ Phòng Luyện Viết Chữ Hán (Kanji Dojo)
- Tích hợp **HanziWriter** kết hợp dữ liệu vector nét **KanjiVG** (`hanzi-writer-data-jp`).
- Chấm điểm số lần vẽ sai, hướng dẫn từng nét vẽ theo chuẩn quy tắc viết Hán tự Nhật Bản.
- Hỗ trợ chế độ tập viết tự do và xem chuyển động mẫu từng nét.

---

### 4. 🎙️ Phòng Thu Âm & Luyện Nói (Speaking Studio)
- Sử dụng **Web Speech API** (`SpeechRecognition` với ngôn ngữ `ja-JP`).
- Áp dụng thuật toán **Levenshtein Distance** đo khoảng cách chỉnh sửa chuỗi để tính tỷ lệ chính xác (%) giọng đọc của học viên so với câu mẫu.

---

### 5. 📖 Luyện Đọc & Tra Từ Điển Jisho (Reading Reader)
- Hiển thị bài đọc gắn thẻ `<ruby>` Furigana chuẩn W3C.
- Công tắc 1-chạm bật/tắt toàn bộ Furigana để thử thách khả năng đọc chữ Hán.
- Click vào bất kỳ từ nào để tra cứu nghĩa ngay tại chỗ qua Express Backend Proxy (chống triệt để lỗi CORS của Jisho API).

---

### 6. 🛡️ Bảng Điều Khiển Quản Trị Viên (Super Admin Control Center)
- Truy cập tại đường dẫn `/admin` (Tài khoản: `admin@jlpt.vn` / `AdminPassword123!`).
- Xem thống kê số liệu toàn hệ thống theo thời gian thực (Học viên, Từ vựng, Kanji, Lượt FSRS).
- Bảng quản lý danh sách học viên, theo dõi chuỗi Streak và quyền hạn (RBAC).
- Bộ công cụ Database Tools: Đồng bộ lại 2.963 từ vựng OpenJLPT hoặc nạp lại ngữ pháp chỉ với 1 click.
- Form thêm từ vựng mới trực tiếp vào cơ sở dữ liệu MongoDB.

---

### 7. 🌙 Tối Ưu Hóa Giao Diện Full Screen & Dark Mode
- Hệ thống **Theme Engine** chuyển đổi mượt mà giữa Giao diện Sáng ☀️ và Giao diện Tối 🌙.
- Thiết kế **Fluid Responsive (`max-w-[1720px]`)**: Tối ưu hoàn hảo cho màn hình lớn (Widescreen / Full Screen), không bị co cụm hay trống lề.

---

## 📊 Thống Kê Quy Mô Ngữ Liệu Trong Hệ Thống

| Phân Loại Dữ Liệu | N5 (Sơ cấp) | N4 (Sơ trung) | N3 (Trung cấp) | Tổng Cộng Toàn Hệ Thống |
| :--- | :---: | :---: | :---: | :---: |
| 📚 **Từ vựng (Vocabulary)** | 674 từ | 630 từ | 1.659 từ | **2.963 từ** |
| 🈁 **Chữ Hán (Kanji)** | 84 chữ | 169 chữ | 387 chữ | **640 chữ** |
| 🧩 **Ngữ pháp (Grammar)** | 134 cấu trúc | 139 cấu trúc | 210 cấu trúc | **483 cấu trúc** |
| 🎧 **Audio & Phát âm** | Có (Web Speech) | Có (Web Speech) | Có (Web Speech) | **100% Phát âm bản xứ** |

---

## 🏗️ Cấu Trúc Mã Nguồn (System Architecture)

```text
jlpt-mern-platform/
├── docker-compose.yml               # Đóng gói 3 container: MongoDB, Backend, Nginx Client
├── DEVELOPMENT_REPORT.md            # Báo cáo tổng kết toàn bộ quá trình phát triển
├── README.md                        # Hướng dẫn chi tiết & tài liệu vận hành
│
├── server/                          # BACKEND API: Node.js + Express.js + Mongoose
│   ├── Dockerfile                   # Docker image Node 20 Alpine siêu gọn nhẹ
│   ├── src/
│   │   ├── config/                  # db.js (Kết nối Atlas Cloud / In-Memory Server), env.js
│   │   ├── models/                  # User.js, Vocabulary.js, Kanji.js, Grammar.js, StudyProgress.js
│   │   ├── controllers/             # authController, srsController, grammarController, adminController...
│   │   ├── middlewares/             # authMiddleware (JWT + RBAC Admin), errorHandler
│   │   ├── routes/                  # /api/v1/{auth, srs, admin, vocab, kanji, grammar, dictionary}
│   │   ├── data/openjlpt/           # Ngữ liệu offline: vocab, kanji và grammar.json (1.9MB)
│   │   ├── scripts/                 # autoSeed.js, seedOpenJLPT.js, seedGrammarCorpus.js, createAdmin.js
│   │   └── server.js                # Server entrypoint
│   └── package.json
│
└── client/                          # FRONTEND: React (Vite) + Tailwind CSS + Lucide Icons
    ├── Dockerfile                   # Multi-stage build (Vite Builder -> Nginx Production)
    ├── nginx.conf                   # Reverse Proxy /api/ & SPA Fallback routing
    ├── vite.config.js               # Cấu hình proxy tự động cho Local Dev
    ├── src/
    │   ├── api/                     # axiosClient.js (Tự động đính kèm JWT Bearer Token)
    │   ├── context/                 # AuthContext (JWT & User state), ThemeContext (Dark Mode)
    │   ├── components/              # Navbar, AuthModal, FuriganaText
    │   ├── features/                # ClassroomSession, KanjiStrokePad, SpeakingStudio, ReadingReader
    │   ├── pages/                   # Dashboard, GrammarDojo, KanjiDojo, KanaChart, AdminDashboard
    │   └── App.jsx                  # Main Routing
    └── package.json
```

---

## 🚀 Hướng Dẫn Vận Hành & Khởi Chạy

### Cách 1: Khởi chạy siêu tốc với Docker Compose (Khuyên dùng)
Yêu cầu: Máy đã cài đặt Docker & Docker Compose.

```bash
# 1. Di chuyển vào thư mục dự án
cd jlpt-mern-platform

# 2. Khởi chạy toàn bộ hệ thống bằng 1 câu lệnh duy nhất
docker compose up --build -d
```

Sau khi hoàn tất, mở trình duyệt truy cập:
- **Web App**: `http://localhost`
- **Backend API**: `http://localhost:5000/api/v1/health`

---

### Cách 2: Khởi chạy môi trường phát triển (Local Development)
Yêu cầu: Node.js >= 18 và npm >= 9.

```bash
# 1. Cài đặt toàn bộ dependencies cho cả Client và Server
cd jlpt-mern-platform
npm install

# 2. Chạy Server Backend (Port 6767)
cd server
npm run dev

# 3. Mở Terminal mới và chạy Frontend Client (Port 5173)
cd client
npm run dev
```

Truy cập: `http://localhost:5173`

> [!NOTE]
> Server Backend tích hợp cơ chế **Resilient Hybrid Database**: Tự động kết nối MongoDB Atlas Cloud; nếu không có kết nối mạng bên ngoài, server sẽ **tự động kích hoạt In-Memory MongoDB Server** để bạn có thể lập trình ngay lập tức mà không bao giờ bị gián đoạn!

---

## 🔑 Tài Khoản Quản Trị Viên Mặc Định (Super Admin)

Hệ thống tự động khởi tạo tài khoản quản trị viên tối cao ngay lần đầu khởi chạy:

| Trường thông tin | Giá trị |
| :--- | :--- |
| **Email đăng nhập** | `admin@jlpt.vn` |
| **Mật khẩu mặc định** | `AdminPassword123!` |
| **Vai trò (Role)** | `admin` (Role-based Access Control - RBAC) |
| **Đường dẫn trang quản trị** | `/admin` |

---

## 📡 Danh Mục API Endpoints Chính

| Phương Thức | Endpoint | Quyền Hạn | Mô Tả Chức Năng |
| :---: | :--- | :---: | :--- |
| `GET` | `/api/v1/health` | Public | Kiểm tra trạng thái máy chủ (Healthcheck) |
| `POST` | `/api/v1/auth/register` | Public | Đăng ký tài khoản học viên mới |
| `POST` | `/api/v1/auth/login` | Public | Đăng nhập nhận JWT Token (7 ngày) |
| `GET` | `/api/v1/vocab` | Public | Lấy danh sách từ vựng (hỗ trợ phân trang, lọc level, search) |
| `GET` | `/api/v1/kanji` | Public | Lấy danh sách chữ Hán và dữ liệu nét KanjiVG |
| `GET` | `/api/v1/grammar` | Public | Lấy 483 cấu trúc ngữ pháp N5 - N3 |
| `GET` | `/api/v1/grammar/conjugations`| Public | Lấy danh sách động từ và câu hỏi chia 8 thể |
| `GET` | `/api/v1/grammar/quizzes/random`| Public | Lấy ngẫu nhiên câu hỏi trắc nghiệm phản xạ ngữ pháp |
| `POST` | `/api/v1/srs/review` | Học viên | Lưu lượt ôn tập tính toán theo thuật toán FSRS |
| `GET` | `/api/v1/admin/stats` | Admin | Lấy số liệu thống kê toàn bộ hệ thống |
| `POST` | `/api/v1/admin/vocab` | Admin | Thêm từ vựng mới vào MongoDB |
| `POST` | `/api/v1/grammar/seed` | Public | Nạp/Đồng bộ lại toàn bộ 483 mẫu ngữ pháp |

---

## 🛠️ Công Nghệ & Thư Viện Sử Dụng (Tech Stack)

- **Frontend**: React 18, Vite 6, Tailwind CSS 3.4, Lucide React Icons, WanaKana (Bộ gõ IME tiếng Nhật), HanziWriter (Mô phỏng nét viết KanjiVG), Axios Client.
- **Backend**: Node.js 20, Express.js 4, Mongoose 8, JWT (JSON Web Tokens), Bcryptjs, Ts-FSRS (Thuật toán ghi nhớ ngắt quãng FSRS), Helmet, CORS, Morgan.
- **Database**: MongoDB 7.0 & MongoDB Memory Server (In-Memory Fallback).
- **DevOps & Containerization**: Docker, Docker Compose, Multi-stage Build, Nginx Alpine Reverse Proxy.

---

<div align="center">
  <p>Được phát triển với niềm đam mê công nghệ và ngôn ngữ Nhật Bản 🇯🇵</p>
  <p>© 2026 JLPT Master Platform. Giữ toàn quyền tác giả.</p>
</div>
