# 📚 CTU ACTIVITY MANAGEMENT SYSTEM - TOÀN BỘ HỆ THỐNG

**Ngày tạo:** 15 tháng 4, 2026  
**Trạng thái:** Hoàn thành - Production Ready  
**Phiên bản:** 1.0

---

## 📑 MỤC LỤC

1. [Tổng Quan Hệ Thống](#1-tổng-quan-hệ-thống-system-overview)
2. [Kiến Trúc Hệ Thống](#2-kiến-trúc-hệ-thống-system-architecture)
3. [Chức Năng Chính](#3-chức-năng-chính-main-features)
4. [Luồng Hoạt Động](#4-luồng-hoạt-động-chính-system-flows)
5. [Luồng Dữ Liệu](#5-luồng-dữ-liệu-data-flow)
6. [API Chính](#6-api-chính-key-api-endpoints)
7. [Kịch Bản Sử Dụng](#7-kịch-bản-sử-dụng-thực-tế-use-case)

---

# 1️⃣ TỔNG QUAN HỆ THỐNG (System Overview)

## 🎯 Mục Tiêu Hệ Thống

**SAMS-CTU** là nền tảng quản lý hoạt động sinh viên toàn diện dành cho **Trường Đại học Cần Thơ (CTU)**, giải quyết các vấn đề:

- ❌ **Trước**: Quản lý hoạt động bằng Excel, phân tán, không tự động
- ✅ **Sau**: Tập trung hóa, tự động tính điểm **SV5T (Sinh Viên 5 Tốt)**, xác minh tham gia qua QR

**Mục đích cụ thể:**
- Sinh viên: Đăng ký tham gia hoạt động, nhận gợi ý cá nhân hóa, theo dõi tiến độ SV5T
- Giáo viên/LCH: Tạo hoạt động, duyệt bằng chứng tham gia, xác minh qua QR Code
- Admin: Quản lý toàn bộ hệ thống, báo cáo, xuất dữ liệu

---

## 👥 Người Dùng Chính

| Vai Trò | Mô Tả | Quyền |
|---------|-------|-------|
| **Sinh Viên (STUDENT)** | Đăng ký hoạt động, check-in qua QR | Xem/Đăng ký hoạt động, submit chứng minh |
| **LCH (Liên Chi Hội)** | Thành viên ban liên chi hội, duyệt hoạt động | Tạo/duyệt hoạt động, xác minh chứng minh |
| **CH (Chi Hội)** | Lãnh đạo chi hội/câu lạc bộ | Quản lý hoạt động của chi hội mình |
| **Admin** | Quản trị viên hệ thống | Full access, quản lý users, roles, báo cáo |

---

## 🧩 Các Thành Phần Chính

```
┌─────────────────────────────────────────────────────────────┐
│   CTU ACTIVITY MANAGEMENT SYSTEM (SAMS-CTU)                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  👨🏻‍💼 ADMIN PANEL (Next.js)                                  │
│     └─> Quản lý toàn hệ thống, duyệt hoạt động, QR checkin  │
│                                                              │
│  👨🏻 FRONTEND/USER APP (Next.js)                            │
│     └─> Sinh viên duyệt hoạt động, đăng ký, check-in qua QR│
│                                                              │
│  ⚙️ BACKEND API (NestJS)                                     │
│     └─> Xử lý logic, quản lý dữ liệu, SV5T calculator      │
│                                                              │
│  🤖 RECOMMENDATION SERVICE (FastAPI)                        │
│     └─> Gợi ý hoạt động dựa trên sở thích                   │
│                                                              │
│  💾 PostgreSQL DATABASE                                     │
│     └─> Lưu trữ 15+ bảng dữ liệu                            │
│                                                              │
│  ☁️ CLOUDINARY CDN                                           │
│     └─> Lưu poster hoạt động, hình ảnh bằng chứng           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

# 2️⃣ KIẾN TRÚC HỆ THỐNG (System Architecture)

## 🏗️ Mô Hình Tổng Thể

```
┌──────────────────────────────────────────────────────────────┐
│                    USER DEVICES / BROWSERS                    │
├───────────────────┬─────────────────────┬──────────────────┤
│  Admin Browser    │  Student Browser    │  Mobile Camera    │
│  (Admin Panel)    │  (User App)         │  (QR Scan)        │
└─────┬─────────────┴────────┬────────────┴────────┬───────────┘
      │                      │                     │
      │      HTTP/REST       │                     │
      │      (JWT Token)     │                     │
      └──────────┬───────────┴─────────────────────┘
                 │
         ┌───────▼────────────────────────┐
         │   API GATEWAY & BACKEND API    │
         │   (NestJS - localhost:8080)    │
         │                                │
         │  ✅ 21 Modules                 │
         │  ✅ Roles & Permissions        │
         │  ✅ JWT Authentication         │
         │  ✅ QR Code Verification       │
         │  ✅ SV5T Calculation           │
         └───┬────────────┬───────────────┘
             │            │
      ┌──────▼──┐  ┌──────▼──────────┐
      │PostgreSQL│  │  Cloudinary    │
      │ Database │  │  CDN (Files)   │
      │ (15+TB) │  └────────────────┘
      └─────────┘
             ▲
             │
      ┌──────┴─────────────────────┐
      │  RECOMMENDATION SERVICE    │
      │  (FastAPI - localhost:8001)│
      │                            │
      │  ✅ Content-Based Filter   │
      │  ✅ User Preference Vector │
      │  ✅ Cosine Similarity      │
      └────────────────────────────┘
```

---

## 🔄 Cách Các Module Giao Tiếp

**Backend là trung tâm**, tất cả giao tiếp thông qua REST API:

1. **Frontend → Backend**: 
   - Gửi HTTP requests (GET, POST, PATCH, DELETE)
   - Header: `Authorization: Bearer {JWT_TOKEN}`
   - Body: JSON data

2. **Backend ↔ Recommendation Service**:
   - Backend gọi: `GET /recommendations?userId=123` 
   - Recommendation Service đọc DB PostgreSQL
   - Return gợi ý hoạt động dạng JSON

3. **Backend ↔ Cloudinary**:
   - Upload file: `POST https://api.cloudinary.com/...`
   - Lấy URL: `https://res.cloudinary.com/...`

4. **Backend ↔ PostgreSQL**:
   - TypeORM quản lý ORM
   - CRUD operations trực tiếp

---

## 🛠️ Công Nghệ Sử Dụng

| Layer | Công Nghệ | Version | Mục Đích |
|-------|-----------|---------|---------|
| **Frontend** | Next.js | 14 | SPA cho sinh viên |
| **Admin Panel** | Next.js | 14 | Admin interface |
| **Backend** | NestJS | 10.x | REST API, Business Logic |
| **Database** | PostgreSQL | 15 | Persistent Storage |
| **ORM** | TypeORM | 0.3 | Database Mapping |
| **Auth** | JWT + Cookies | - | Token-based Auth |
| **ML/Recommendation** | FastAPI + Scikit-learn | - | Recommendations Engine |
| **File Storage** | Cloudinary | - | CDN cho Files & Images |
| **QR Code** | HMAC-SHA256 | - | Signature Verification |

---

# 3️⃣ CHỨC NĂNG CHÍNH (Main Features)

## 📱 **MODULE 1: ADMIN PANEL** (Next.js)

### ✅ Danh Sách Chức Năng:

| # | Chức Năng | Mô Tả |
|---|----------|-------|
| 1 | **Tạo Hoạt động** | Create new activities với hình poster, tiêu chí liên kết |
| 2 | **Duyệt Hoạt động** | Review hoạt động pending từ LCH/CH, approve/reject |
| 3 | **Hiển thị QR Code** | Nhấp "📱 QR Code" → Hiện QR lớn để sinh viên scan |
| 4 | **Xác minh Chứng minh** | Review proof từ sinh viên, chấm điểm (1-5), feedback |
| 5 | **Quản lý Sinh viên** | CRUD users, assign roles, disable accounts |
| 6 | **Báo cáo SV5T** | Xem progress từng sinh viên đúc rút từ tiêu chí |
| 7 | **Quản lý Units** | Tạo/sửa departments (khoa, CLB) |
| 8 | **Xuất Excel** | Export danh sách sinh viên tham gia hoạt động |
| 9 | **Quản lý Roles** | LCH, CH, ADMIN, STUDENT - assign permissions |
| 10 | **Thống kê** | Tổng hoạt động, sinh viên tham gia, SV5T stats |

---

## 👨🏻‍🎓 **MODULE 2: FRONTEND/USER APP** (Next.js)

### ✅ Danh Sách Chức Năng:

| # | Chức Năng | Mô Tả |
|---|----------|-------|
| 1 | **Đăng ký Tài khoản** | Register email, password (Bcrypt hashing) |
| 2 | **Đăng Nhập** | Login, nhận JWT Token (15 min) + Refresh Token (7 days) |
| 3 | **Duyệt Hoạt động** | Xem danh sách hoạt động available, filter by category/unit |
| 4 | **Chi Tiết Hoạt động** | Xem full info, start/end time, location, poster |
| 5 | **Đăng ký Tham gia** | Click "Đăng ký" → Thêm vào lịch, backend check conflict |
| 6 | **Hồ Sơ Cá Nhân** | Edit fullName, major, unitId, avatar (upload Cloudinary) |
| 7 | **Sở Thích (Interests)** | Chọn category yêu thích (tags) → cho recommendation |
| 8 | **QR Check-in** | Scan QR → `/checkin?activityId=X&...` → verify signature |
| 9 | **Upload Chứng minh** | Nếu hoạt động require proof → upload image |
| 10 | **Xem Tiến độ SV5T** | Xem scores từng tiêu chí (Đạo đức, Học tập, etc.) |
| 11 | **Lịch Hoạt động** | Calendar view hoạt động đã đăng ký |
| 12 | **Gợi Ý Hoạt động** | AI recommendations based on interests + previous activities |
| 13 | **Xem Lịch Sử** | Danh sách hoạt động đã tham gia, status check-in |

---

## 🔧 **MODULE 3: BACKEND API** (NestJS - 21 Modules)

### ✅ Chức Năng theo nhóm:

**A. Authentication & Authorization**
- Login/Logout với JWT refresh token
- Auto token refresh khi hết hạn
- Role-based access control (RBAC)
- Permission decorator (`@Roles()`)

**B. User Management**
- CRUD user profiles
- Update SV5T fields (GPA, DRL, credits)
- Avatar upload → Cloudinary
- Password hashing (bcryptjs)

**C. Activity Management**
- Create/Update/Delete activities
- Assign categories, tags, criteria
- Search & filter by multiple fields
- Poster upload → Cloudinary
- Activity approval workflow

**D. Registration & Enrollment**
- Student registration for activities
- Calendar conflict detection
- Proof submission & verification
- Status: PENDING → VERIFIED/REJECTED

**E. QR Check-in System**
- Generate QR code (HMAC-SHA256 signature)
- Verify signature on scan
- Time-based expiration (±15 min)
- Auto-mark as VERIFIED

**F. SV5T Criteria & Progress**
- 5 Merit Groups (Đạo đức, Học tập, Thể lực, Tình nguyện, Hội nhập)
- Auto-calculate progress from verified activities
- Track per user per criteria
- Final SV5T eligibility

**G. Recommendation Service Integration**
- Fetch user interests from DB
- Call FastAPI recommendation endpoint
- Return top 10 personalized activities

**H. Utilities & Reports**
- Export Excel (participant lists)
- Database health checks
- Activity tags management
- Units (departments) hierarchy

---

## 🤖 **MODULE 4: RECOMMENDATION SERVICE** (Python FastAPI)

### ✅ Danh Sách Chức Năng:

| # | Chức Năng | Mô Tả |
|---|----------|-------|
| 1 | **Content-Based Filtering** | Match user interests vector với activity tags vector |
| 2 | **Cosine Similarity** | Tính similarity score (0-1) giữa user & activities |
| 3 | **Top-K Recommendations** | Return top 10 hoạt động phù hợp nhất |
| 4 | **Batch Recommendations** | Gợi ý cho nhiều users cùng lúc |
| 5 | **User Profile Vector** | Tạo weighted preference vector từ user interests |
| 6 | **Activity Vectorization** | Convert tags → feature vector cho activities |
| 7 | **Similarity Filtering** | Filter activities với minimum similarity score (mặc định 0.0) |
| 8 | **Direct DB Connection** | Query PostgreSQL real-time (không cache) |

**API Endpoints:**
```
GET /recommendations?user_id=123
GET /recommendations/batch
POST /recommendations/calculate
GET /user-profile/vector?user_id=123
```

---

# 4️⃣ LUỒNG HOẠT ĐỘNG CHÍNH (System Flows)

## 📋 FLOW 1: Đăng Ký Tài Khoản + Đăng Nhập

```
┌─────────────┐
│   Sinh viên │
└────┬────────┘
     │ 1. Vào trang /register
     ▼
┌─────────────────────────────────┐
│ Frontend: Register Form          │
│ - Email, fullName, password      │
└──────────┬──────────────────────┘
           │ 2. POST /auth/register
           ▼
┌─────────────────────────────────┐
│ Backend: Auth Service            │
│ ✓ Validate email format          │
│ ✓ Crypt password (bcrypt salt=10)│
│ ✓ Create user in DB              │
│ ✓ Assign STUDENT role            │
└──────────┬──────────────────────┘
           │ 3. Return { message, user }
           ▼
┌──────────────────────────────┐
│ Frontend: Redirect to /login │
│ "Đăng ký thành công"         │
└────┬─────────────────────────┘
     │ 4. Vào trang /login
     ▼
┌──────────────────────────┐
│ Frontend: Login Form      │
│ - Email, password         │
└──────────┬───────────────┘
           │ 5. POST /auth/login
           ▼
┌──────────────────────────────────────┐
│ Backend: Auth Service                │
│ ✓ Find user by email                 │
│ ✓ Compare password (bcrypt)          │
│ ✓ Generate JWT (exp: 15 min)         │
│ ✓ Generate RefreshToken (exp: 7 days)│
│ ✓ Return token in HTTP-Only Cookie   │
└──────────┬──────────────────────────┘
           │ 6. Return { accessToken, user }
           ▼
┌─────────────────────────────┐
│ Frontend: Store Token        │
│ localStorage.setItem(        │
│   'token',                   │
│   accessToken                │
│ )                            │
│ Redirect to /activities      │
└─────────────────────────────┘
```

---

## 📝 FLOW 2: Tạo & Duyệt Hoạt động

```
┌──────────────────────┐
│  LCH/CH Member       │
└─────────┬────────────┘
          │ 1. Vào Admin Panel: /admin/activities
          ▼
┌──────────────────────────┐
│ Admin: New Activity Form  │
│ - Title, description      │
│ - Start/End time          │
│ - Category, tags          │
│ - Criteria linked         │
│ - Poster image            │
│ - requiresProof? (yes/no) │
└──────────┬───────────────┘
           │ 2. POST /admin/activities
           │    Upload poster → Cloudinary
           ▼
┌────────────────────────────────┐
│ Backend: Activities Service     │
│ ✓ Validate input                │
│ ✓ Save to DB (status="PENDING")│
│ ✓ Generate qrSecret (32 bytes)  │
│ ✓ Generate QR URL with HMAC signature
└──────────┬─────────────────────┘
           │ 3. Return { activityId, qrCodeUrl }
           ▼
┌──────────────────────────────────────┐
│ Admin Panel: Activity Created         │
│ ✓ Activity in PENDING state          │
│ ✓ Shows "❌ Chờ duyệt" status       │
└──────────┬───────────────────────────┘

════════════════════════════════════════

┌──────────────────────┐
│  ADMIN: Review       │
└─────────┬────────────┘
          │ 4. Vào Admin Panel
          │    Click activity → Detail Sheet
          ▼
┌────────────────────────────────┐
│ Admin: Activity Detail          │
│ ✓ Shows all fields              │
│ ✓ Shows "✅ Duyệt" button      │
│ ✓ Shows "❌ Từ chối" button    │
└──────────┬─────────────────────┘
           │ 5. PATCH /admin/activities/:id
           │    { status: "PUBLISHED" }
           ▼
┌────────────────────────────────────┐
│ Backend: Update Activity            │
│ ✓ Change status to PUBLISHED        │
│ ✓ Activity now visible to students  │
└──────────┬─────────────────────────┘
           │ 6. Return { message, activity }
           ▼
┌────────────────────────────────────────┐
│ Admin Panel: Success                    │
│ ✓ Activity status changed              │
│ ✓ QR button now active                 │
└────────────────────────────────────────┘
```

---

## 👨🏻‍🎓 FLOW 3: Sinh Viên Đăng Ký Hoạt động

```
┌──────────────┐
│  Sinh viên   │
└────┬─────────┘
     │ 1. Vào trang /activities
     ▼
┌──────────────────────────────┐
│ Frontend: Activities List     │
│ ✓ Call GET /activities        │
│ ✓ Show all PUBLISHED activities
└──────────┬──────────────────┘
           ▼ 2. Click activity
┌──────────────────────────┐
│ Frontend: Activity Detail │
│ ✓ Show title, time, image │
│ ✓ Button "Đăng ký"       │
└──────────┬───────────────┘
           │ 3. POST /registrations
           │    { activityId: 1, userId: "XX" }
           ▼
┌─────────────────────────────────────────┐
│ Backend: Registrations Service           │
│                                          │
│ ✓ Validate user not already registered   │
│ ✓ Check calendar conflict:               │
│   SELECT * FROM user_activity_schedule   │
│   WHERE userId = X AND                   │
│   (startTime, endTime) OVERLAP activity  │
│                                          │
│ ✓ If conflict: Reject registration       │
│ ✓ If OK: Create registration entry       │
│ ✓ Auto-add to user_activity_schedule     │
│ ✓ Update user_criteria (progress count)  │
└──────────┬──────────────────────────────┘
           │ 4. Return { registrationId, message }
           ▼
┌──────────────────────────────────┐
│ Frontend: Success Toast          │
│ "✅ Đã đăng ký hoạt động"      │
│ Redirect to calendar/dashboard   │
└──────────────────────────────────┘
```

---

## ✅ FLOW 4: Sinh Viên Check-in bằng QR

```
┌────────────────────────────────┐
│  ADMIN: Show QR to Students     │
└────────┬──────────────────────┘
         │ 1. Admin Panel → Activity Detail
         │    Click "📱 QR Code"
         ▼
┌────────────────────────────────────┐
│ QR Modal Opens                      │
│ ✓ Shows large QR (256px)           │
│ ✓ QR encodes URL with HMAC-SHA256  │
│ ✓ Admin displays on projector       │
└─────────────────────────────────────┘

════════════════════════════════════════

┌──────────────────────────────────┐
│  STUDENT: Scan QR                │
└────────┬──────────────────────┬──┘
         │ 2. Point phone camera
         │    at QR Code
         ▼
┌───────────────────────────────────┐
│ Phone Camera recognizes QR         │
│ → Opens URL in browser             │
└────────┬──────────────────────────┘
         │ 3. Browser: /checkin?...
         ▼
┌──────────────────────────────────┐
│ Frontend: /checkin page           │
│ ✓ Extract query params            │
│ ✓ Check if student logged in      │
│ ✓ POST /registrations/check-in    │
└────────┬──────────────────────────┘
         │ 4. Backend: QR Verification
         ▼
┌──────────────────────────────────────────┐
│ Backend: QR Check-in Service              │
│                                           │
│ ✓ Get activity & qrSecret                 │
│ ✓ Recalculate: HMAC-SHA256(               │
│     "${activityId}:${timestamp}",         │
│     qrSecret                              │
│   )                                       │
│                                           │
│ ✓ Compare: calculated === provided        │
│ ✓ Verify timestamp within ±15 min         │
│ ✓ Update registration.proofStatus=VERIFIED│
│ ✓ Update user_criteria progress count     │
│ ✓ Recalculate SV5T progress               │
└────────┬─────────────────────────────────┘
         │ 5. Return success response
         ▼
┌───────────────────────────────────┐
│ Frontend: Success Message         │
│ ✅ "Check-in thành công!"        │
│ "Tham gia hoạt động đã được      │
│  xác minh"                        │
└───────────────────────────────────┘
```

---

## 📤 FLOW 5: Submit & Xác Minh Chứng Minh

```
┌─────────────────────┐
│  STUDENT: Upload Proof  │
└────┬────────────────┘
     │ 1. Vào activity detail
     │    (hoạt động requiresProof=true)
     ▼
┌──────────────────────────────────┐
│ Frontend: Upload Form             │
│ ✓ Shows "Upload Bằng Chứng"      │
│ ✓ Accepts image/PDF               │
│ ✓ Max 10MB                        │
└──────────┬───────────────────────┘
           │ 2. Upload file
           │    POST /registrations/:id/upload-proof
           ▼
┌──────────────────────────────────────┐
│ Backend: Upload Service               │
│ ✓ Upload to Cloudinary                │
│ ✓ Save URL to registration            │
│ ✓ Set proofStatus = 'PENDING'         │
│ ✓ Notify Admin                        │
└──────────┬───────────────────────────┘
           │ 3. Notify Admin
           ▼

════════════════════════════════════════

┌──────────────────────┐
│  ADMIN: Verify Proof   │
└────┬─────────────────┘
     │ 1. Click registration
     │    → View proof image
     ▼
┌────────────────────────────────────┐
│ Admin: Verification Panel          │
│ ✓ Shows proof image                │
│ ✓ Button "✅ Duyệt"               │
│ ✓ Rating (1-5 stars)              │
│ ✓ Feedback text                    │
└──────────┬───────────────────────┘
           │ 2. Click "Duyệt"
           │    PATCH /registrations/:id/verify-proof
           ▼
┌─────────────────────────────────────────┐
│ Backend: Verify Service                  │
│ ✓ proofStatus = 'VERIFIED'              │
│ ✓ verifiedAt = NOW()                    │
│ ✓ Update user_criteria.progressCount++  │
│ ✓ Auto-calculate SV5T eligibility       │
└──────────┬──────────────────────────────┘
           │ 3. Notify Student
           ▼
┌───────────────────────────────────┐
│ Frontend: Success                 │
│ ✅ "Chứng minh đã được duyệt"    │
│ ✅ "SV5T progress cập nhật"      │
└───────────────────────────────────┘
```

---

## 🤖 FLOW 6: Gợi Ý Hoạt động (AI Recommendations)

```
┌──────────────────────────┐
│  STUDENT: View Profile   │
└────┬─────────────────────┘
     │ 1. Vào /profile
     ▼
┌──────────────────────────────────┐
│ Frontend: Edit Interests Section  │
│ ✓ Button "Chỉnh Sửa Sở Thích"   │
│ ✓ Shows available tags           │
└──────────┬───────────────────────┘
           │ 2. Select tags & Save
           │    POST /users/me/interests
           │    { tagIds: [1, 3, 5, ...] }
           ▼
┌──────────────────────────────────┐
│ Backend: Interest Service         │
│ ✓ Delete old interests            │
│ ✓ Create new user_interest rows   │
└──────────┬──────────────────────┘
           │ 3. Return success
           ▼

════════════════════════════════════════

┌──────────────────────────────┐
│  STUDENT: View Recommendations │
└────┬─────────────────────────┘
     │ 4. Vào /ai-recommendations
     ▼
┌────────────────────────────────────┐
│ Frontend: Recommendations Page      │
│ Click "Lấy Gợi Ý"                 │
│ POST /activities/recommendations    │
└──────────┬──────────────────────────┘
           │ 5. Backend calls FastAPI
           │    GET localhost:8001/recommendations?
           │    user_id=123
           ▼
┌──────────────────────────────────────┐
│ FastAPI: Recommendation Service       │
│                                       │
│ ✓ Get user interests from DB          │
│ ✓ Create user preference vector       │
│ ✓ Get all published activities        │
│ ✓ Create activity vectors             │
│ ✓ Calculate cosine similarity         │
│ ✓ Return top 10                       │
└──────────┬──────────────────────────┘
           │ 6. Return recommendations
           ▼
┌─────────────────────────────────┐
│ Frontend: Display Results        │
│ ✓ Show 10 recommended activities │
│ ✓ Cards with similarity %        │
│ ✓ Button "Xem Chi Tiết"         │
│ ✓ Button "Đăng Ký"              │
└─────────────────────────────────┘
```

---

# 5️⃣ LUỒNG DỮ LIỆU (Data Flow)

## 🔄 Dữ Liệu Di Chuyển Trong Hệ Thống

### 1️⃣ REGISTRATION DATA FLOW:
```
Student selects interests (tagIds)
↓
Frontend: POST /users/me/interests { tagIds: [...] }
↓
Backend:  INSERT INTO user_interests (userId, tagId, weight)
↓
PostgreSQL: user_interests table
↓
Recommendation Service: Query user_interests
↓
Calc similarity with activities
↓
Frontend: Display recommendations
```

### 2️⃣ ACTIVITY REGISTRATION DATA FLOW:
```
Student clicks "Đăng Ký"
↓
Frontend: POST /registrations { activityId, userId }
↓
Backend:
- Validate activity available
- Check calendar conflict
- Create registration entry
- Auto-add to schedule
↓
PostgreSQL:
- INSERT INTO registrations (...)
- INSERT INTO user_activity_schedule (...)
↓
Backend: Update user_criteria progress count
↓
user_criteria.progressCount += 1
```

### 3️⃣ QR CHECK-IN DATA FLOW:
```
Student scans QR
↓
Browser: GET /checkin?activityId=1&timestamp=...&signature=...
↓
Frontend: Extract params, POST /registrations/check-in
↓
Backend:
- Get activity.qrSecret
- Recalculate: HMAC-SHA256(payload, qrSecret)
- Compare signatures
- If valid: Update proofStatus = VERIFIED
↓
PostgreSQL: UPDATE registrations SET proofStatus='VERIFIED'
↓
Backend: Update user_criteria (progressCount++)
↓
Recalculate SV5T eligibility
```

### 4️⃣ PROOF VERIFICATION DATA FLOW:
```
Student uploads proof image
↓
Frontend: POST /registrations/:id/upload-proof (multipart)
↓
Backend:
- Upload to Cloudinary
- Save URL + proofStatus='PENDING'
↓
PostgreSQL: UPDATE registrations
↓
Admin reviews proof
↓
Frontend: PATCH /registrations/:id/verify-proof { verified: true }
↓
Backend:
- Update proofStatus='VERIFIED'
- Update user_criteria.progressCount++
↓
PostgreSQL: UPDATE registrations + UPDATE user_criteria
```

### 5️⃣ SV5T CALCULATION DATA FLOW:
```
Backend SV5T Service (calc on every registration update)
↓
FOR EACH user_criteria row:
- Get criteria_group.requiredCount (e.g., 3)
- Get user_criteria.progressCount (verified activities)
- Calculate:
  completionCount = floor(progressCount / requiredCount)
  autoCompleted = (completionCount >= 1)
↓
Check userOverride (3-state):
- If null: finalCompleted = autoCompleted
- If true/false: finalCompleted = userOverride
↓
UPDATE user_criteria.finalCompleted
↓
Check SV5T eligibility:
- sv5tEligible = ALL 5 criteria.finalCompleted == true
↓
UPDATE users.sv5tEligible
```

### 6️⃣ RECOMMENDATION ENGINE DATA FLOW:
```
Backend: GET /activities/recommendations?userId=123
↓
Call Recommendation Service:
GET localhost:8001/recommendations?user_id=123
↓
FastAPI:
- Query PostgreSQL: SELECT * FROM user_interests
- Create preference vector: [Tag1: 1.0, Tag2: 1.0, ...]
- Query PostgreSQL: SELECT * FROM activities (published)
- Tokenize activity tags → vectors
- Calc cosine similarity (each activity)
- Rank by similarity
- Return top 10
↓
Return recommended activities with similarity scores
↓
Backend: Enrich with activity details
↓
Frontend: Display recommendations
```

### 7️⃣ FILE UPLOAD DATA FLOW:
```
Student/Admin uploads avatar/poster/proof
↓
Frontend: multipart/form-data POST
↓
Backend CloudinaryService:
- POST https://api.cloudinary.com/upload
- Send file + API key
↓
Cloudinary:
- Store file in CDN
- Return public_url
↓
Backend:
- Save URL in DB (users.avatarUrl or activities.posterUrl)
↓
Frontend: Display image from Cloudinary URL
```

---

# 6️⃣ API CHÍNH (Key API Endpoints)

## 🔐 Authentication APIs

```http
# Register
POST /auth/register
Content-Type: application/json

{
  "email": "student@ctu.edu.vn",
  "password": "SecurePassword123",
  "fullName": "Nguyễn Văn A"
}

Response 201:
{
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "student@ctu.edu.vn",
    "fullName": "Nguyễn Văn A"
  }
}
```

```http
# Login
POST /auth/login
Content-Type: application/json

{
  "email": "student@ctu.edu.vn",
  "password": "SecurePassword123"
}

Response 200:
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "student@ctu.edu.vn",
      "sv5tEligible": false
    }
  }
}

Set-Cookie: refreshToken=...; HttpOnly; Path=/; Max-Age=604800
```

---

## 🎯 Activity APIs

```http
# Get all activities
GET /activities?category=VOLUNTEER&status=PUBLISHED&limit=10
Authorization: Bearer {token}

Response 200:
{
  "statusCode": 200,
  "data": [
    {
      "id": 1,
      "title": "Environmental Cleanup",
      "startTime": "2026-03-01T08:00:00Z",
      "category": "VOLUNTEER",
      "posterUrl": "https://res.cloudinary.com/...",
      "requiresProof": true,
      "qrCodeUrl": "https://app.com/checkin?...",
      "status": "PUBLISHED"
    }
  ]
}
```

```http
# Create activity (Admin/LCH only)
POST /admin/activities
Authorization: Bearer {token}

{
  "title": "New Activity",
  "description": "Description",
  "startTime": "2026-03-15T09:00:00Z",
  "endTime": "2026-03-15T12:00:00Z",
  "unitId": 1,
  "categoryId": 2,
  "tagIds": [1, 3, 5],
  "criteriaGroupIds": [1, 4],
  "requiresProof": true
}

Response 201:
{
  "statusCode": 201,
  "data": {
    "id": 5,
    "status": "PENDING",
    "qrCodeUrl": "https://app.com/checkin?activityId=5&..."
  }
}
```

---

## 📝 Registration APIs

```http
# Register for activity
POST /registrations
Authorization: Bearer {token}

{
  "activityId": 1
}

Response 201:
{
  "statusCode": 201,
  "data": {
    "registrationId": "reg-001",
    "proofStatus": "PENDING"
  }
}
```

```http
# QR Check-in
POST /registrations/check-in
Authorization: Bearer {token}

{
  "activityId": 1,
  "timestamp": 1234567890,
  "signature": "abc123def..."
}

Response 200:
{
  "statusCode": 200,
  "data": {
    "proofStatus": "VERIFIED"
  }
}
```

```http
# Upload proof
POST /registrations/:id/upload-proof
Authorization: Bearer {token}
Content-Type: multipart/form-data

proofFile: <file>

Response 200:
{
  "statusCode": 200,
  "data": {
    "proofUrl": "https://res.cloudinary.com/...",
    "proofStatus": "PENDING"
  }
}
```

```http
# Verify proof (Admin only)
PATCH /registrations/:id/verify-proof
Authorization: Bearer {token}

{
  "verified": true,
  "rating": 5,
  "feedback": "Great participation"
}

Response 200:
{
  "statusCode": 200,
  "data": {
    "proofStatus": "VERIFIED"
  }
}
```

---

## 🤖 Recommendation APIs

```http
# Get recommendations
GET /activities/recommendations
Authorization: Bearer {token}

Response 200:
{
  "statusCode": 200,
  "data": [
    {
      "id": 3,
      "title": "Sports Day",
      "similarity": 0.95,
      "tags": ["Thể thao"]
    }
  ]
}
```

---

## 📊 SV5T Progress APIs

```http
# Get SV5T progress
GET /users/me/sv5t-progress
Authorization: Bearer {token}

Response 200:
{
  "statusCode": 200,
  "data": {
    "userId": "user-123",
    "sv5tEligible": false,
    "criteria": [
      {
        "criteriaGroupId": 1,
        "name": "Đạo đức tốt",
        "requiredCount": 3,
        "progressCount": 2,
        "finalCompleted": false
      }
    ]
  }
}
```

---

# 7️⃣ KỊCH BẢN SỬ DỤNG THỰC TẾ (Use Case)

## 👨🏻‍🎓 **FULL JOURNEY: Một Sinh Viên Tham Gia Hoạt động**

**Scenario:** Sinh viên **Nguyễn Văn A** (B2012345, năm 2) muốn kiếm điểm **SV5T** bằng cách tham gia hoạt động.

### **📅 Tuần 1: Lên Tài Khoản + Đăng Nhập**

**Thứ 2 - Sáng:**
```
1. A vào website: https://ctu-activity.com
2. Click "Đăng Ký"
3. Nhập: Email, Password, Tên
4. Backend: Hash password bcrypt → Save user → Assign role STUDENT
5. Thông báo: "Đăng ký thành công!"
6. A đăng nhập email/password
7. Backend: Generate JWT (15 min) + RefreshToken
8. A được redirect to /activities
```

### **📅 Tuần 1: Chọn Sở Thích**

**Thứ 2 - Trưa:**
```
1. A click avatar → /profile
2. Kéo xuống "Sở Thích Của Tôi"
3. Click "Chỉnh Sửa"
4. Chọn tags: Tình nguyện, Thể thao, Học tập
5. Click "Lưu Thay Đổi"
6. Backend: Update user_interests table
7. Notification: "✅ Cập nhật sở thích thành công"
```

### **📅 Tuần 2: Duyệt & Đăng Ký Hoạt động**

**Thứ 3 - Sáng:**
```
1. A vào /activities
2. Thấy danh sách 8 hoạt động published
3. Click Activity #1 (Environmental Cleanup)
4. Thấy detail: title, time, criteria liên kết
5. Click "Đăng Ký"
6. Backend: 
   - Validate không trùng lặp
   - Check calendar conflict
   - Create registration entry
   - Auto-add to schedule
   - Update user_criteria.progressCount = 1
7. Frontend: Notification "✅ Đã đăng ký hoạt động!"
```

**Thứ 5 - Sáng (Ngày hoạt động):**
```
8. Thứ 5 08:00, A đến Campus Ground
9. Admin hiển thị QR code trên projector
10. A scan QR code bằng phone camera
11. Browser mở /checkin?activityId=1&timestamp=...&signature=...
12. Frontend: /checkin page → POST /registrations/check-in
13. Backend: 
    - Verify HMAC-SHA256 signature
    - Verify timestamp ±15 min
    - Update proofStatus = VERIFIED
    - Update user_criteria progress
14. Frontend: ✅ "Check-in thành công!"
    A thấy SV5T progress cập nhật
```

### **📅 Tuần 3: AI Gợi Ý Hoạt động**

**Thứ 2 - Trưa:**
```
1. A vào /ai-recommendations
2. Click "Lấy Gợi Ý Cho Tôi"
3. Backend calls FastAPI:
   - Get user interests
   - Create user preference vector
   - Calc similarity with all activities
   - Return top 10
4. Frontend: Display 10 recommended activities
5. A click "Đăng Ký" cho activity #7 (Hike)
   → Same flow as trước, nhưng lần này require proof
```

**Thứ 7 - Sáng:**
```
6. A tham gia Hike, kết thúc lúc chiều
7. A chụp ảnh tập thể, upload proof
   POST /registrations/reg-002/upload-proof
8. Backend: Upload to Cloudinary, set proofStatus='PENDING'
9. Admin Portal notified: 1 new proof to verify
```

**Thứ 2 - Admin Review:**
```
10. Admin vào Admin Panel
11. Click "Chứng Minh Chờ Xác Minh"
12. Thấy registration #2 → Click "Xem hình"
13. Assess: "Có vẻ hợp lệ"
14. Click "✅ Duyệt" → Rating 5/5
15. Backend: 
    - proofStatus = VERIFIED
    - Update user_criteria (progressCount++)
    - Recalculate SV5T: 2/5 criteria ✅
16. Frontend: Notification to A
    ✅ "Chứng minh được xác minh!"
```

### **📅 Cuối Tháng: SV5T Dashboard**

```
A vào /progress

Tổng tiêu chí hoàn thành: 2/5
Trạng thái SV5T: ❌ Chưa đủ điều kiện

Criteria Details:
✅ Đạo đức Tốt: 1/1 (HOÀN THÀNH)
❌ Học Tập Tốt: 0/12
✅ Thể Lực Tốt: 2/2 (HOÀN THÀNH)
❌ Tình Nguyện Tốt: 1/3
❌ Hội Nhập Tốt: 0/2

💡 Recommendations:
- Join 2 volunteer activities
- Attend 2 integration events
```

---

## 📌 TÓNG KẾT SỰ KIỆN

```
Timeline A's Journey:

Thứ 2 Tuần 1    → Register + Select Interests
Thứ 3 Tuần 2    → Register for Activity 1
Thứ 5 Tuần 2    → QR Check-in ✅ VERIFIED
Thứ 2 Tuần 3    → View AI Recommendations
Thứ 7 Tuần 3    → Register + Attend Activity 2
Thứ 7 (PM)      → Upload Proof
Thứ 2 Tuần 4    → Admin Verifies ✅ VERIFIED
Cuối Tháng      → SV5T Progress: 2/5
```

---

## 🎯 **KẾT LUẬN**

Hệ thống **SAMS-CTU** là một nền tảng **toàn diện, hiện đại**, giải quyết toàn bộ quy trình từ:

✅ **User Management**: Đăng ký, đăng nhập, hồ sơ  
✅ **Activity Discovery**: Duyệt, tìm kiếm, lọc  
✅ **Smart Recommendations**: AI gợi ý dựa trên sở thích  
✅ **Enrollment**: Đăng ký hoạt động, kiểm tra xung đột lịch  
✅ **Check-in**: QR code với mã hóa HMAC-SHA256  
✅ **Proof Verification**: Upload + xác minh bằng chứng  
✅ **Progress Tracking**: Tính toán SV5T real-time  
✅ **Admin Management**: Duyệt, verify, báo cáo  

Tất cả được **tích hợp toàn mặt** qua **Backend REST API trung tâm**, hỗ trợ **3 giao diện khác nhau** (Student App, Admin Panel, Recommendation Engine) và **1 database PostgreSQL duy nhất**.

---

**Document Version:** 1.0  
**Last Updated:** 15/04/2026  
**Status:** ✅ Complete & Ready for Review
