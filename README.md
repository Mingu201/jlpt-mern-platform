# JLPT MERN Platform (N5 → N3)

Nền tảng học tiếng Nhật toàn diện 4 kỹ năng (**Reading, Listening, Speaking, Writing**) từ N5 lên N3 xây dựng trên **MERN Stack** theo chuẩn kiến trúc **Software Engineering (SWE)**.

## 1. Công nghệ & Tài nguyên Mã nguồn Mở Tích hợp

- **Backend**: Node.js, Express.js (Layered Architecture: Config, Models, Controllers, Middlewares, Routes).
- **Database**: MongoDB + Mongoose Schemas (Hỗ trợ cả In-Memory MongoDB tự động cho Local Dev lẫn MongoDB Atlas Cloud).
- **Frontend**: React (Vite) + Tailwind CSS + Lucide Icons.
- **Reading**: Phân tích đoạn văn Furigana thẻ `<ruby>` và Tra từ tức thì với Jisho API qua Backend Proxy.
- **Writing**: Tích hợp **HanziWriter** tương tác trên Canvas với dữ liệu nét vẽ chuẩn **KanjiVG** (`hanzi-writer-data-jp`), chấm điểm sai nét theo thời gian thực.
- **Speaking & Listening**: **Web Speech API** (`SpeechRecognition` ja-JP + `SpeechSynthesis`) kết hợp thuật toán so khớp **Levenshtein Distance** chấm điểm % phát âm Shadowing.
- **Kana & IME**: Bảng chữ cái tương tác + Bộ gõ tiếng Nhật nhúng trực tiếp bằng **WanaKana** (tự động biến `watashi` thành `わたし`).
- **Data Seeding**: Script nạp dữ liệu mẫu JLPT N5, N4, N3 (`seed.js`).

## 2. Hướng dẫn Khởi chạy (Chỉ cần 1 lệnh)

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

2. **Khởi chạy đồng thời Backend & Frontend**:
   - Backend chạy tại: `http://localhost:5000`
   - Frontend chạy tại: `http://localhost:5173`
   *(Nếu chưa cấu hình `MONGODB_URI`, server tự động khởi chạy In-Memory MongoDB hoàn toàn mượt mà!)*

   Chạy server:
   ```bash
   cd server
   npm run seed  # Nạp dữ liệu mẫu N5-N3
   npm run dev   # Khởi động Express API
   ```

   Chạy client:
   ```bash
   cd client
   npm run dev   # Khởi động Vite React
   ```

## 3. Cấu trúc Thư mục

```text
jlpt-mern-platform/
├── server/
│   ├── src/
│   │   ├── config/          # db.js, env.js
│   │   ├── controllers/     # vocabController, kanjiController, dictionaryController
│   │   ├── middlewares/     # errorHandler
│   │   ├── models/          # Vocabulary, Kanji, StudyProgress, User
│   │   ├── routes/          # RESTful endpoints (/api/v1/...)
│   │   ├── scripts/         # seed.js (N5-N3 Data Seeder)
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
└── client/
    ├── src/
    │   ├── api/             # axiosClient.js
    │   ├── components/      # Navbar, FuriganaText
    │   ├── features/
    │   │   ├── reading/     # ReadingReader (Furigana toggle, Jisho lookup)
    │   │   ├── speaking/    # SpeakingStudio (Shadowing, Levenshtein matching)
    │   │   └── writing/     # KanjiStrokePad (HanziWriter Canvas)
    │   ├── pages/           # Dashboard (Flashcards), KanaChart (WanaKana IME), KanjiDojo
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```
