# CHƯƠNG 3: THIẾT KẾ VÀ CÀI ĐẶT GIẢI PHÁP

## 3.1. Tổng quan hệ thống

### 3.1.1. Mô tả tổng quan

Hệ thống quản lý hoạt động sinh viên (Student Activity Management System - SAMS) tại Trường Đại học Cần Thơ được thiết kế và xây dựng như một giải pháp toàn diện, kết hợp giữa các chức năng quản lý hoạt động học đường truyền thống và công nghệ trí tuệ nhân tạo hiện đại. Hệ thống hoạt động trên nền tảng web, tuân thủ mô hình Client-Server, đảm bảo khả năng tương tác mượt mà giữa người dùng cuối (sinh viên, ban chủ hội, ban liên chi hội) và máy chủ xử lý dữ liệu (Backend, API).

Mục tiêu cốt lõi của hệ thống là:

1. **Đơn giản hóa quy trình quản lý hoạt động**: Cung cấp công cụ tập trung để sinh viên đăng ký, quản lý và theo dõi các hoạt động học tập.

2. **Cá nhân hóa trải nghiệm người dùng**: Thay vì chỉ cung cấp một danh sách hoạt động tĩnh, hệ thống đóng vai trò như một trợ lý thông minh, có khả năng thấu hiểu sở thích và hành vi của sinh viên để đưa ra các gợi ý hoạt động chính xác.

3. **Tăng cường tính minh bạch**: Cho phép các ban chủ hội theo dõi mức độ tham gia, quản lý duyệt chứng chỉ và tạo báo cáo chi tiết về hoạt động.

4. **Hỗ trợ ra quyết định**: Cung cấp các công cụ thống kê và phân tích dữ liệu cho ban quản trị để tối ưu hóa chiến lược phát triển hoạt động.

Hệ thống được chia làm ba phân hệ chính hoạt động song song và hỗ trợ lẫn nhau:

- **Phân hệ Sinh viên (Student Portal)**: Tập trung vào khám phá hoạt động, quản lý đăng ký, theo dõi lịch biểu và tương tác với hệ thống gợi ý AI.

- **Phân hệ Ban chủ hội (Club Board)**: Tập trung vào tạo và quản lý hoạt động, duyệt chứng minh chứng tham gia, và theo dõi thống kê hoạt động.

- **Phân hệ Quản trị (Admin Dashboard)**: Tập trung vào các tác vụ quản lý dữ liệu toàn hệ thống (CRUD), kiểm soát nội dung, quản lý người dùng và báo cáo toàn cục.

### 3.1.2. Tổng quan các chức năng

Dựa trên các yêu cầu chức năng đã phân tích ở Chương 1 và các use case được ghi nhận ở `USE_CASES_DOCUMENTATION.md`, hệ thống cung cấp các nhóm chức năng chính sau:

#### **Nhóm chức năng Xác thực và Phân quyền**

Đảm bảo an toàn bảo mật cho hệ thống thông qua:
- Cơ chế đăng ký tài khoản cho người dùng mới
- Đăng nhập với email/mật khẩu
- Xác thực bằng JSON Web Token (JWT) cho các API calls
- Phân quyền rõ ràng giữa 4 vai trò: Khách vãng lai, Sinh viên, Ban chủ hội, Quản trị viên
- Hỗ trợ xác thực multi-factor (MFA) cho các tài khoản quản trị

#### **Nhóm chức năng Quản lý hoạt động và Đăng ký**

Cung cấp các tính năng cốt lõi:
- **Tạo hoạt động**: Ban chủ hội có thể tạo, chỉnh sửa, hủy bỏ hoạt động với các thông tin chi tiết (tiêu đề, mô tả, thời gian, địa điểm, hạng mục, tiêu chí)
- **Đăng ký hoạt động**: Sinh viên có thể tìm kiếm, xem chi tiết và đăng ký tham gia hoạt động
- **Quản lý lịch biểu**: Hệ thống tự động kiểm tra xung đột lịch trình và cảnh báo sinh viên khi có hoạt động trùng lịch
- **Theo dõi trạng thái**: Sinh viên có thể xem trạng thái đăng ký (chờ xác nhận, đã chấp nhận, hoàn thành)

#### **Nhóm chức năng AI & Cá nhân hóa**

Đây là điểm nhấn của hệ thống, bao gồm:
- **Hệ thống gợi ý hoạt động**: Module sử dụng kỹ thuật lai ghép (Hybrid Recommendation) kết hợp Content-Based Filtering (60%) và Collaborative Filtering (40%) để gợi ý hoạt động phù hợp dựa trên:
  - Sở thích được khai báo của sinh viên (Interest Tags)
  - Lịch sử tham gia hoạt động trước đó (Collaboration Signal)
  - Mẫu tương tác của sinh viên tương tự (Peer Behavior)
- **Tối ưu hóa lịch trình**: Hệ thống đảm bảo các gợi ý không có xung đột thời gian với các hoạt động đã đăng ký

#### **Nhóm chức năng Quản trị nội dung**

Cho phép quản trị viên quản lý toàn diện vòng đời của dữ liệu:
- **Quản lý người dùng**: Xem danh sách, khóa/mở khóa tài khoản, phân công vai trò
- **Quản lý hoạt động**: Xem toàn bộ hoạt động, chỉnh sửa nội dung, kiểm soát trạng thái (DRAFT, PUBLISHED, CANCELLED, ARCHIVED)
- **Quản lý tiêu chí**: Tạo, chỉnh sửa, xóa các tiêu chí đạt được mà hoạt động có thể cung cấp
- **Quản lý hạng mục**: Cấu hình các hạng mục (Category) để phân loại hoạt động
- **Quản lý thẻ**: Duy trì danh sách các thẻ quan tâm (Interest Tags) mà sinh viên có thể chọn

#### **Nhóm chức năng Thống kê & Báo cáo**

Cung cấp cái nhìn tổng quan về hiệu quả hoạt động:
- **Báo cáo hoạt động**: Xuất danh sách đăng ký, thống kê lượng tham gia theo từng hoạt động
- **Báo cáo sinh viên**: Xem lịch sử tham gia, số điểm hoạt động, tiêu chí đạt được của mỗi sinh viên
- **Biểu đồ xu hướng**: Hiển thị biểu đồ về lượng hoạt động được tạo, lượng đăng ký theo thời gian
- **Quản lý tiêu chí duyệt**: Theo dõi trạng thái duyệt chứng chỉ (PENDING, APPROVED, REJECTED)

---

## 3.2. Kiến trúc hệ thống

### 3.2.1. Thiết kế kiến trúc tổng quát

Hệ thống được xây dựng dựa trên mô hình kiến trúc **3-Tier (Ba lớp)**, giúp tách biệt rõ ràng giữa giao diện, logic nghiệp vụ và dữ liệu, đồng thời tạo điều kiện thuận lợi cho việc bảo trì, mở rộng và sao lưu sau này.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER (Presentation)                │
├──────────────┬──────────────────────┬──────────────────────────────┤
│              │                      │                              │
│ Web Browser  │  Next.js Frontend    │  Next.js Admin Dashboard    │
│ (Student)    │  (ctu-activity-      │  (ctu-activity-admin/)      │
│              │   frontend/)          │                              │
│              │  - React Components  │  - Dashboard Components    │
│              │  - TailwindCSS UI    │  - Admin Controls          │
│              │  - State Management  │  - Analytics Widgets       │
│              │  - API Client        │                              │
└──────────────┴──────────────────────┴──────────────────────────────┘
                                │
                                │ HTTP/HTTPS + REST API
                                │
┌─────────────────────────────────────────────────────────────────────┐
│                  BUSINESS LOGIC LAYER (Backend)                    │
├──────────────────────────────────────┬──────────────────────────────┤
│                                      │                              │
│  NestJS Core API                     │  Python Recommendation     │
│  (ctu-activity-backend/)             │  Service (recommendation-  │
│                                      │   service/)                │
│  - Authentication & Authorization    │  - Hybrid Recommendation   │
│  - Activity Management               │  - Cosine Similarity      │
│  - User Profile Management           │  - Co-occurrence Matrix   │
│  - Registration Handling             │  - Content-Based Filter   │
│  - Schedule Conflict Detection       │  - Collaborative Filter   │
│  - Criteria Management               │  - Score Normalization    │
│  - Notification Service              │  - Filtering & Ranking    │
│  - Report Generation                 │                            │
│                                      │                            │
│  Express.js + TypeORM                │  FastAPI + SQLAlchemy     │
│  Architecture:                       │  Architecture:             │
│  - Controllers (HTTP Handlers)       │  - Routes (Endpoints)     │
│  - Services (Business Logic)         │  - Services (Algorithms)  │
│  - Repositories (Data Access)        │  - Schemas (Data Models)  │
│  - Decorators (Auth Guards)          │  - Database Layer         │
│  - Middleware (Logging, etc)         │                            │
└──────────────────────────────────────┴──────────────────────────────┘
                                │
                                │ SQL Queries + Database Calls
                                │
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA LAYER (Persistence)                       │
├──────────────────────────────────────┬──────────────────────────────┤
│                                      │                              │
│  PostgreSQL Database                 │  Cloudinary Cloud Storage  │
│  (Primary Data Store)                │  (Media Storage)           │
│                                      │                            │
│  Tables:                             │  - Poster Images          │
│  - Users                             │  - Activity Photos        │
│  - Activities                        │  - Profile Avatars        │
│  - ActivityTags                      │  - Documents (if any)     │
│  - UserInterest                      │                            │
│  - ActivityRegistration              │  CDN Benefits:            │
│  - UserActivitySchedule              │  - Global Distribution    │
│  - ActivityCriteria                  │  - Fast Image Delivery    │
│  - CriteriaProof                     │  - Automatic Optimization │
│  - Tags                              │  - Caching Layer          │
│  - Categories                        │                            │
│  - Notifications (optional)          │                            │
│                                      │                            │
│  Indexes:                            │                            │
│  - User Authentication               │                            │
│  - Activity Status & Filters         │                            │
│  - Registration Lookups              │                            │
│  - Schedule Conflict Queries         │                            │
└──────────────────────────────────────┴──────────────────────────────┘
```

### 3.2.2. Chi tiết từng lớp

#### **Lớp Presentation (Frontend)**

Được xây dựng bằng **Next.js 14** với **App Router**, cung cấp trải nghiệm người dùng đáp ứng và tối ưu hóa cho hiệu suất:

**Cấu trúc thư mục:**

```
ctu-activity-frontend/
├── app/
│   ├── layout.tsx              # Layout chính toàn ứng dụng
│   ├── page.tsx                # Trang chủ / Dashboard
│   ├── login/page.tsx          # Trang đăng nhập
│   ├── register/page.tsx       # Trang đăng ký
│   ├── activities/
│   │   ├── page.tsx            # Danh sách hoạt động
│   │   ├── [id]/page.tsx       # Chi tiết hoạt động
│   │   └── [id]/register/      # Trang đăng ký
│   ├── profile/
│   │   ├── page.tsx            # Hồ sơ sinh viên
│   │   ├── interests/          # Quản lý sở thích
│   │   └── registrations/      # Danh sách đăng ký
│   ├── calendar/page.tsx       # Lịch hoạt động (UC_011)
│   ├── progress/page.tsx       # Theo dõi tiến độ
│   ├── ai-recommendations/     # Gợi ý AI (UC_009)
│   └── checkin/page.tsx        # Check-in hoạt động
├── components/
│   ├── ActivityCard.tsx        # Component card hoạt động
│   ├── PlayerUI.tsx            # Giao diện người dùng
│   ├── SearchBar.tsx           # Thanh tìm kiếm
│   ├── Filters.tsx             # Bộ lọc hoạt động
│   ├── RecommendationCard.tsx  # Card gợi ý AI
│   └── [components khác]/
├── lib/
│   ├── api-client.ts           # HTTP Client cho API
│   ├── auth-service.ts         # Xử lý xác thực
│   ├── activity-service.ts     # Gọi API hoạt động
│   ├── recommendation-service.ts # Gọi API gợi ý
│   └── utils.ts                # Hàm tiện ích
├── hooks/
│   ├── useAuth.ts              # Hook xác thực
│   ├── useActivities.ts        # Hook quản lý hoạt động
│   └── useRecommendations.ts   # Hook gợi ý
├── stores/
│   └── authStore.ts            # State management (Zustand)
├── styles/
│   └── globals.css             # Tailwind CSS config
├── types/
│   └── index.ts                # TypeScript interfaces
└── package.json
```

**Công nghệ sử dụng:**
- **Next.js 14**: Framework React với SSR/SSG
- **TailwindCSS**: Styling utility-first CSS
- **TypeScript**: Type-safe JavaScript
- **Zustand**: State management nhẹ
- **Axios/Fetch**: HTTP client
- **React Query** (tuỳ chọn): Data fetching & caching

#### **Lớp Business Logic (Backend)**

Được xây dựng bằng **NestJS** và **Python FastAPI**, tách biệt thành hai module chính:

##### **A. NestJS Core API** (`ctu-activity-backend/`)

Xử lý toàn bộ logic nghiệp vụ chính:

```
ctu-activity-backend/
├── src/
│   ├── main.ts                 # Entry point
│   ├── app.module.ts           # Root module
│   ├── modules/
│   │   ├── auth/               # Authentication & Authorization
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── auth.guard.ts
│   │   │   └── auth.module.ts
│   │   ├── users/              # User Management
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── user.entity.ts
│   │   │   └── users.module.ts
│   │   ├── activities/         # Activity Management
│   │   │   ├── activities.controller.ts
│   │   │   ├── activities.service.ts
│   │   │   ├── activity.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-activity.dto.ts
│   │   │   │   └── update-activity.dto.ts
│   │   │   └── activities.module.ts
│   │   ├── registrations/      # Activity Registrations
│   │   │   ├── registrations.controller.ts
│   │   │   ├── registrations.service.ts
│   │   │   ├── registration.entity.ts
│   │   │   └── registrations.module.ts
│   │   ├── schedules/          # Schedule Management
│   │   │   ├── user-activity-schedule.entity.ts
│   │   │   ├── schedules.service.ts
│   │   │   └── schedules.module.ts
│   │   ├── criteria/           # Criteria Management
│   │   │   ├── criteria.entity.ts
│   │   │   ├── criteria.service.ts
│   │   │   └── criteria.module.ts
│   │   ├── tags/               # Tag Management
│   │   │   ├── tag.entity.ts
│   │   │   ├── tags.service.ts
│   │   │   └── tags.module.ts
│   │   ├── recommendations/    # Recommendation Orchestration
│   │   │   ├── recommendations.controller.ts
│   │   │   ├── recommendations.service.ts
│   │   │   └── recommendations.module.ts
│   │   └── [modules khác]/
│   ├── cores/                  # Core utilities
│   │   ├── decorators/         # Custom decorators
│   │   ├── filters/            # Exception filters
│   │   ├── guards/             # Auth guards
│   │   ├── interceptors/       # HTTP interceptors
│   │   └── pipes/              # Validation pipes
│   ├── database/               # Database config
│   │   ├── migrations/         # TypeORM migrations
│   │   └── database.module.ts
│   └── config/                 # Configuration
│       └── env.ts
├── test/
├── package.json
└── tsconfig.json
```

**Kiến trúc theo lớp (Layered Architecture):**

```
NestJS Controller (HTTP Handler)
         ↓
    [DTOs & Validation]
         ↓
NestJS Service (Business Logic)
         ↓
    [Entity Models]
         ↓
TypeORM Repository (Data Access)
         ↓
    [SQL Queries]
         ↓
PostgreSQL Database
```

**Dòng xử lý của một API Request:**

```
Request: POST /activities/register
    ↓
[JWT Guard] - Verify token
    ↓
[Validation Pipe] - Validate DTO
    ↓
RegistrationsController.register()
    ↓
RegistrationsService.register()
    - Check if activity exists
    - Check if user already registered
    - Check schedule conflicts (SchedulesService)
    - Create ActivityRegistration record
    - Update UserActivitySchedule
    - Notify recommendation service (optional)
    ↓
RegistrationsRepository.save()
    ↓
PostgreSQL: INSERT INTO activity_registrations ...
    ↓
Response: 201 Created + JSON data
```

##### **B. Python Recommendation Service** (`recommendation-service/`)

Module độc lập chuyên xử lý thuật toán gợi ý AI:

```
recommendation-service/
├── app/
│   ├── main.py                 # Entry point
│   ├── config.py               # Configuration
│   ├── api/
│   │   └── routes/
│   │       └── recommendations.py # API endpoints
│   ├── cores/
│   │   └── database.py         # SQLAlchemy setup
│   ├── models/
│   │   └── database_models.py  # ORM models
│   ├── schemas/
│   │   └── schemas.py          # Pydantic schemas
│   └── services/
│       └── recommendation_service.py # Core algorithm
├── requirements.txt
├── .env
└── docker-compose.yml (optional)
```

**API Endpoints của Recommendation Service:**

```
GET  /api/recommendations/recommend/{user_id}
     ↳ Get personalized recommendations for a user
     
GET  /api/recommendations/user-profile/{user_id}
     ↳ Get user's interest profile
     
POST /api/recommendations/batch-recommend
     ↳ Get recommendations for multiple users
```

**Dòng xử lý của Recommendation Request:**

```
Request: GET /recommend/user-123?limit=10
    ↓
RecommendationService.calculate_recommendations()
    ├─ Content-Based Branch (60% weight)
    │  ├ Get user interests (tag weights)
    │  ├ Get published activities
    │  ├ Create activity matrix
    │  └ Calculate cosine similarities
    │
    ├─ Collaborative Branch (40% weight)
    │  ├ Build co-occurrence matrix
    │  ├ Get user registration history
    │  └ Calculate collaborative scores
    │
    ├─ Filtering & Constraints
    │  ├ Exclude already registered
    │  ├ Detect schedule conflicts
    │  └ Apply criteria bonus
    │
    ├─ Hybrid Scoring
    │  ├ Combine content + collab scores
    │  ├ Add diversity noise
    │  ├ Apply final normalization
    │  └ Rank by score descending
    │
    └─ Return top-N recommendations
         ↓
    Response: JSON array of activities with scores
```

#### **Lớp Data (Database & Storage)**

##### **A. PostgreSQL Database**

Cơ sở dữ liệu quan hệ chính lưu trữ toàn bộ metadata:

**Schema chính:**

```sql
-- Users & Authentication
TABLE users {
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  password_hash VARCHAR,
  full_name VARCHAR,
  avatar_url VARCHAR,
  role ENUM('STUDENT', 'CLUB_BOARD', 'UNION_BOARD', 'ADMIN'),
  verified_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
}

-- Activities
TABLE activities {
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR,
  description TEXT,
  category_id INT FOREIGN KEY,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  location VARCHAR,
  max_participants INT,
  poster_url VARCHAR,
  status ENUM('DRAFT', 'PUBLISHED', 'CANCELLED', 'ARCHIVED'),
  created_by UUID FOREIGN KEY (users.id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
}

-- Tags & Interests
TABLE tags {
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR UNIQUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
}

TABLE activity_tags {
  activity_id INT FOREIGN KEY,
  tag_id INT FOREIGN KEY,
  PRIMARY KEY (activity_id, tag_id)
}

TABLE user_interests {
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id UUID FOREIGN KEY,
  tag_id INT FOREIGN KEY,
  weight FLOAT DEFAULT 0.5,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
}

-- Registrations
TABLE activity_registrations {
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id UUID FOREIGN KEY,
  activity_id INT FOREIGN KEY,
  proof_status ENUM('PENDING', 'APPROVED', 'REJECTED'),
  registered_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
}

-- Schedules
TABLE user_activity_schedules {
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id UUID FOREIGN KEY,
  activity_id INT FOREIGN KEY,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
}

-- Criteria
TABLE activity_criteria {
  id INT PRIMARY KEY AUTO_INCREMENT,
  activity_id INT FOREIGN KEY,
  criterion_id INT FOREIGN KEY,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
}

TABLE criteria {
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR,
  description TEXT,
  icon_url VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
}

-- Categories
TABLE categories {
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR UNIQUE,
  color VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
}
```

**Chỉ mục tối ưu:**

```sql
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_category ON activities(category_id);
CREATE INDEX idx_activity_registrations_user ON activity_registrations(user_id);
CREATE INDEX idx_activity_registrations_activity ON activity_registrations(activity_id);
CREATE INDEX idx_user_interests_user ON user_interests(user_id);
CREATE INDEX idx_activity_tags_tag ON activity_tags(tag_id);
CREATE INDEX idx_schedules_user ON user_activity_schedules(user_id);
CREATE INDEX idx_users_email ON users(email);
```

##### **B. Cloudinary Cloud Storage**

Lưu trữ các tệp đa phương tiện:
- **Poster Images**: Hình ảnh bìa hoạt động (JPG, PNG, WebP)
- **Profile Avatars**: Ảnh đại diện người dùng
- **Activity Photos**: Hình ảnh liên quan đến hoạt động
- **Documents**: Chứng chỉ, báo cáo (nếu cần)

**Lợi ích của Cloudinary:**
- **CDN toàn cầu**: Phân phối nhanh từ server gần nhất
- **Tối ưu hóa tự động**: Nén, resize, định dạng hình ảnh
- **Caching**: Cache phía client và server
- **Bandwidth tối ưu**: Chỉ truyền những gì cần thiết

---

### 3.2.3. Luồng giao tiếp giữa các thành phần

#### **Kịch bản 1: Sinh viên xem danh sách hoạt động và gợi ý AI**

```
┌──────────────────┐
│  Next.js Frontend│
└────────┬─────────┘
         │ (1) GET /activities?page=1&limit=10
         │ (2) GET /recommendations/user/123?limit=5
         ↓
┌────────────────────────────────────────────────┐
│         NestJS Backend API                     │
│  ├─ activitiesController.getAll()              │
│  ├─ recommendationsController.getRecommend()   │
│  └─ JWT Guard validates token                  │
└────────┬─────────────────────────────────────┐
         │ (3) Call external service for AI   │
         │ HTTP POST to Python service        │
         │                                    │
         ↓                                    │
┌────────────────────────────────────────┐    │
│  Python FastAPI Recommendation Service │    │
│  ├─ recommend_service.calculate_()     │◄───┘
│  ├─ Build user profile vector          │
│  ├─ Compute cosine similarities        │
│  ├─ Build co-occurrence matrix         │
│  └─ Return ranked recommendations      │
└────────┬─────────────────────────────────┐
         │ (4) Query user interests        │
         │ (5) Query activity registrations│
         │ (6) Query activity tags         │
         ↓
┌────────────────────────────────────────┐
│    PostgreSQL Database                 │
│    SELECT * FROM user_interests        │
│    SELECT * FROM activity_registrations│
│    SELECT * FROM activity_tags         │
│    ...                                 │
└────────────────────────────────────────┘
```

#### **Kịch bản 2: Sinh viên đăng ký hoạt động**

```
┌──────────────────────────┐
│  Next.js Frontend        │
└────────┬─────────────────┘
         │ POST /activities/{id}/register
         │ { proof_file, ... }
         ↓
┌──────────────────────────────────────────────┐
│  NestJS Backend API                          │
│  ├─ JWT Guard: Validate user token           │
│  ├─ registrationsController.register()       │
│  ├─ registrationsService.register()          │
│  │  ├─ Check if activity exists & published │
│  │  ├─ Check if already registered          │
│  │  ├─ schedulesService.detectConflict()    │
│  │  │  └─ Query UserActivitySchedule        │
│  │  ├─ Create ActivityRegistration          │
│  │  ├─ Create UserActivitySchedule          │
│  │  └─ Update activity registration_count   │
│  └─ Return 201 Created                       │
└────────┬─────────────────────────────────────┘
         │ (Save to database)
         ↓
┌──────────────────────────────────────────┐
│  PostgreSQL                              │
│  INSERT INTO activity_registrations ...  │
│  INSERT INTO user_activity_schedules ... │
│  UPDATE activities SET ...               │
└──────────────────────────────────────────┘
         │
         │ (Optionally notify recommendation service)
         │ POST /recommendations/notify-registration
         ↓
┌──────────────────────────────────────────┐
│  Python FastAPI                          │
│  (Update co-occurrence matrix for future)│
│  (Or cache invalidation signal)          │
└──────────────────────────────────────────┘
```

---

### 3.2.4. Cơ chế xác thực và ủy quyền

#### **JWT Token Flow**

```
┌─ Login Request ─────────────────────────┐
│ POST /auth/login                        │
│ { email, password }                     │
└─────────────────┬──────────────────────┘
                  │
                  ↓
┌─ NestJS Auth Service ──────────────────┐
│ 1. Query user by email                 │
│ 2. Validate password (bcrypt)          │
│ 3. Generate JWT tokens                 │
│    - Access Token (15 min expiry)      │
│    - Refresh Token (7 days expiry)     │
│ 4. Return tokens to client             │
└─────────────────┬──────────────────────┘
                  │
                  ↓
┌─ Response ─────────────────────────────┐
│ {                                      │
│   "access_token": "eyJh...",          │
│   "refresh_token": "eyJh...",         │
│   "user": { ... }                      │
│ }                                      │
└────────────────────────────────────────┘
                  │
                  │ (Store in localStorage/sessionStorage)
                  │
                  ↓
┌─ Subsequent API Requests ──────────────┐
│ GET /activities                        │
│ Headers: {                             │
│   "Authorization": "Bearer eyJh..."    │
│ }                                      │
└─────────────────┬──────────────────────┘
                  │
                  ↓
┌─ JWT Guard (Middleware) ───────────────┐
│ 1. Extract token from header           │
│ 2. Verify signature & expiry           │
│ 3. Decode payload → get user_id, role  │
│ 4. Attach to request.user              │
│ 5. Pass to controller                  │
└────────────────────────────────────────┘
```

#### **Role-Based Access Control (RBAC)**

```
STUDENT      - View activities
             - Register activities
             - View own profile & registrations
             - Update own profile
             
CLUB_BOARD   - Create activities (under their club)
             - Manage own activities
             - View registrations for own activities
             - Approve/reject proof
             
UNION_BOARD  - Manage club boards
             - Override activity status
             - View cross-club statistics
             
ADMIN        - Full system access
             - Manage all users & roles
             - Manage all activities
             - System configuration
             - View all reports
```

---

## 3.3. Các công nghệ sử dụng

| Thành phần | Công nghệ | Phiên bản | Mục đích |
|-----------|----------|----------|---------|
| **Frontend** | Next.js | 14+ | Web framework + SSR |
| | React | 18+ | UI library |
| | TypeScript | 5+ | Type-safe JavaScript |
| | TailwindCSS | 3+ | Utility-first CSS |
| | Zustand | 4+ | State management |
| **Backend** | NestJS | 10+ | Node.js framework |
| | Express.js | 4+ | HTTP server (built-in) |
| | TypeORM | 0.3+ | ORM |
| | PostgreSQL | 13+ | Database |
| | JWT | N/A | Authentication |
| **Recommendation** | Python | 3.8+ | Core language |
| | FastAPI | 0.10+ | Web framework |
| | SQLAlchemy | 2.0+ | ORM |
| | NumPy | 1.2+ | Numerical computing |
| | Scikit-learn | 1.0+ | ML algorithms |
| **Storage & Media** | Cloudinary | Latest | Cloud image/file storage |
| | Redis | 6+ | Cache (optional) |

---

## 3.4. Thiết kế theo giao diện (User Interface Design)

Giao diện của hệ thống Quản lý Hoạt động Sinh viên được xây dựng dựa trên triết lý **"Lấy người dùng làm trung tâm"** (User-Centric Design), kết hợp giữa tính thẩm mỹ hiện đại và trải nghiệm người dùng mượt mà. Hệ thống sử dụng các thành phần UI có sẵn từ thư viện Radix UI + shadcn/ui, được tùy biến thông qua TailwindCSS 4.2, tạo nên một giao diện nhất quán, dễ sử dụng trên mọi thiết bị.

### 3.4.1. Nguyên lý thiết kế cốt lõi

#### **Phong cách Minimalism & Light Mode**

Giao diện chính của hệ thống sử dụng nền sáng (light mode) làm chủ đạo, giúp:
- Tập trung sự chú ý vào nội dung chính (hoạt động, dữ liệu)
- Giảm thiểu yếu tố trang trí rườm rà, tạo cảm giác gọn gàng
- Tối ưu hóa khả năng đọc và độ tương phản
- Sử dụng không gian trắng (whitespace) để tạo sự thở trong thiết kế

#### **Hệ thống màu Gradient Blue-Purple**

Màu sắc chủ đạo của hệ thống dựa trên gradient từ xanh dương (#2563eb) đến tím (#9333ea), được sử dụng cho:
- Header/Navbar: Gradient `from-blue-600 to-purple-600`
- Nút bấm chính (CTA): `bg-gradient-to-r from-blue-600 to-purple-600`
- Highlight các thành phần quan trọng

#### **Phân cấp thị giác (Visual Hierarchy)**

Sử dụng size, weight, và spacing để hướng dẫn người dùng:
- **Tiêu đề chính** (h1): Bold, size lớn, color trẻ
- **Tiêu đề phụ** (h2-h3): Size trung bình, weight medium
- **Nội dung chính** (p): Color neutral, readable
- **Nội dung phụ**: Color muted, size nhỏ hơn

#### **Tính nhất quán (Consistency)**

- Tất cả component tuân thủ cùng một design system
- Button, Card, Input đều có styling thống nhất
- Icon từ Lucide React được sử dụng xuyên suốt
- Spacing và padding tuân theo grid 4px

### 3.4.2. Cấu trúc Navigation Header

Header là thành phần hàng đầu cố định, có gradient nền từ blue sang purple:

```
┌─────────────────────────────────────────────────────────────────┐
│ Logo │ [Hidden] Hoạt Động │ Lịch trình │ Tiến Độ │ Gợi ý AI │ ...
│      │         (md+)      │  (md+)     │ (md+)  │ (md+)    │
│      │ [Mobile ☰ Menu]                              [👤 User] │
└─────────────────────────────────────────────────────────────────┘
```

**Thành phần Header:**

1. **Logo (Trái)**: Icon/Logo `h-8 w-8 rounded-lg`

2. **Menu Điều hướng Chính** (Desktop - hidden on mobile):
   - **Hoạt Động** → `/activities` - Danh sách và khám phá hoạt động
   - **Lịch trình** → `/calendar` - Xem lịch hoạt động
   - **Tiến Độ Của Tôi** → `/progress` - Theo dõi tiến độ SV5T
   - **Gợi ý AI** → `/ai-recommendations` - Các gợi ý hoạt động được cá nhân hóa (có badge "NEW" với hiệu ứng animate)

   **Styling**: 
   - Text color: `text-white`
   - Hover effect: `hover:text-blue-100` transition mượt
   - Gap giữa các item: `gap-8`

3. **Mobile Menu Toggle** (sm - md):
   - Hamburger icon ☰
   - Dropdown overlay chứa toàn bộ menu items

4. **User Profile Dropdown** (Phải):
   - Avatar với initials fallback (e.g., "NT" cho Nguyễn Trung)
   - Hover hiển thị: Tên người dùng, email
   - Menu items:
     - **Hồ Sơ** (`/profile`)
     - **Đăng Xuất** (logout)
   - Khi chưa đăng nhập: **Đăng Nhập** / **Đăng Ký** buttons

**Responsive Behavior**:
```
Desktop (>md):   Menu chữ hiển thị, header full
Tablet (sm-md):  Hamburger menu + Text
Mobile (<sm):    Hamburger menu + Icons only
```

### 3.4.3. Hệ thống Thiết kế (Design System)

#### **Color Palette** (từ globals.css)

```css
/* Primary Colors */
--primary: 215 81% 35%;           /* #2563eb - Blue */
--primary-light: 215 81% 45%;     /* Lighter */
--primary-dark: 215 81% 25%;      /* Darker */

/* Gradient */
--gradient-from: 215 81% 54%;     /* Blue */
--gradient-to: 267 82% 56%;       /* Purple */

/* Semantic Colors */
--destructive: 0 84% 60%;         /* Red for errors/alerts */
--muted: 215 15% 90%;            /* Gray for disabled/secondary */

/* Component-specific */
--sidebar: 215 81% 35%;           /* Sidebar background */
--sidebar-foreground: 0 0% 100%;  /* Sidebar text */

/* Charts */
--chart-1 through --chart-5: Các màu khác nhau cho biểu đồ
```

#### **Typography**

- **Font Family**: `Geist` (sans) - Modern, clean typeface
- **Font Mono**: `Geist Mono` - Code/number display
- **Font Weight Scale**:
  - Regular: 400 (body text)
  - Medium: 500 (labels)
  - Semibold: 600 (headings)
  - Bold: 700 (emphasis)

#### **Spacing System** (TailwindCSS scale)

- Base unit: 4px
- `p-2` (8px), `p-4` (16px), `p-6` (24px), `p-8` (32px)
- `gap-4`, `gap-6`, `gap-8` cho layout grid/flex
- `m-2`, `m-4`, etc. cho margin

#### **Border Radius System**

```css
--radius: 0.625rem (10px)        /* Default */
--radius-sm: 3px
--radius-md: 5px
--radius-lg: 10px
--radius-xl: 14px
```

Sử dụng: `rounded-lg` (10px), `rounded-xl` (14px), etc.

#### **Shadow System**

- `shadow-sm`: Subtle elevation
- `shadow-md`: Medium elevation
- `shadow-lg`: Strong elevation
- `hover:shadow-lg`: Interactive feedback

### 3.4.4. Thư viện Component

Hệ thống sử dụng **shadcn/ui** pattern - một library component xây dựng trên Radix UI:

| Component | Mục đích | Ví dụ sử dụng |
|-----------|---------|--------------|
| **Button** | CTA chính | Register, Submit, Delete |
| **Card** | Container nội dung | Activity card, Stats card |
| **Input** | Text/Email input | Search bar, Login form |
| **Select** | Dropdown selector | Filter by category |
| **Checkbox** | Multiple choice | Interest selection |
| **Dialog** | Modal popup | Confirm deletion |
| **Badge** | Tag/Label | Category badge, Status |
| **Avatar** | User profile | User icon in header |
| **Tabs** | Section switcher | Dashboard tabs |
| **Table** | Data display | Admin data tables |
| **Calendar** | Date picker | Event date selection |
| **Progress** | Progress bar | SV5T progress display |
| **Popover** | Floating tooltip | Hover info |
| **Toast** | Notification | Success/Error messages |

**Tất cả component được styled thông qua TailwindCSS classes, không cần CSS riêng.**

### 3.4.5. Cấu trúc các trang chính

#### **Dashboard/Home** (`app/page.tsx`)

Trang chủ hiển thị khi người dùng đã đăng nhập:

1. **Hero Banner**: Gradient background, tiêu đề lớn, CTA buttons
2. **Featured Activities**: Carousel hoạt động nổi bật
3. **Progress Section**: SV5T progress display với:
   - Circular progress indicator (overall percentage)
   - 5 group cards (Đạo đức, Trí tuệ, Năng lực, Hội nhập, Thành quả)
   - Progress bars per group
   - Color-coded status (green = completed, gray = pending)
4. **Categories Grid**: Grid các category với icon và color
5. **Recommendations Section**: AI recommendations carousel
6. **Statistics**: Key metrics cards
7. **Testimonials**: Student reviews
8. **Organizations**: Partner organizations

#### **Activities Page** (`app/activities/page.tsx`)

```
┌─ Search Bar ─────────────────────────────────┐
│  🔍 Tìm kiếm hoạt động...      [Category ▼]  │
└──────────────────────────────────────────────┘

┌─ Activity Cards Grid ─────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐  ┌──────┐│
│  │ [Poster]     │  │ [Poster]     │  │...  ││
│  │ Category Tag │  │ Category Tag │  │     ││
│  │ Title        │  │ Title        │  │     ││
│  │ Organizer    │  │ Organizer    │  │     ││
│  │ Date/Location│  │ Date/Location│  │     ││
│  │ 45% Enrolled │  │ 78% Enrolled │  │     ││
│  └──────────────┘  └──────────────┘  └──────┘│
└──────────────────────────────────────────────┘

[Previous] Page 1/5 [Next]
```

**Features**:
- Search with debounce
- Category filter dropdown
- Pagination (10 items/page)
- Activity cards với poster image, title, organizer, dates, location, enrollment %

#### **Calendar Page** (`app/calendar/page.tsx`)

```
┌─ Month View ──────────────────────────────────┐
│ < April 2026 >                                │
│ Mo Tu We Th Fr Sa Su                          │
│  1  2  3  4  5  6  7                          │
│ [8] 9 10 11 12 13 14  ← Today highlighted    │
│ 15 16 17 18 19 20 21                          │
│ ...                                            │
│                                                │
│ Events on selected day:                        │
│ ├─ [Volunteer] Leadership Workshop (9:00-11) │
│ ├─ [Academic] Python Workshop (14:00-16)     │
│ └─ [Sports] Football Match (18:00-20)        │
└──────────────────────────────────────────────┘
```

**Features**:
- Monthly calendar view (Mon-first layout)
- Color-coded events by category
- Day selection with event list
- Weekend highlighting
- Today indicator

#### **Progress Page** (`app/progress/page.tsx`)

```
┌─ Overall Progress ────────────────────────────┐
│            75%                                │
│        ◯         [XUẤT SẮC]                  │
│                                                │
│ Tiến độ chi tiết:                            │
│ ┌─ Group 1: Đạo đức (❤️ Red) ─────────────┐ │
│ │ ██████████░░░░░░░░ 60% (6/10 criteria) │ │
│ ├─ Group 2: Trí tuệ (🧠 Blue) ───────────┤ │
│ │ ████████████░░░░░░ 70%                │ │
│ ├─ Group 3: Năng lực (⚡ Green) ────────┤ │
│ │ ██████████████░░░░ 80%                │ │
│ ├─ Group 4: Hội nhập (👥 Purple) ──────┤ │
│ │ ██████████░░░░░░░░ 55%                │ │
│ └─ Group 5: Thành quả (🏆 Amber) ──────┘ │
│   ████████████████░░ 90%                  │
└──────────────────────────────────────────────┘
```

**Features**:
- SV5T 5-group system visualization
- Overall progress circular display
- Color-coded group cards (red, blue, green, purple, amber)
- Progress bars per group
- Expandable criteria list
- Ranking badges: XUẤT SẮC, KHÁ, TRUNG BÌNH, CẦN CỐ GẮNG

#### **AI Recommendations Page** (`app/ai-recommendations/page.tsx`)

```
┌─ Gợi ý dành riêng cho bạn ───────────────────┐
│                                               │
│ ┌─ Recommendation Card ────────────────────┐ │
│ │ [Poster] Category | Title                │ │
│ │          ⭐⭐⭐⭐⭐ 92% Match             │ │
│ │          Tags: Leadership, Volunteer     │ │
│ │          [Xem Chi Tiết] [Đăng Ký]       │ │
│ └───────────────────────────────────────────┘ │
│                                               │
│ ┌─ Recommendation Card ────────────────────┐ │
│ │ [Poster] Category | Title                │ │
│ │          ⭐⭐⭐⭐⭐ 88% Match             │ │
│ │          [Xem Chi Tiết] [Đăng Ký]       │ │
│ └───────────────────────────────────────────┘ │
│                                               │
│ ... (up to 10 recommendations)               │
└──────────────────────────────────────────────┘
```

**Features**:
- Personalized AI-matched recommendations
- Similarity score display (%)
- AI-matched interest tags
- Activity details (category, organizer, timing, capacity, creator)
- "Xem Chi Tiết" (View Details) and "Đăng Ký" (Register) buttons

### 3.4.6. Hệ thống Màu cho Danh mục (Category Colors)

Mỗi danh mục hoạt động có một màu đặc trưng để dễ nhận diện:

| Danh mục | Badge Color | Icon | Dùng cho |
|----------|-------------|------|----------|
| TÌNH_NGUYỆN (Volunteer) | emerald-500 | Heart | Volunteer activities |
| HỌC_THUẬT (Academic) | blue-600 to purple-600 (gradient) | BookOpen | Educational events |
| THỂ_THAO (Sports) | orange-500 | Zap | Sports activities |
| VĂN_NGHỆ (Arts) | purple-500 | Palette | Cultural events |
| KỸ_NĂNG (Skills) | pink-500 | Lightbulb | Skill development |

### 3.4.7. Công cụ và Thư viện

#### **TailwindCSS 4.2** (CSS Framework)

Tất cả styling được thực hiện thông qua utility classes:

```jsx
// Button with gradient
<Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                   hover:shadow-lg hover:scale-105 transition-all">
  Đăng Ký
</Button>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
  {activities.map(activity => <ActivityCard key={activity.id} {...activity} />)}
</div>

// Flexbox layout with spacing
<div className="flex flex-col md:flex-row items-center justify-between gap-4">
  <h1 className="text-2xl md:text-4xl font-bold">Hoạt Động</h1>
  <SearchBar />
</div>
```

#### **Radix UI + shadcn/ui** (Component Library)

Pre-built accessible components như Button, Card, Dialog, etc. Tất cả đều styled thông qua TailwindCSS.

#### **Lucide React** (Icon Library)

564+ SVG icons được sử dụng để:
- Navigation icons (Home, Calendar, TrendingUp, Sparkles)
- Status icons (CheckCircle, AlertCircle, Clock)
- Action icons (Plus, Edit, Trash, Share)

```jsx
import { Calendar, Sparkles, TrendingUp } from 'lucide-react';

<Calendar className="w-5 h-5" />
<Sparkles className="w-4 h-4 animate-pulse" />  // AI badge animation
```

#### **Recharts** (Data Visualization)

Cho Admin Dashboard hoặc Progress page:

```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

<LineChart data={data} width={600} height={300}>
  <CartesianGrid stroke="#e0e0e0" />
  <XAxis dataKey="date" stroke="#666" />
  <YAxis stroke="#666" />
  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ccc' }} />
  <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} />
</LineChart>
```

#### **Embla Carousel** (Carousel Component)

Cho Featured Activities section:

```jsx
// Auto-carousel của hoạt động nổi bật
<Carousel>
  {featuredActivities.map(activity => (
    <ActivityCard key={activity.id} {...activity} />
  ))}
</Carousel>
```

#### **Sonner** (Toast Notifications)

Để hiển thị thông báo success/error/info:

```jsx
import { toast } from 'sonner';

toast.success('Đăng ký hoạt động thành công!');
toast.error('Có lỗi xảy ra, vui lòng thử lại.');
toast.loading('Đang xử lý...');
```

### 3.4.8. Thiết kế Responsive

Hệ thống sử dụng breakpoints của TailwindCSS:

```
Mobile: < 640px  (default styles)
Tablet: 640px-1024px (sm:, md:)
Desktop: > 1024px (lg:, xl:, 2xl:)
```

**Ví dụ responsive patterns**:

```jsx
// Navigation: Hidden on mobile, visible on desktop
<div className="hidden md:flex items-center gap-8">
  {navItems.map(item => <NavLink key={item.id} {...item} />)}
</div>

// Grid: 1 col on mobile, 2 on tablet, 3 on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {activities.map(a => <ActivityCard key={a.id} {...a} />)}
</div>

// Typography: Smaller on mobile, larger on desktop
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Quản lý Hoạt động
</h1>
```

### 3.4.9. Tính năng Accessibility (A11y)

Hệ thống tuân thủ tiêu chuẩn WCAG AA:

#### **Semantic HTML**
- `<button>` cho actions, không `<div onClick>`
- `<nav>` cho navigation
- `<main>` cho main content
- `<article>` cho cards/items

#### **Contrast Ratio**
- Text: `text-gray-900` on `bg-white` ≥ 7:1 (AAA)
- Hover states rõ ràng

#### **Keyboard Navigation**
- Tất cả button/link có thể được focus bằng Tab
- Focus indicator rõ ràng (outline/ring)
- Modal có focus trap (Focus không thoát khỏi modal)

#### **ARIA Labels**
```jsx
<button aria-label="Close dialog" onClick={onClose}>
  ×
</button>

<div role="status" aria-live="polite">
  Loading recommendations...
</div>
```

#### **Color Independence**
- Không dùng màu duy nhất để truyền thông tin
- Sử dụng icons + màu
- Status indicators: ✓ (completed), ○ (pending), ✗ (rejected)

#### **Alt Text cho Images**
```jsx
<img 
  src={activityPoster} 
  alt="Leadership Workshop poster - 20/04/2026"
/>
```

---

---

## 3.5. Quy trình triển khai

### **Môi trường Development**

```bash
# 1. Clone repository
git clone https://github.com/ctu/activity-system.git

# 2. Install dependencies
cd ctu-activity-backend && npm install
cd ../ctu-activity-frontend && npm install
cd ../recommendation-service && pip install -r requirements.txt

# 3. Setup environment variables
cp .env.example .env.local
# Edit .env.local with local credentials

# 4. Setup database
npm run typeorm migration:run

# 5. Start services
# Terminal 1
npm run start:dev  # NestJS

# Terminal 2
npm run dev  # Next.js Frontend

# Terminal 3
python -m app.main  # FastAPI
```

### **Môi trường Production**

- Deployment trên **Heroku**, **Railway**, hoặc **AWS** tùy theo yêu cầu
- Docker containerization cho mỗi service
- CI/CD pipeline với GitHub Actions
- Database backup hàng ngày
- CDN cho frontend assets

---

**Ghi chú:** Thiết kế kiến trúc này đảm bảo tính mô-đun, dễ bảo trì và có thể mở rộng khi hệ thống phát triển.
