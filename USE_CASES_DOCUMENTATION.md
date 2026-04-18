# SỬ DỤNG CÁC TRƯỜNG HỢP - CTU ACTIVITY MANAGEMENT SYSTEM (SAMS-CTU)
## Use Case Documentation 1.0

**Dự Án:** Hệ Thống Quản Lý Hoạt Động Sinh Viên  
**Đại Học:** Cần Thơ (CTU)  
**Phiên Bản:** 1.0  
**Ngày Phát Hành:** Tháng 4 Năm 2026  
**Trạng Thái:** ✅ Hoàn Thành

---

## MỤC LỤC

1. [Tổng Quan Hệ Thống](#tổng-quan-hệ-thống)
2. [Định Nghĩa Tác Nhân (Actors)](#định-nghĩa-tác-nhân)
3. [Ma Trận Kiểm Soát Truy Cập](#ma-trận-kiểm-soát-truy-cập)
4. [Sinh Viên - Use Cases (UC_001-011)](#sinh-viên---use-cases-uc_001-011)
5. [BCH Chi Hội - Use Cases (UC_012-014)](#bch-chi-hội---use-cases-uc_012-014)
6. [BCH Liên Chi Hội - Use Cases (UC_015-016)](#bch-liên-chi-hội---use-cases-uc_015-016)
7. [Quản Trị Viên - Use Cases (UC_017-019)](#quản-trị-viên---use-cases-uc_017-019)

---

## TỔNG QUAN HỆ THỐNG

### Mô Tả Hệ Thống
**SAMS-CTU** là một nền tảng web toàn diện giúp sinh viên Đại Học Cần Thơ khám phá, đăng ký và theo dõi sự tham gia vào các hoạt động ngoại khóa. Hệ thống tự động đánh giá tiến độ của họ hướng tới việc kiếm những "Sinh Viên 5 Tốt" (SV5T).

### Công Nghệ
- **Backend API:** NestJS + TypeORM + PostgreSQL
- **Frontend:** Next.js 14 + React
- **Admin Panel:** Next.js 14 + TypeScript
- **Recommendation Engine:** Python FastAPI + Scikit-learn
- **File Storage:** Cloudinary CDN
- **Authentication:** JWT + Refresh Tokens

### Tính Năng Chính
- ✅ Quản lý hoạt động tập trung
- ✅ Theo dõi tiến độ SV5T cho sinh viên
- ✅ Hệ thống kiểm tra (QR & Ảnh)
- ✅ Xác minh bằng chứng tự động
- ✅ Gợi ý hoạt động do AI cung cấp
- ✅ Phát hiện xung đột lịch & tích hợp lịch

---

## ĐỊNH NGHĨA TÁC NHÂN

| Tác Nhân | Tên Tiếng Anh | Mô Tả | Quyền Chính |
|---------|--------------|--------|------------|
| **Sinh Viên** | Student | Sinh viên Đại Học Cần Thơ hoặc khách vãng lai chưa đăng ký | Xem hoạt động, đăng ký, điểm danh, xem tiến độ |
| **BCH Chi Hội** | Club Board | Trưởng/Phó Ban Chủ Hội Chi Hội | Tạo hoạt động, quản lý danh sách đăng ký, hiển thị QR |
| **BCH Liên Chi Hội** | Union Board | Ban Chủ Hội Liên Chi Hội | Phê duyệt hoạt động, phê duyệt bằng chứng |
| **Quản Trị Viên** | Admin | Người quản trị hệ thống | Toàn quyền: tài khoản, danh mục, tổ chức, phê duyệt |

---

## MA TRẬN KIỂM SOÁT TRUY CẬP

| Use Case | Sinh Viên | BCH Chi Hội | BCH Liên Chi Hội | Admin | Vai Trò Backend |
|----------|:---------:|:-----------:|:----------------:|:-----:|-----------------|
| UC_001: Đăng ký | ✅ | ✅ | ✅ | ✅ | PUBLIC |
| UC_002: Đăng nhập | ✅ | ✅ | ✅ | ✅ | PUBLIC |
| UC_003: Xem hoạt động | ✅ | ✅ | ✅ | ✅ | STUDENT+ |
| UC_004: Tìm kiếm | ✅ | ✅ | ✅ | ✅ | STUDENT+ |
| UC_005: Hồ sơ cá nhân | ✅ | ✅ | ✅ | ✅ | STUDENT+ |
| UC_006: Gợi ý AI | ✅ | - | - | - | STUDENT |
| UC_007: Đăng ký hoạt động | ✅ | - | - | - | STUDENT |
| UC_008: Theo dõi tiến độ | ✅ | - | - | - | STUDENT |
| UC_009: Điểm danh hình | ✅ | - | - | - | STUDENT |
| UC_010: Điểm danh QR | ✅ | - | - | - | STUDENT |
| UC_011: Lịch sử hoạt động | ✅ | - | - | - | STUDENT |
| UC_012: Quản lý hoạt động | - | ✅ | ✅ | ✅ | CH\|LCH\|ADMIN |
| UC_013: Danh sách đăng ký | - | ✅ | ✅ | ✅ | CH\|LCH\|ADMIN |
| UC_014: Hiển thị QR | - | ✅ | ✅ | ✅ | CH\|LCH\|ADMIN |
| UC_015: Phê duyệt hoạt động | - | - | ✅ | ✅ | LCH\|ADMIN |
| UC_016: Phê duyệt minh chứng | - | - | ✅ | ✅ | LCH\|ADMIN |
| UC_017: Quản lý danh mục | - | - | - | ✅ | ADMIN |
| UC_018: Quản lý tổ chức | - | - | - | ✅ | ADMIN |
| UC_019: Quản lý tài khoản | - | - | - | ✅ | ADMIN |

---

# SINH VIÊN - USE CASES (UC_001-011)

## UC_001: Đăng Ký Tài Khoản Mới

| Trường | Nội Dung |
|-------|---------|
| **Mã Yêu Cầu** | UC_001_DangKy |
| **Tên Use Case** | Đăng ký tài khoản mới |
| **Mức Độ Cần Thiết** | Cao |
| **Tác Nhân Chính** | Khách vãng lai (Guest) |
| **Các Thành Phần Tham Gia & Mối Quan Tâm** | Người dùng muốn tạo tài khoản để sử dụng các tính năng của sinh viên. Hệ thống cần xác minh email @ctu.edu.vn và tránh trùng lặp. |
| **Mô Tả Tóm Tắt** | Cho phép người dùng tạo tài khoản mới thông qua Email sinh viên và Mã số sinh viên (MSSV). |
| **Tiền Điều Kiện** | Người dùng chưa đăng nhập và đang ở trang Đăng Ký (/register). |
| **Các Mối Quan Hệ** | Association: Khách vãng lai (Guest) |

### Luồng Xử Lý Bình Thường
1. Người dùng truy cập trang đăng ký (/register).
2. Hệ thống hiển thị biểu mẫu với các trường: Họ tên, MSSV, Chọn Chi Hội, Email, Mật khẩu, Nhập lại mật khẩu.
3. Người dùng nhập đầy đủ thông tin.
4. Người dùng nhấp "Đăng Ký".
5. Hệ thống kiểm tra định dạng dữ liệu (email @ctu.edu.vn, mật khẩu ≥8 ký tự, MSSV).
6. Hệ thống kiểm tra Email hoặc MSSV đã tồn tại trong CSDL users chưa.
7. Hệ thống tạo tài khoản mới: hash password bcrypt, gán vai trò "Student", lưu vào database.
8. Hệ thống thông báo "✅ Đăng ký thành công! Vui lòng đăng nhập."
9. Chuyển hướng về trang Đăng Nhập (/login).

### Các Luồng Sự Kiện Con
**A1 - Tài Khoản Đã Tồn Tại:**
- 6. Hệ thống phát hiện Email hoặc MSSV đã được sử dụng.
- 7. Hệ thống thông báo: "❌ Email hoặc MSSV đã được sử dụng. Vui lòng kiểm tra lại hoặc đăng nhập."
- 8. Yêu cầu người dùng kiểm tra lại hoặc cung cấp liên kết "Bạn đã có tài khoản? Đăng nhập."

**A2 - Định Dạng Không Hợp Lệ:**
- 5. Hệ thống phát hiện lỗi định dạng (email không phải @ctu.edu.vn, mật khẩu < 8 ký tự, MSSV sai).
- 6. Hệ thống báo lỗi với message cụ thể cho từng trường.
- 7. Người dùng chỉnh sửa lại và gửi lại biểu mẫu.

**A3 - Chi Hội Không Hợp Lệ:**
- 4. Người dùng chọn Chi Hội không tồn tại hoặc không có sẵn.
- 5. Hệ thống thông báo: "⚠️ Chi Hội được chọn không hợp lệ. Vui lòng chọn lại."
- 6. Người dùng chọn Chi Hội khác từ danh sách.

### Luồng Đặc Biệt / Lỗi
**E1 - Lỗi Kết Nối / Hệ Thống:**
- Hệ thống không thể lưu dữ liệu do lỗi server (500 Internal Error).
- Hệ thống thông báo: "⚠️ Đã có lỗi xảy ra, vui lòng thử lại sau."
- Yêu cầu người dùng thử lại sau vài giây.

**E2 - Timeout Request:**
- Request gửi dữ liệu nhưng timeout (>30 giây).
- Hệ thống thông báo: "⏱️ Kết nối quá lâu. Vui lòng thử lại."
- Người dùng có thể thử lại.

### Kết Quả
- ✅ Tài khoản mới được tạo thành công với vai trò "Student".
- ✅ Người dùng được chuyển hướng đến trang đăng nhập.
- ✅ Email được lưu trong database với mật khẩu được hash bcrypt.

**Endpoint:** `POST /auth/register`  
**DTO:** RegisterDto (fullName, studentCode, email @ctu.edu.vn, password, unitId)

---

## UC_002: Đăng Nhập Tài Khoản

| Trường | Nội Dung |
|-------|---------|
| **Mã Yêu Cầu** | UC_002_DangNhap |
| **Tên Use Case** | Đăng nhập tài khoản |
| **Mức Độ Cần Thiết** | Cao |
| **Tác Nhân Chính** | Sinh Viên / Khách Vãng Lai |
| **Các Thành Phần Tham Gia & Mối Quan Tâm** | Sinh viên hoặc khách vãng lai muốn truy cập hệ thống. Hệ thống cần xác thực password và tạo JWT token. |
| **Mô Tả Tóm Tắt** | Cho phép cho phép người dùng đăng nhập bằng email và mật khẩu, nhận JWT token. |
| **Tiền Điều Kiện** | Tài khoản tồn tại, người dùng chưa đăng nhập. |
| **Các Mối Quan Hệ** | Extends: UC_001 (Đã tạo tài khoản) |

### Luồng Xử Lý Bình Thường
1. Người dùng truy cập trang đăng nhập (/login).
2. Hệ thống hiển thị biểu mẫu: Email, Mật khẩu.
3. Người dùng nhập Email và Mật khẩu.
4. Người dùng nhấp "Đăng Nhập".
5. Hệ thống gửi request `POST /auth/login` với email + password.
6. Backend: Kiểm tra tài khoản tồn tại trong database.
7. Backend: So sánh password (bcrypt) với hash trong database.
8. Backend: Xác nhận password đúng.
9. Backend: Kiểm tra user status = ACTIVE (không bị cấm).
10. Backend: Tạo JWT accessToken (15 phút) và refreshToken (7 ngày).
11. Frontend: Nhận token, lưu vào localStorage hoặc sessionStorage.
12. Frontend: Thông báo "✅ Đăng nhập thành công!"
13. Frontend: Chuyển hướng đến trang chủ (/activities).

### Các Luồng Sự Kiện Con
**A1 - Email Không Tồn Tại:**
- 6. Hệ thống không tìm thấy email trong database.
- 7. Hệ thống thông báo: "❌ Email hoặc mật khẩu không chính xác."
- 8. Yêu cầu người dùng kiểm tra lại hoặc đăng ký tài khoản mới.

**A2 - Mật Khẩu Sai:**
- 7. Backend: So sánh password nhưng không khớp.
- 8. Backend: Thông báo "❌ Email hoặc mật khẩu không chính xác."
- 9. Người dùng có thể thử lại hoặc yêu cầu đặt lại mật khẩu (nếu có tính năng).

**A3 - Tài Khoản Đã Bị Cấm (BANNED):**
- 9. Backend: Phát hiện user status = BANNED.
- 10. Backend: Thông báo: "⛔ Tài khoản của bạn đã bị khóa. Liên hệ quản trị viên để biết thêm chi tiết."
- 11. Người dùng không được đăng nhập.

### Luồng Đặc Biệt / Lỗi
**E1 - Lỗi Database / Server:**
- Backend không thể kết nối đến database.
- Thông báo: "⚠️ Lỗi hệ thống. Vui lòng thử lại sau."

**E2 - Token Generation Error:**
- JWT library lỗi khi tạo token.
- Thông báo: "⚠️ Không thể tạo phiên làm việc. Vui lòng thử lại."

### Kết Quả
- ✅ Người dùng đăng nhập thành công.
- ✅ JWT accessToken + refreshToken được tạo và gửi tới client.
- ✅ Frontend lưu token và hiển thị trạng thái đăng nhập.
- ✅ Người dùng được chuyển hướng đến trang chủ.

**Endpoint:** `POST /auth/login`  
**Response:** { accessToken, refreshToken, user }

---

## UC_003: Xem Danh Sách Hoạt Động

| Trường | Nội Dung |
|-------|---------|
| **Mã Yêu Cầu** | UC_003_XemHoatDong |
| **Tên Use Case** | Xem danh sách hoạt động |
| **Mức Độ Cần Thiết** | Cao |
| **Tác Nhân Chính** | Sinh Viên |
| **Các Thành Phần Tham Gia & Mối Quan Tâm** | Sinh viên muốn khám phá các hoạt động có sẵn. Hệ thống cần hiển thị danh sách phân trang với thông tin cơ bản. |
| **Mô Tả Tóm Tắt** | Hiển thị danh sách tất cả hoạt động published với phân trang. |
| **Tiền Điều Kiện** | Người dùng đã đăng nhập, đang ở trang hoạt động (/activities). |
| **Các Mối Quan Hệ** | Uses: UC_004 (Tìm kiếm), UC_007 (Đăng ký) |

### Luồng Xử Lý Bình Thường
1. Người dùng truy cập trang danh sách hoạt động (/activities).
2. Frontend: Gửi request `GET /activities?page=1&limit=20&status=PUBLISHED`.
3. Backend: Truy vấn database để lấy danh sách activities có status = PUBLISHED.
4. Backend: Sắp xếp theo startTime (hoạt động sắp tới trước).
5. Backend: Trả về danh sách tối đa 20 hoạt động per page, với thông tin:
   - Activity ID, Title, Description, Poster Image, Start Time, End Time, Location, Max Participants, Current Participants, Category
6. Frontend: Nhận dữ liệu và hiển thị dưới dạng danh sách card hoặc bảng.
7. Frontend: Hiển thị thông tin pagination: trang hiện tại, tổng số trang.
8. Người dùng xem danh sách và có thể:
   - Nhấp vào activity card để xem chi tiết (UC_003 extended)
   - Tìm kiếm hoạt động (UC_004)
   - Đăng ký hoạt động (UC_007)

### Các Luồng Sự Kiện Con
**A1 - Danh Sách Trống:**
- 3. Backend: Không tìm thấy hoạt động nào có status = PUBLISHED.
- 4. Frontend: Hiển thị thông báo "📭 Hiện không có hoạt động nào. Vui lòng quay lại sau."

**A2 - Trang Vượt Quá Giới Hạn:**
- 2. Frontend gửi page=100 nhưng chỉ có 5 trang.
- 4. Backend: Trả về danh sách trống hoặc trang cuối cùng.
- 5. Frontend: Hiển thị "⚠️ Trang không tồn tại."

**A3 - Yêu Cầu Phân Trang Tùy Chỉnh:**
- 2. Người dùng yêu cầu limit=50 (thay vì mặc định 20).
- 3. Backend: Trả về tối đa 50 hoạt động (nếu giới hạn cho phép).

### Luồng Đặc Biệt / Lỗi
**E1 - Database Slow Query:**
- Truy vấn database chậm (>5 giây).
- Frontend: Hiển thị loading spinner trong quá trình chờ.
- Nếu timeout (>30 giây): Thông báo lỗi.

**E2 - Lỗi Mạng / Network Error:**
- Request bị gián đoạn.
- Frontend: Hiển thị "❌ Lỗi tải dữ liệu. Vui lòng thử lại."
- Người dùng có thể thử lại.

### Kết Quả
- ✅ Danh sách hoạt động được hiển thị.
- ✅ Thông tin hoạt động chính xác và đầy đủ.
- ✅ Phân trang hoạt động chính xác.
- ✅ Người dùng có thể tương tác với danh sách.

**Endpoint:** `GET /activities?page=1&limit=20&status=PUBLISHED`  
**Response:** { activities: [], totalCount, page, limit }

---

## UC_004: Tìm Kiếm Hoạt Động

| Trường | Nội Dung |
|-------|---------|
| **Mã Yêu Cầu** | UC_004_TimKiemHoatDong |
| **Tên Use Case** | Tìm kiếm hoạt động |
| **Mức Độ Cần Thiết** | Cao |
| **Tác Nhân Chính** | Sinh Viên |
| **Các Thành Phần Tham Gia & Mối Quan Tâm** | Sinh viên muốn tìm hoạt động phù hợp với sở thích của mình. Hệ thống cần hỗ trợ tìm kiếm theo tên, danh mục, tổ chức. |
| **Mô Tả Tóm Tắt** | Cho phép sinh viên tìm kiếm hoạt động bằng từ khóa hoặc bộ lọc. |
| **Tiền Điều Kiện** | Người dùng đang ở danh sách hoạt động (/activities) hoặc trang tìm kiếm. |
| **Các Mối Quan Hệ** | Extends: UC_003 (Xem danh sách); Uses: UC_007 (Đăng ký) |

### Luồng Xử Lý Bình Thường
1. Người dùng thấy thanh tìm kiếm hoặc bộ lọc trên trang hoạt động.
2. Người dùng nhập từ khóa tìm kiếm hoặc chọn bộ lọc:
   - **Tìm kiếm:** Nhập tên hoạt động (vd: "Bóng chuyền", "Tình nguyện")
   - **Bộ lọc:** Danh mục (category), Tổ chức (unit), Trạng thái
3. Người dùng nhấp "Tìm Kiếm" hoặc chọn filter.
4. Frontend: Gửi request `GET /activities?search=volleyball&categoryId=5&unitId=2&status=PUBLISHED`.
5. Backend: Thực hiện ILIKE (case-insensitive) tìm kiếm trên title & description.
6. Backend: Áp dụng các filter (categoryId, unitId, status).
7. Backend: Trả về danh sách hoạt động phù hợp với phân trang.
8. Frontend: Hiển thị kết quả tìm kiếm.
9. Người dùng xem kết quả và có thể:
   - Xem chi tiết hoạt động
   - Đăng ký hoạt động
   - Tinh chỉnh tìm kiếm / bộ lọc

### Các Luồng Sự Kiện Con
**A1 - Không Tìm Thấy Kết Quả:**
- 7. Backend: Kiểm tra không có hoạt động nào phù hợp.
- 8. Frontend: Hiển thị "🔍 Không tìm thấy hoạt động nào. Thử lại với từ khóa khác."

**A2 - Kết Quả Quá Nhiều:**
- 7. Backend: Tìm thấy >100 kết quả.
- 8. Frontend: Hiển thị "ℹ️ Tìm thấy [X] kết quả. Tinh chỉnh tìm kiếm để xem rõ hơn."
- 9. Người dùng có thể sắp xếp hoặc lọc thêm.

**A3 - Only Date Range Filter:**
- 4. Người dùng chỉ chọn lọc theo khoảng thời gian (startDate đến endDate).
- 5. Backend: Trả về hoạt động trong khoảng thời gian đó.

### Luồng Đặc Biệt / Lỗi
**E1 - Invalid Filter Parameters:**
- 4. Frontend gửi categoryId không tồn tại.
- 5. Backend: Ignore filter và trả về danh sách tất cả.
- Hoặc 5. Backend: Thông báo lỗi "⚠️ Bộ lọc không hợp lệ."

**E2 - Search Index Error:**
- Full-text search index không available.
- Backend: Fallback tới ILIKE tìm kiếm thay thế (chậm hơn nhưng vẫn hoạt động).

### Kết Quả
- ✅ Kết quả tìm kiếm chính xác và liên quan.
- ✅ Bộ lọc được áp dụng đúng.
- ✅ Phân trang hoạt động trên kết quả tìm kiếm.
- ✅ Người dùng có thể dễ dàng tinh chỉnh tìm kiếm.

**Endpoint:** `GET /activities?search=<term>&categoryId=<id>&unitId=<id>&status=PUBLISHED`  
**Query Operators:** search (ILIKE), categoryId, unitId, status, page, limit

---

## UC_005: Quản Lý Hồ Sơ Cá Nhân

| Trường | Nội Dung |
|-------|---------|
| **Mã Yêu Cầu** | UC_005_QuanLyHoSoCaNhan |
| **Tên Use Case** | Quản lý hồ sơ cá nhân |
| **Mức Độ Cần Thiết** | Cao |
| **Tác Nhân Chính** | Sinh Viên |
| **Các Thành Phần Tham Gia & Mối Quan Tâm** | Sinh viên muốn cập nhật thông tin cá nhân, avatar, và chọn sở thích. Hệ thống cần lưu trữ thông tin này để dùng cho gợi ý. |
| **Mô Tả Tóm Tắt** | Cho phép sinh viên xem và chỉnh sửa thông tin hồ sơ, bao gồm sở thích. |
| **Tiền Điều Kiện** | Người dùng đã đăng nhập. |
| **Các Mối Quan Hệ** | Uses: UC_006 (Gợi ý AI - dùng sở thích này) |

### Luồng Xử Lý Bình Thường
1. Người dùng truy cập trang hồ sơ (/profile).
2. Frontend: Gửi request `GET /users/me/profile`.
3. Backend: Trả về thông tin user hiện tại (ID, email, fullName, studentCode, avatarUrl, unit, interests).
4. Frontend: Hiển thị thông tin hồ sơ trên form chỉnh sửa:
   - Họ tên, MSSV, Email, Chiều cao, Cân nặng (nếu có)
   - Avatar (ảnh đại diện)
   - Sở Thích (Multi-select checkbox)
5. Người dùng có thể:
   - Cập nhật avatar: chọn ảnh → upload → Cloudinary → lưu URL
   - Chỉnh sửa thông tin (họ tên, v.v.)
   - Chọn sở thích từ danh sách Sở thích có sẵn
6. Người dùng nhấp "Lưu Thay Đổi".
7. Frontend: Gửi request `PATCH /users/:id` với dữ liệu cập nhật.
8. Backend: Xác thực dữ liệu (format, độ dài tên, v.v.).
9. Backend: Cập nhật user table + user_interests table (xóa cũ, thêm mới).
10. Backend: Trả về thông báo thành công.
11. Frontend: Hiển thị "✅ Hồ sơ cập nhật thành công!"
12. Frontend: Làm mới dữ liệu hiển thị.

### Các Luồng Sự Kiện Con
**A1 - Cập Nhật Avatar:**
- 5. Người dùng chọn file ảnh từ máy tính.
- 6. Frontend: Upload ảnh đến Cloudinary (thông qua backend).
- 7. Backend: Nhận URL ảnh từ Cloudinary.
- 8. Backend: Cập nhật avatarUrl trong user table.

**A2 - Xóa Avatar:**
- 5. Người dùng click "Xóa Avatar".
- 6. Backend: Set avatarUrl = null / mặc định avatar.

**A3 - Chỉnh Sửa Từng Sở Thích:**
- 5. Người dùng uncheck "Tình nguyện" nhưng check "Thể thao".
- 9. Backend: Xóa "Tình nguyện" từ user_interests, thêm "Thể thao".

### Luồng Đặc Biệt / Lỗi
**E1 - Avatar Quá Lớn:**
- 6. File ảnh >5MB.
- Frontend: "❌ Ảnh quá lớn (tối đa 5MB)."

**E2 - Email Trùng Lặp (khi chỉnh sửa):**
- 8. Backend: Detect email mới đã được dùng bởi user khác.
- 9. Backend: Thông báo "❌ Email này đã được sử dụng."

**E3 - Timeout Khi Upload Avatar:**
- Upload ảnh >30 giây.
- Frontend: "⏱️ Upload timeout. Vui lòng thử lại."

### Kết Quả
- ✅ Hồ sơ cá nhân được cập nhật chính xác.
- ✅ Avatar được lưu trên Cloudinary.
- ✅ Sở thích được cập nhật trong database.
- ✅ Thông tin hồ sơ được dùng cho gợi ý AI.

**Endpoints:**  
- `GET /users/me/profile` - Lấy hồ sơ  
- `PATCH /users/:id` - Cập nhật thông tin  
- `PATCH /users/:id/interests` - Cập nhật sở thích  
- `POST /cloudinary/upload` - Upload avatar

---

## UC_006: Xem Gợi Ý Hoạt Động từ AI

| Trường | Nội Dung |
|-------|---------|
| **Mã Yêu Cầu** | UC_006_XemGoiYAI |
| **Tên Use Case** | Xem gợi ý hoạt động từ AI |
| **Mức Độ Cần Thiết** | Cao |
| **Tác Nhân Chính** | Sinh Viên |
| **Các Thành Phần Tham Gia & Mối Quan Tâm** | Sinh viên muốn nhận gợi ý hoạt động dựa trên sở thích của họ. Hệ thống AI (FastAPI) cần tính toán độ tương tự giữa sở thích và hoạt động. |
| **Mô Tả Tóm Tắt** | Lấy hoạt động được gợi ý từ recommendation engine dựa trên sở thích của sinh viên. |
| **Tiền Điều Kiện** | Người dùng đã đăng nhập, đã chọn sở thích trong hồ sơ (UC_005). |
| **Các Mối Quan Hệ** | Depends: UC_005 (Sở thích); Uses: UC_007 (Đăng ký) |

### Luồng Xử Lý Bình Thường
1. Người dùng truy cập trang gợi ý (/ai-recommendations).
2. Người dùng nhấp "Lấy Gợi Ý Cho Tôi".
3. Frontend: Gửi request `GET /activities/recommendations/:userId`.
4. Backend: Nhận request, truy vấn user interests từ database.
5. Backend: Gọi FastAPI Recommendation Service với user ID.
6. FastAPI Service:
   - Tạo user preference vector từ interests (vd: onehot encoding)
   - Tính similarity giữa user vector và tất cả activities vectors
   - Sắp xếp theo similarity score (từ cao đến thấp)
   - Trả về top 10 hoạt động
7. Backend: Nhận kết quả từ FastAPI, lọc các hoạt động có status=PUBLISHED.
8. Backend: Trả về danh sách gợi ý với scores.
9. Frontend: Hiển thị 10 hoạt động được gợi ý với thông tin:
   - Title, Poster, Category, Similarity Score (%), Start Time, Location
10. Người dùng xem gợi ý và có thể:
    - Đăng ký hoạt động (UC_007)
    - Xem chi tiết hoạt động
    - Refresh gợi ý

### Các Luồng Sự Kiện Con
**A1 - Người Dùng Không Có Sở Thích:**
- 4. Backend: Phát hiện user chưa chọn sở thích.
- 5. Frontend: Thông báo "⚠️ Vui lòng chọn sở thích trước. [Link tới UC_005]"
- 6. Chuyển hướng người dùng tới UC_005.

**A2 - Hoạt Động Gợi Ý Quá Ít:**
- 7. FastAPI: Tìm thấy chỉ 3 hoạt động phù hợp (< 10).
- 8. Backend: Trả về 3 hoạt động này (không đủ 10).
- 9. Frontend: Hiển thị kết quả + "ℹ️ Chỉ tìm thấy [X] hoạt động phù hợp."

**A3 - Sắp Xếp Theo Trường Khác:**
- 6. User yêu cầu sắp xếp theo: start time, location, category.
- 7. FastAPI: Trả về gợi ý đã sắp xếp theo tiêu chí khác.

### Luồng Đặc Biệt / Lỗi
**E1 - FastAPI Service Down:**
- 5. Backend không thể kết nối tới FastAPI (port 8001).
- 6. Backend: Log error, trả về fallback: danh sách hoạt động ngẫu nhiên hoặc mới nhất.
- 7. Frontend: Thông báo "⚠️ Không thể tạo gợi ý lúc này. Hiển thị hoạt động được yêu thích nhất."

**E2 - Timeout Tính Toán:**
- Recommendation engine tính toán >10 giây (nhiều hoạt động, nhiều users).
- Frontend: Hiển thị spinner + "Đang tính toán gợi ý cho bạn..."
- Nếu >30 giây: Thông báo lỗi.

**E3 - User Vector Error:**
- FastAPI lỗi khi tạo preference vector (dimension mismatch).
- Backend: Log error và fallback.

### Kết Quả
- ✅ Gợi ý hoạt động được hiển thị dích xác dựa trên sở thích.
- ✅ Danh sách gợi ý có top 10 hoạt động.
- ✅ Người dùng có thể đăng ký liền từ gợi ý.
- ✅ Fallback graceful nếu recommendation service lỗi.

**Endpoints:**  
- `GET /activities/recommendations/:userId` - Lấy gợi ý  
- **FastAPI:** `/recommend?user_id=<id>` - Tính toán gợi ý

---

## UC_007: Đăng Ký Tham Gia Hoạt Động

| Trường | Nội Dung |
|-------|---------|
| **Mã Yêu Cầu** | UC_007_DangKyHoatDong |
| **Tên Use Case** | Đăng ký tham gia hoạt động |
| **Mức Độ Cần Thiết** | Cao |
| **Tác Nhân Chính** | Sinh Viên |
| **Các Thành Phần Tham Gia & Mối Quan Tâm** | Sinh viên muốn đăng ký tham gia hoạt động. Hệ thống cần kiểm tra xung đột lịch, không trùng lặp, còn slot. |
| **Mô Tả Tóm Tắt** | Cho phép sinh viên đăng ký tham gia hoạt động với kiểm tra xung đột lịch. |
| **Tiền Điều Kiện** | Người dùng đã đăng nhập, hoạt động có status=PUBLISHED, còn slot trống, chưa đăng ký. |
| **Các Mối Quan Hệ** | Uses: UC_008 (Tiến độ - cập nhật); Uses: UC_009, UC_010 (Điểm danh) |

### Luồng Xử Lý Bình Thường
1. Người dùng xem hoạt động (UC_003, UC_004, hoặc UC_006).
2. Người dùng nhấp "Đăng Ký" trên activity card.
3. Frontend: Hiển thị bước xác nhận hoặc form chi tiết dự kiến.
4. Frontend: Gửi request `PATCH /registrations` (hoặc `POST /registrations`) với:
   - userId, activityId
5. Backend (RegistrationsService):
   - Kiểm tra: Activity có status=PUBLISHED?
   - Kiểm tra: User chưa đăng ký activity này chưa (unique constraint)?
   - Kiểm tra: Còn slot trống (currentParticipants < maxParticipants)?
   - **Kiểm tra xung đột lịch:** CalendarService.hasConflict(userId, activityStartTime, activityEndTime)?
     - Có xung đột? → Nhảy A1
6. Backend: Nếu tất cả kiểm tra pass, tạo registration entry:
   - status = PENDING (chờ check-in)
   - proofStatus = PENDING (chờ chứng minh)
   - createdAt = now()
7. Backend: Cập nhật activity.currentParticipants += 1.
8. Backend: Cập nhật user_activity_schedule (add to calendar).
9. Backend: Cập nhật user_criteria.progressCount += 1 (nếu activity liên kết criteria).
10. Backend: Trả về thông báo thành công.
11. Frontend: Thông báo "✅ Đã đăng ký hoạt động! [Activity Name]"
12. Frontend: Cập nhật UI (nút "Đăng Ký" → "Đã Đăng Ký" hoặc "Hủy Đăng Ký").
13. Frontend: (Optional) Thêm hoạt động vào lịch của người dùng.

### Các Luồng Sự Kiện Con
**A1 - Xung Đột Lịch:**
- 5. CalendarService phát hiện user đã có hoạt động khác trong thời gian này.
- 6. Backend: Thông báo "⚠️ Hoạt động này xung đột với hoạt động khác trong lịch của bạn ([Existing Activity Name])."
- 7. User có thể: Hủy đăng ký hoạt động khác, hoặc chọn không đăng ký.

**A2 - Không Còn Slot:**
- 5. currentParticipants >= maxParticipants.
- 6. Backend: Thông báo "❌ Hoạt động này đã đầy. Không còn slot trống."
- 7. (Optional) User có thể thêm vào danh sách chờ (waitlist).

**A3 - Đã Đăng Ký Rồi:**
- 5. Backend phát hiện registration đã tồn tại.
- 6. Backend: "ℹ️ Bạn đã đăng ký hoạt động này rồi."

**A4 - Hoạt Động Đã Kết Thúc:**
- 5. Activity.startTime < now().
- 6. Backend: "❌ Hoạt động này đã kết thúc, không còn đăng ký được."

### Luồng Đặc Biệt / Lỗi
**E1 - Concurrency: Slot Đầy Vừa Lúc:**
- 5. Race condition: hai user đăng ký cùng lúc, chỉ còn 1 slot.
- Backend: Database constraint (CHECK hoặc logic) để ngăn chặn.
- Một user nhận thông báo thành công, user kia nhận "❌ Không còn slot."

**E2 - Transaction Rollback:**
- Calendar conflict check hoặc update database lỗi.
- Backend: Rollback toàn bộ transaction, thông báo lỗi.
- Frontend: "⚠️ Đăng ký thất bại. Vui lòng thử lại."

### Kết Quả
- ✅ Registration entry được tạo với status=PENDING.
- ✅ User được thêm vào danh sách participants.
- ✅ Hoạt động được thêm vào lịch của user.
- ✅ Tiến độ criteria được cập nhật.
- ✅ Người dùng nhận xác nhận đăng ký thành công.

**Endpoint:** `POST /registrations` hoặc `PATCH /registrations`  
**DTO:** { userId, activityId }  
**Business Logic:** Conflict check, slot validation, cascade updates

---

## UC_008: Theo Dõi Tiến Độ Rèn Luyện SV5T

| Trường | Nội Dung |
|-------|---------|
| **Mã Yêu Cầu** | UC_008_TheoDoiTienDo |
| **Tên Use Case** | Theo dõi tiến độ rèn luyện SV5T |
| **Mức Độ Cần Thiết** | Cao |
| **Tác Nhân Chính** | Sinh Viên |
| **Các Thành Phần Tham Gia & Mối Quan Tâm** | Sinh viên muốn theo dõi tiến độ kiếm SV5T. Hệ thống cần tính toán % hoàn thành dựa trên criteria (học tập, tình nguyện, thể thao, v.v.). |
| **Mô Tả Tóm Tắt** | Hiển thị tiến độ SV5T của sinh viên với progress bar cho từng criteria. |
| **Tiền Điều Kiện** | Người dùng đã đăng nhập, đã tham gia ≥1 hoạt động. |
| **Các Mối Quan Hệ** | Updated by: UC_007, UC_009, UC_010 (Đăng ký & điểm danh cập nhật tiến độ) |

### Luồng Xử Lý Bình Thường
1. Người dùng truy cập trang tiến độ SV5T (/progress hoặc /sv5t-progress).
2. Frontend: Gửi request `GET /student-progress/:userId`.
3. Backend (StudentProgressService):
   - Truy vấn tất cả user_criteria records cho user này.
   - Cho mỗi criterion (Học Tập, Tình Nguyện, Thể Thao, Phó Tá, Văn Hóa):
     - Tính totalRequired (mục tiêu điểm/count cần đạt)
     - Tính currentProgress (điểm/count hiện tại từ verified registrations)
     - Tính percentage = (currentProgress / totalRequired) * 100
     - Xác định status: PENDING, IN_PROGRESS, COMPLETED
4. Backend: Trả về tổng hợp SV5T:
   - Số criteria đã hoàn thành
   - Tổng % hoàn thành
   - List chi tiết mỗi criterion
5. Frontend: Hiển thị dashboard SV5T:
   - Overall progress (circle progress hoặc bar)
   - Chi tiết từng criteria với progress bar
   - Số hoạt động cần thiết còn lại cho mỗi criterion
6. Người dùng xem ticket danh sách:
   - ✅ Hoàn thành
   - 🔄 Đang tiến hành
   - ⏳ Chưa bắt đầu

### Các Luồng Sự Kiện Con
**A1 - Người Dùng Vừa Đăng Ký (Chưa Điểm Danh):**
- 3. Registration.proofStatus = PENDING (chưa verify).
- 4. Backend: Không tính vào progress (chỉ tính verified registrations).
- 5. Frontend: Hiển thị "🔄 Chờ điểm danh..."

**A2 - Người Dùng Đã Đạt SV5T:**
- 2. Tất cả criteria đổi status = COMPLETED.
- 4. Overall % = 100%.
- 5. Frontend: Hiển thị "🎉 Chúc mừng! Bạn đã đạt SV5T!"

**A3 - Người Dùng Mới (Chưa Có Progress):**
- 3. Không tìm thấy user_criteria records.
- 4. Backend: Tạo default records cho tất cả criteria với progress=0.
- 5. Frontend: Hiển thị tất cả criteria ở 0%.

### Luồng Đặc Biệt / Lỗi
**E1 - Calculation Error:**
- Criterion requirement bị xóa hoặc sai format.
- Backend: Error handling, fallback về 0 hoặc cached value.

**E2 - Database Slow Query:**
- Truy vấn progress >5 giây.
- Frontend: Hiển thị loading skeleton.

### Kết Quả
- ✅ Tiến độ SV5T hiển thị chính xác.
- ✅ Progress bar cập nhật real-time sau mỗi điểm danh verified.
- ✅ Người dùng biết cần bao nhiêu hoạt động nữa.
- ✅ Dashboard thân thiện, dễ theo dõi.

**Endpoint:** `GET /student-progress/:userId`  
**Calculation Logic:** StudentProgressService.calculateProgress()

---

## UC_009: Điểm Danh Theo Hình Ảnh

| Trường | Nội Dung |
|-------|---------|
| **Mã Yêu Cầu** | UC_009_DiemDanhHinh |
| **Tên Use Case** | Điểm danh hoạt động theo hình ảnh |
| **Mức Độ Cần Thiết** | Cao |
| **Tác Nhân Chính** | Sinh Viên |
| **Các Thành Phần Tham Gia & Mối Quan Tâm** | Sinh viên muốn upload ảnh chứng minh tham gia hoạt động. Hệ thống cần lưu trữ ảnh và chưa verified = pending. |
| **Mô Tả Tóm Tắt** | Cho phép sinh viên upload ảnh chứng minh tham gia hoạt động (chờ phê duyệt). |
| **Tiền Điều Kiện** | Người dùng đã đăng ký hoạt động (UC_007), hoạt động đã kết thúc hoặc đang diễn ra. |
| **Các Mối Quan Hệ** | Uses: UC_016 (Phê duyệt minh chứng - admin verify); Updates: UC_008 |

### Luồng Xử Lý Bình Thường
1. Người dùng truy cập trang hoạt động hoặc "Chứng Minh Của Tôi" (/my-proofs).
2. Người dùng thấy registration có status=PENDING, proofStatus=PENDING.
3. Người dùng nhấp "Upload Chứng Minh" hoặc "Upload Ảnh".
4. Frontend: Hiển thị file upload dialog.
5. Người dùng chọn ảnh JPG/PNG từ máy tính (tối đa 5MB).
6. Frontend: Hiển thị preview ảnh.
7. Người dùng nhấp "Xác Nhận Upload" hoặc "Tiếp Tục".
8. Frontend: Upload ảnh đến backend, backend forward tới Cloudinary.
9. Backend: Nhận URL ảnh từ Cloudinary.
10. Backend: Cập nhật registration:
    - proofUrl = cloudinary_url
    - proofSubmittedAt = now()
    - proofStatus = PENDING (chờ admin verify)
11. Backend: Trả về thông báo thành công.
12. Frontend: "✅ Đã tải lên chứng minh! Chờ admin xác minh."
13. Frontend: Hiển thị trạng thái "⏳ Chờ Xác Minh" trên registration.
14. (Backend Background) Gửi notification cho admin/LCH: "1 chứng minh mới cần xác minh."

### Các Luồng Sự Kiện Con
**A1 - Cập Nhật Ảnh (Thay Thế):**
- 10. User upload ảnh mới nhưng proofStatus đã từng = PENDING.
- 11. Backend: Thay thế URL cũ bằng URL mới từ Cloudinary.
- 12. Notification: Admin được thông báo cập nhật.

**A2 - Ảnh Bị Từ Chối, Upload Lại:**
- 10. Registration.proofStatus = REJECTED (admin từ chối ở UC_016).
- User có thể upload ảnh mới.
- 15. Backend: Cập nhật proofUrl, lần lượt proofStatus = PENDING, gửi lại notification.

**A3 - Multiple Images (Nếu Supports):**
- 5. User chọn nhiều ảnh (gallery upload).
- 9. Backend: Lưu tất cả URLs (hoặc chỉ lưu 1 ảnh chính + others in JSON array).

### Luồng Đặc Biệt / Lỗi
**E1 - Ảnh Quá Lớn:**
- 5. File >5MB.
- Frontend: "❌ Ảnh quá lớn (Max 5MB). Vui lòng chọn ảnh khác."

**E2 - Format Ảnh Không Hợp Lệ:**
- 5. File là .exe, .pdf, v.v. (không phải ảnh).
- Frontend: "⚠️ Chỉ chấp nhận ảnh JPG/PNG."

**E3 - Cloudinary Upload Error:**
- 8. Cloudinary trả về lỗi (quota exceeded, v.v.).
- Backend: "❌ Không thể upload ảnh. Vui lòng thử lại sau."

**E4 - Duplicate Upload:**
- User upload cùng ảnh 2 lần.
- Backend: Có thể check file hash để detect, hoặc cho phép upload (cover lần trước).

### Kết Quả
- ✅ Ảnh chứng minh được upload thành công.
- ✅ Ảnh lưu trên Cloudinary.
- ✅ Registration.proofStatus = PENDING, chờ verify.
- ✅ Admin/LCH được thông báo.
- ✅ Người dùng có thể theo dõi trạng thái verify.

**Endpoint:** `PATCH /registrations/:id/proof`  
**DTO:** { proofFile }  
**Storage:** Cloudinary CDN

---

## UC_010: Điểm Danh Theo QR Code

| Trường | Nội Dung |
|-------|---------|
| **Mã Yêu Cầu** | UC_010_DiemDanhQR |
| **Tên Use Case** | Điểm danh hoạt động theo QR code |
| **Mức Độ Cần Thiết** | Cao |
| **Tác Nhân Chính** | Sinh Viên |
| **Các Thành Phần Tham Gia & Mối Quan Tâm** | Sinh viên muốn quét QR code để điểm danh. QR contains HMAC signature + timestamp để xác minh. Hệ thống auto-verify nếu signature hợp lệ. |
| **Mô Tả Tóm Tắt** | Cho phép sinh viên quét QR code để tự động điểm danh hoạt động. |
| **Tiền Điều Kiện** | Người dùng đã đăng ký hoạt động (UC_007), hoạt động đang diễn ra, QR code được hiển thị (UC_014). |
| **Các Mối Quan Hệ** | Uses: UC_014 (QR Display); Updates: UC_008, UC_009 (Auto-verify proof) |

### Luồng Xử Lý Bình Thường
1. Admin/BCH Chi Hội hiển thị QR code trên projector tại địa điểm hoạt động (UC_014).
   - QR chứa: `/checkin?activityId=123&timestamp=1618000000&signature=abc123xyz`
2. Sinh viên dùng camera điện thoại để quét QR code.
3. Browser tự động mở link QR → FE route /checkin.
4. Frontend: Parse URL parameters (activityId, timestamp, signature).
5. Frontend: Gửi request `PATCH /registrations/check-in`:
   ```json
   {
     "activityId": 123,
     "userId": "user-uuid",
     "timestamp": 1618000000,
     "signature": "abc123xyz"
   }
   ```
6. Backend (CheckInService):
   - Lấy `qrSecret` từ activity.
   - Tính HMAC-SHA256: message = `${activityId}:${timestamp}`, key = `qrSecret`.
   - Compare: HMAC computed === signature từ URL?
     - **Không match?** → Thông báo "❌ QR không hợp lệ hoặc đã hết hạn."
   - Verify timestamp: |now - timestamp| <= 15 minutes?
     - **Quá lâu?** → Thông báo "⏰ QR đã hết hạn. Vui lòng scan QR mới."
7. Backend: Nếu cả hai check pass:
   - Tìm registration (userId, activityId).
   - Cập nhật:
     - proofStatus = VERIFIED (tự động, không cần approve)
     - checkInAt = now()
     - qrSignature = signature (cho audit trail)
8. Backend: Cập nhật user_criteria.progressCount += 1 (nếu chưa tính).
9. Backend: Trả về thành công.
10. Frontend: Hiển thị "✅ Điểm danh thành công! [Activity Name]"
11. Frontend: Cập nhật progress (nếu có real-time sync).

### Các Luồng Sự Kiện Con
**A1 - Registration Không Tồn Tại:**
- 6. User scan QR nhưng chưa đăng ký hoạt động này.
- 7. Backend: "❌ Bạn chưa đăng ký hoạt động này. Vui lòng đăng ký trước."

**A2 - QR Được Scan Ngoài Khung Thời Gian:**
- 6. Timestamp check fail (ví dụ: 2 ngày sau hoạt động kết thúc).
- 7. Backend: "⏰ QR này không còn hợp lệ."

**A3 - User Đã Điểm Danh Rồi:**
- 7. Registration.checkInAt đã có giá trị (điểm danh lần 1 thành công).
- 8. Backend: "ℹ️ Bạn đã điểm danh rồi. Không cần scan lại."
- (Hoặc allow rescan để update checkInAt)

**A4 - QR Secret Thay Đổi:**
- 6. Admin thay đổi activity.qrSecret sau khi QR được generate.
- 7. HMAC mismatch → "❌ QR không hợp lệ."

### Luồng Đặc Biệt / Lỗi
**E1 - QR Code Corrupt:**
- 4. URL parse thất bại (malformed query string).
- Frontend: "❌ QR code bị hỏng hoặc không hợp lệ."

**E2 - Signature Attack / Tampering:**
- 4. Hacker chỉnh sửa timestamp hoặc signature trong URL.
- 6. HMAC mismatch → Backend reject.
- Log security event.

**E3 - Clock Skew:**
- Server time khác client time >15 phút.
- QR legitimate nhưng timestamp check fail.
- Backend: Có thể allow ±15 min tolerance.

**E4 - Multiple Scan Attempts (Spam):**
- 4. User scan cùng QR 100 lần trong 1 giây.
- Backend: Rate limiting để prevent abuse.

### Kết Quả
- ✅ QR signature verified thành công.
- ✅ Registration.proofStatus = VERIFIED (tự động).
- ✅ checkInAt timestamp được lưu.
- ✅ Tiến độ criterion được cập nhật ngay lập tức.
- ✅ Sinh viên nhận xác nhận điểm danh.
- ✅ Không cần admin phê duyệt.

**Endpoint:** `PATCH /registrations/check-in`  
**Security:** HMAC-SHA256 signature + timestamp verification  
**QR Generation:** [QrService](ctu-activity-backend/src/cores/qr/qr.service.ts)

---

## UC_011: Lịch Hoạt Động (Sinh Viên)

| Trường | Nội Dung |
|-------|---------|
| **Mã Yêu Cầu** | UC_011_LichHoatDong |
| **Tên Use Case** | Xem lịch hoạt động đã đăng ký |
| **Mức Độ Cần Thiết** | Cao |
| **Tác Nhân Chính** | Sinh Viên |
| **Các Thành Phần Tham Gia & Mối Quan Tâm** | Sinh viên muốn xem lịch tất cả hoạt động mà họ đã đăng ký trên một calendar view. Hệ thống cần hiển thị hoạt động sắp tới, đang diễn ra, và đã kết thúc. |
| **Mô Tả Tóm Tắt** | Hiển thị lịch (calendar) các hoạt động đã đăng ký của sinh viên với trạng thái từng hoạt động. |
| **Tiền Điều Kiện** | Người dùng đã đăng nhập, đã đăng ký ≥1 hoạt động. |
| **Các Mối Quan Hệ** | Related: UC_007 (Đăng ký hoạt động); Related: UC_008 (Tiến độ) |

### Luồng Xử Lý Bình Thường
1. Người dùng truy cập trang "Lịch Hoạt Động" (/calendar hoặc /my-calendar).
2. Frontend: Gửi request `GET /user-activity-schedule?userId=<id>&startDate=<date>&endDate=<date>`.
3. Backend: Truy vấn user_activity_schedule + activity details cho khoảng thời gian (tháng hiện tại).
4. Backend: Eager load relationships: Activity (title, time, location, status, criteria), Registration (proofStatus, checkInAt).
5. Backend: Trả về danh sách activities với thời gian chi tiết.
6. Frontend: Hiển thị dưới dạng Calendar (full month view theo tuần):
   - Week view: Các hoạt động hiển thị trên các ngày tương ứng
   - Color coding: Xanh (sắp tới), Xám (đang diễn ra), Xanh đậm (đã kết thúc + verified), Vàng (chờ verify)
   - Thông tin mỗi activity: Tên, Giờ, Địa Điểm, Status badge
7. Frontend: Cho phép chuyển đổi view:
   - Month view (hiện tại)
   - Week view (zoom in)
   - List view (dạng danh sách + timeline)
8. Người dùng có thể:
   - Click vào activity trên calendar để xem chi tiết
   - Xem toàn bộ hoạt động của tháng/tuần
   - Chuyển tháng/tuần trước/sau
   - Xem hôm nay (highlight)
9. Cho mỗi activity trên calendar, hiển thị badge:
   - "📅 Sắp Tới" (startTime > now)
   - "🔴 Đang Diễn Ra" (startTime <= now < endTime)
   - "✅ Verified" (proofStatus = VERIFIED)
   - "⏳ Chờ Verify" (proofStatus = PENDING)
   - "❌ Rejected" (proofStatus = REJECTED)

### Các Luồng Sự Kiện Con
**A1 - Lịch Trống (No Registrations):**
- 3. User không có registration nào.
- 6. Frontend: "📭 Bạn chưa đăng ký hoạt động nào. [Link tới UC_003]"

**A2 - Navigation By Month/Year:**
- 8. User click nút "Tháng Tiếp" hoặc chọn tháng/năm từ dropdown.
- 2. Frontend gửi request với startDate, endDate mới.
- 3. Backend: Query activities cho khoảng thời gian mới.
- 6. Frontend: Update calendar view.

**A3 - Multiple Activities Same Day:**
- 6. Frontend: Multiple activities hiển thị cùng ngày.
- 7. Hiển thị dạng stacked hoặc "1 more..." link để expand.

**A4 - Week Zoom View:**
- 7. User click "Week View" hoặc double-click một ngày.
- 6. Frontend: Hiển thị 7 ngày chi tiết (hourly view).
- 8. Activities xếp hàng ngang theo giờ (timeline).

**A5 - Filter By Status:**
- 7. User click filter "Only Verified" hoặc "Chỉ Chờ Verify".
- 2. Frontend: `GET /user-activity-schedule?userId=X&proofStatus=VERIFIED`.
- Backend: Filter registrations theo proofStatus.

### Luồng Đặc Biệt / Lỗi
**E1 - Calendar Data Too Large:**
- Lịch có 100+ hoạt động trong tháng.
- Frontend: Paginate hoặc lazy load activities khi scroll.

**E2 - Activity Bị Xóa:**
- Activity của registration đã bị delete.
- Backend: Trả về null hoặc cached activity info.
- Frontend: Hiển thị "Activity Deleted" placeholder.

**E3 - Timezone Issue:**
- User ở timezone khác server.
- Frontend: Convert activity time dựa trên user's local timezone.

### Kết Quả
- ✅ Calendar hiển thị tất cả hoạt động được đăng ký.
- ✅ Status badge rõ ràng cho từng hoạt động.
- ✅ User có thể dễ dàng thấy tất cả commitments.
- ✅ Dễ dàng điều hướng giữa các tháng/tuần.
- ✅ Color coding giúp phân biệt nhanh trạng thái.

**Endpoint:** `GET /user-activity-schedule?userId=<id>&startDate=<date>&endDate=<date>`  
**Response:** { activities: [{...activity, status, proofStatus, checkInAt}] }  
**Frontend:** Calendar library (FullCalendar.io hoặc similar)

---

# BCH CHI HỘI - USE CASES (UC_012-014)

## UC_012: Quản Lý Hoạt Động

| Trường | Nội Dung |
|-------|---------|
| **Mã Yêu Cầu** | UC_012_QuanLyHoatDong |
| **Tên Use Case** | Quản lý hoạt động |
| **Mức Độ Cần Thiết** | Cao |
| **Tác Nhân Chính** | BCH Chi Hội (Club Board) |
| **Các Thành Phần Tham Gia & Mối Quan Tâm** | BCH Chi Hội muốn tạo, chỉnh sửa, xóa, phát hành hoạt động. Hệ thống cần quản lý vòng đời hoạt động từ PENDING → PUBLISHED → COMPLETED. |
| **Mô Tả Tóm Tắt** | Cho phép BCH Chi Hội tạo & quản lý hoạt động, chờ phê duyệt từ LCH. |
| **Tiền Điều Kiện** | Người dùng đã đăng nhập với vai trò CH (Club Head). |
| **Các Mối Quan Hệ** | Uses: UC_015 (Phê duyệt từ LCH); Used by: UC_003, UC_004 |

### Luồng Xử Lý Bình Thường
1. BCH Chi Hội truy cập trang Quản Lý Hoạt Động (/admin/activities hoặc /ch/activities).
2. Frontend: Gửi request `GET /activities?createdBy=<ch-id>&all-statuses`.
3. Backend: Trả về danh sách hoạt động do CH này tạo, với tất cả statuses (PENDING, PUBLISHED, COMPLETED).
4. Frontend: Hiển thị bảng danh sách với cột: Tên, Thời Gian, Trạng Thái, Hành Động.

**A. Tạo Hoạt Động Mới:**
1. CH nhấp "Tạo Hoạt Động Mới".
2. Frontend: Hiển thị form tạo hoạt động:
   - Title, Description, Poster Image, Location
   - Start Time, End Time, Max Participants
   - Category, Tags (Multi-select)
   - Criteria Group (liên kết criteria nào để rèn luyện)
3. CH nhập thông tin.
4. CH chọn Poster Image từ máy tính.
5. Frontend: Preview ảnh.
6. CH nhấp "Tạo Hoạt Động".
7. Frontend: Gửi `POST /activities` với MultipartFormData (file + metadata).
8. Backend:
   - Validate dữ liệu (title not empty, startTime < endTime, v.v.).
   - Upload poster image tới Cloudinary, nhận URL.
   - Tạo activity entry:
     - status = PENDING (chờ phê duyệt LCH)
     - createdBy = ch-id
     - posterUrl = cloudinary_url
   - Generate qrSecret & qrCodeUrl.
   - Associate tags & criteria.
9. Backend: Return thành công với activity ID.
10. Frontend: Thông báo "✅ Hoạt động được tạo thành công! Chờ phê duyệt từ LCH."
11. Frontend: Redirect tới chi tiết hoạt động hoặc danh sách.
12. (Background) Gửi notification cho LCH: "1 hoạt động mới cần duyệt."

**B. Chỉnh Sửa Hoạt Động (Nếu Chưa Published):**
1. CH click "Sửa" trên activity (status=PENDING).
2. Frontend: Populate form với dữ liệu hiện tại.
3. CH thay đổi thông tin.
4. CH nhấp "Lưu".
5. Frontend: Gửi `PATCH /activities/:id`.
6. Backend: Validate & update activity.
7. Frontend: "✅ Cập nhật thành công!"

**C. Xóa Hoạt Động (Nếu Chưa Published):**
1. CH click "Xóa" (only for PENDING activities).
2. Frontend: Hiển thị confirm dialog.
3. CH xác nhận.
4. Frontend: Gửi `DELETE /activities/:id`.
5. Backend: Soft delete activity (hoặc hard delete nếu chưa có registrations).
6. Frontend: "✅ Hoạt động đã xóa."

**D. Xem Trạng Thái Phê Duyệt:**
1. CH click vào activity có status=PENDING.
2. Frontend: Hiển thị chi tiết + "⏳ Chờ phê duyệt từ LCH."
3. Backend: Thông báo "Phê duyệt bởi: [LCH Name]" khi status chuyển thành PUBLISHED.

### Các Luồng Sự Kiện Con
**A1 - Thay Đổi Hoạt Động Sau Khi Published:**
- CH muốn chỉnh sửa hoạt động (status=PUBLISHED).
- Backend: Chỉ cho phép chỉnh sửa tên, mô tả (không thay startTime, endTime).
- Hoặc: Không cho phép chỉnh sửa, yêu cầu hủy & tạo mới.

**A2 - Số Lượng Participants Đạt Max:**
- Hoạt động có 50/50 participants.
- Frontend: Hiển thị "📊 Đầy ([X]/[X]) - Không thể đăng ký."

**A3 - Multiple Hoạt Động Cùng Lúc:**
- CH tạo 5 hoạt động trong 1 tuần.
- Backend: Tồn tại tất cả, có thể filter theo status.

### Luồng Đặc Biệt / Lỗi
**E1 - Poster Upload Quá Lớn:**
- File >5MB.
- Frontend: "❌ Ảnh quá lớn (Max 5MB)."

**E2 - Invalid Time Range:**
- startTime >= endTime.
- Frontend: "⚠️ Thời gian kết thúc phải sau thời gian bắt đầu."

**E3 - Duplicate Activity:**
- CH tạo 2 hoạt động có cùng title, time, location.
- Backend: Allow hoặc warning.

**E4 - Cloudinary Quota Exceeded:**
- Upload poster fail do Cloudinary quota.
- Backend: "❌ Không thể upload ảnh. Liên hệ admin."

### Kết Quả
- ✅ Hoạt động được tạo với status=PENDING.
- ✅ Poster image được upload & lưu.
- ✅ QR code được generate.
- ✅ LCH được thông báo phê duyệt.
- ✅ CH có thể chỉnh sửa hoạt động chưa publish.

**Endpoints:**  
- `POST /activities` - Tạo hoạt động  
- `GET /activities?createdBy=<id>` - Danh sách của CH  
- `PATCH /activities/:id` - Chỉnh sửa  
- `DELETE /activities/:id` - Xóa
- `POST /activities/:id/publish` - Request publish (nếu có workflow)

---

## UC_013: Quản Lý Danh Sách Đăng Ký & Xuất Excel

| Trường | Nội Dung |
|-------|---------|
| **Mã Yêu Cầu** | UC_013_QuanLyDanhSachDangKy |
| **Tên Use Case** | Quản lý danh sách đăng ký & xuất Excel |
| **Mức Độ Cần Thiết** | Cao |
| **Tác Nhân Chính** | BCH Chi Hội |
| **Các Thành Phần Tham Gia & Mối Quan Tâm** | BCH Chi Hội muốn xem ai đã đăng ký hoạt động, xuất danh sách sang file Excel để lưu hoặc phân chia công việc. |
| **Mô Tả Tóm Tắt** | Hiển thị danh sách đăng ký & cho phép xuất Excel. |
| **Tiền Điều Kiện** | CH có hoạt động (UC_012), hoạt động có ≥1 registrations. |
| **Các Mối Quan Hệ** | Related: UC_012 (Activities); Uses: UC_010 (Check-in data) |

### Luồng Xử Lý Bình Thường
1. CH truy cập trang "Danh Sách Đăng Ký" (/ch/activities/:id/registrations).
2. Frontend gửi `GET /activities/:id/registrations?page=1&limit=100`.
3. Backend: Trả về danh sách registrations (userId, studentCode, fullName, email, checkInAt, proofStatus).
4. Frontend: Hiển thị bảng với cột: STT, MSSV, Họ Tên, Email, Điểm Danh (✓/✗), Chứng Minh (PENDING/VERIFIED/REJECTED).
5. Người dùng có thể lọc: Chỉ những người đã điểm danh (checkInAt not null).

**A. Xuất Excel:**
1. CH nhấp "Xuất Excel" hoặc "📥 Download Danh Sách".
2. Frontend: Gửi `GET /activities/:id/report/export?format=excel`.
3. Backend: Tạo file Excel (thư viện exceljs) với danh sách registrations, bao gồm:
   - Columns: STT, MSSV, Họ Tên, Email, Số Điện Thoại (nếu có), Điểm Danh (Yes/No), Thời Gian Điểm Danh, Trạng Thái Chứng Minh, Ghi Chú
   - Formatting: Header bold, Auto-fit columns, Filter row
   - Sheet name: Activity title + date
4. Backend: Trả về file download với tên: `[Activity-Name]_DanhSachDangKy_[Date].xlsx`.
5. Frontend: Tự động download file.
6. CH mở file Excel trên máy tính.

### Các Luồng Sự Kiện Con
**A1 - Danh Sách Trống:**
- 3. Activity.registrations.length = 0.
- Frontend: "📭 Chưa có ai đăng ký hoạt động này."
- 5. Nút "Xuất Excel" disable hoặc hiển thị "No data to export."

**A2 - Lọc Theo Check-in Status:**
- 5. CH chọn filter "Chỉ những người đã điểm danh".
- 2. `GET /activities/:id/registrations?checkInOnly=true`.
- Backend: WHERE checkInAt IS NOT NULL.
- 4. Export chỉ chứa những người đã điểm danh.

**A3 - Large Export (>1000 Records):**
- 3. Activity có 2000+ registrations.
- Backend: Batch processing để tránh timeout.
- Frontend: "⏳ Đang tạo file... Vui lòng chờ." (progress bar).
- 4. Backend: Gửi file khi ready hoặc notify user download link.

**A4 - Re-Export:**
- CH export lần 1, sau đó có thêm 10 registrations khác.
- CH export lần 2.
- Backend: Export file mới với toàn bộ 110 registrations.

### Luồng Đặc Biệt / Lỗi
**E1 - Excel File Quá Lớn:**
- Export >100k rows rất chậm.
- Backend: Implement streaming hoặc async job (queue), notify user sau khi ready.
- Frontend: "⏳ Đang tạo file Excel. Chúng tôi sẽ gửi email cho bạn khi hoàn thành."

**E2 - Special Characters in Name:**
- Tên sinh viên có diacritics ("Nguyễn", "Trần", v.v.).
- Backend: Encode properly UTF-8 trong Excel file.
- Frontend: Display filename dạng ASCII hoặc encoded.

**E3 - File Not Generating (Timeout):**
- Backend lỗi khi tạo Excel.
- Frontend: "❌ Không thể tạo file Excel. Vui lòng thử lại."
- Backend: Log error, retry mechanism.

**E4 - User Missing Email Field:**
- Một số registrations không có email.
- Backend: Display "-" hoặc "N/A" trong cột email.

### Kết Quả
- ✅ Danh sách registrations được hiển thị đầy đủ.
- ✅ File Excel được tạo chính xác với format chuyên nghiệp.
- ✅ Excel file có thể mở trên MS Excel, Google Sheets, LibreOffice.
- ✅ CH có bản ghi (file) của danh sách cho audit/backup.

**Endpoint:** `GET /activities/:id/report/export?format=excel`  
**Response:** File download (Excel .xlsx)  
**Filename:** `[Activity-Name]_DanhSachDangKy_[Timestamp].xlsx`  
**Library:** exceljs (Node.js)

---

## UC_014: Hiển Thị QR Code Để Điểm Danh

| Trường | Nội Dung |
|-------|---------|
| **Mã Yêu Cầu** | UC_014_HienThiQRCode |
| **Tên Use Case** | Hiển thị QR code để sinh viên điểm danh |
| **Mức Độ Cần Thiết** | Cao |
| **Tác Nhân Chính** | BCH Chi Hội (hoặc Admin) |
| **Các Thành Phần Tham Gia & Mối Quan Tâm** | BCH muốn hiển thị QR code tại hoạt động để sinh viên dễ dàng quét & điểm danh. QR phải unique per activity & có time expiry. |
| **Mô Tả Tóm Tắt** | Hiển thị QR code lớn trên projector/màn hình để sinh viên quét điểm danh. |
| **Tiền Điều Kiện** | Hoạt động đã được publish (status=PUBLISHED), hoạt động đang diễn ra. |
| **Các Mối Quan Hệ** | Used by: UC_010 (Điểm danh QR); Related: UC_012 (Activity) |

### Luồng Xử Lý Bình Thường
1. BCH Chi Hội vào trang hoạt động hoặc trang "Quản Lý Hoạt Động" (UC_012).
2. Hoạt động là PUBLISHED, CH nhấp "Hiển Thị QR Để Điểm Danh" hoặc access route `/ch/activities/:id/qr-display`.
3. Frontend: Gửi `GET /activities/:id/qr-code`.
4. Backend:
   - Truy vấn activity lấy qrSecret, qrCodeUrl.
   - Nếu qrCodeUrl chưa được generate: Generate qr & lưu URL.
   - Nếu QR code expired (dùng cache):
     - Generate QR mới với timestamp hiện tại + signature mới.
   - Return: { qrCodeUrl, qrSecret (hidden), expiresAt: now + 4 hours }
5. Frontend: Display QR code ở full screen / modal:
   - Hiển thị ảnh QR lớn
   - Hiển thị text "Scan QR Code Để Điểm Danh"
   - Đếm ngược thời gian còn lại (expires in X minutes)
6. BCH: Click "Chiếu Lên Projector" hoặc full-screen mode để chiếu lên màn hình lớn.
7. (Học sinh quét QR từ điện thoại → UC_010)

**Alternative: Generate QR On-Demand (Refresh Every X Minutes):**
- 3. Frontend: Nếu setting cho phép, auto-refresh QR mỗi 15 phút để tăng security.
- 4. Backend: Generate QR mới với timestamp updated.
- 5. FE: Auto-reload QR image.

### Các Luồng Sự Kiện Con
**A1 - QR Chưa Được Generate:**
- 4. qrCodeUrl = null.
- Backend: Generate QR first call, return URL.

**A2 - QR Hết Hạn:**
- 4. QR code generate từ 4 tiếng trước.
- Backend: Cấp QR mới hoặc tell FE "❌ QR hết hạn, vui lòng reload."

**A3 - Download QR Ảnh:**
- User muốn save QR ảnh để in ra giấy.
- User click "Download QR" → save PNG/PDF.

### Luồng Đặc Biệt / Lỗi
**E1 - QR Generation Library Error:**
- QR library lỗi khi generate.
- Backend: "⚠️ Không thể tạo QR code. Vui lòng thử lại."

**E2 - Activity Cancelled Khi QR Đang Display:**
- Admin hủy hoạt động trong lúc CH đang hiển thị QR.
- Backend: QR vẫn valid từ cache, nhưng registration sẽ fail do activity status.

**E3 - Network Disconnect:**
- FE mất connection khi display QR.
- FE: Hiển thị cached QR (nếu có) hoặc reconnect.

### Kết Quả
- ✅ QR code hiển thị lớn trên màn hình.
- ✅ QR code valid và có timestamp signature.
- ✅ QR code tự động expiry sau 4 giờ.
- ✅ Sinh viên có thể quét & điểm danh tự động (UC_010).

**Endpoint:** `GET /activities/:id/qr-code`  
**Response:** { qrCodeUrl, expiresAt }  
**Display Mode:** Full screen / Responsive modal

---

# BCH LIÊN CHI HỘI - USE CASES (UC_015-016)

## UC_015: Phê Duyệt Hoạt Động

| Trường | Nội Dung |
|-------|---------|
| **Mã Yêu Cầu** | UC_015_PheDuyetHoatDong |
| **Tên Use Case** | Phê duyệt hoạt động |
| **Mức Độ Cần Thiết** | Cao |
| **Tác Nhân Chính** | BCH Liên Chi Hội (Union Board) |
| **Các Thành Phần Tham Gia & Mối Quan Tâm** | LCH muốn review & phê duyệt hoạt động được tạo bởi BCH Chi Hội. Muốn kiểm tra conformity & budget. |
| **Mô Tả Tóm Tắt** | Cho phép LCH phê duyệt hoạt động từ PENDING → PUBLISHED. |
| **Tiền Điều Kiện** | Hoạt động status=PENDING (chờ phê duyệt). |
| **Các Mối Quan Hệ** | Depends: UC_012 (Activity created); Updates: Activity.status |

### Luồng Xử Lý Bình Thường
1. LCH truy cập trang "Hoạt Động Chờ Phê Duyệt" (/lch/pending-activities).
2. Frontend: Gửi `GET /activities?status=PENDING&page=1&limit=50`.
3. Backend: Trả về danh sách hoạt động có status=PENDING, eager load creator info.
4. Frontend: Hiển thị bảng với cột: Activity Name, Creator, Start Time, Submitted At, Actions.
5. LCH click vào activity để xem chi tiết.
6. Frontend: Gửi `GET /activities/:id`.
7. Backend: Trả về chi tiết lengkap:
   - Title, Description, Poster, Location
   - Time, Max Participants, Category, Tags, Criteria
   - Creator Info, Submitted At
   - Budget (nếu có)
8. Frontend: Hiển thị modal/page với chi tiết.
9. LCH review thông tin, kiểm tra:
   - Tên hoạt động phù hợp?
   - Thời gian hợp lệ?
   - Budget OK?
   - Mô tả đầy đủ?
10. **Approving Path:**
    - LCH click "Phê Duyệt".
    - Frontend: Gửi `PATCH /activities/:id/status` với body: { status: "PUBLISHED" }.
    - Backend: Cập nhật:
      - activities.status = PUBLISHED
      - activities.approvedBy = lch-id
      - activities.approvedAt = now()
    - Backend: Notify BCH Chi Hội: "✅ Hoạt động được phê duyệt."
    - Frontend: "✅ Hoạt động đã phê duyệt và publish."
11. **Rejecting Path:**
    - LCH click "Từ Chối".
    - Frontend: Popup hiện form nhập lý do từ chối.
    - LCH nhập lý do (vd: "Budget vượt quá, vui lòng sửa").
    - Frontend: `PATCH /activities/:id/status` với body: { status: "REJECTED", rejectionReason }.
    - Backend: Cập nhật:
      - activities.status = PENDING (hoặc REJECTED nếu có status này)
      - Lưu rejectionReason
    - Notify BCH: "⚠️ Hoạt động bị từ chối. Lý do: ..."
    - Frontend: "✅ Đã từ chối."

### Các Luồng Sự Kiện Con
**A1 - Không Có Hoạt Động Chờ Phê Duyệt:**
- 3. Danh sách trống.
- Frontend: "🎉 Không có hoạt động nào chờ phê duyệt!"

**A2 - Phê Duyệt Có Điều Kiện:**
- 9. LCH phê duyệt nhưng với note: "Phê duyệt, nhưng cần giảm số người tối đa từ 100 xuống 50."
- 10. Frontend hiển thị form comment thay vì chỉ approve/reject.
- Backend: Lưu comment & status = PUBLISHED (hoặc CONDITIONALLY_APPROVED).

**A3 - Multiple Approvals/Rejections (Workflow):**
- Workflow: CH submit → LCH1 review → LCH2 final approval → PUBLISHED.
- (More complex, may not be implemented yet)

### Luồng Đặc Biệt / Lỗi
**E1 - Activity Bị Xóa Khi Đang Review:**
- CH xóa activity trong khi LCH đang review.
- Backend: Activity not found error.
- Frontend: "⚠️ Hoạt động đã bị xóa bởi tác giả."

**E2 - Concurrent Approval:**
- 2 LCH approve cùng activity cùng lúc.
- Database: Unique constraint / race condition handling.
- Second LCH: "ℹ️ Hoạt động đã được phê duyệt bởi [LCH Name]."

**E3 - Reviewer Without Permission:**
- User không phải LCH cố access UC_015.
- Backend: RolesGuard reject, return 403 Forbidden.

### Kết Quả
- ✅ Hoạt động được phê duyệt: status = PUBLISHED.
- ✅ approvedBy & approvedAt được ghi lại.
- ✅ BCH Chi Hội được thông báo kết quả.
- ✅ Hoạt động hiển thị cho sinh viên (UC_003, UC_004).

**Endpoints:**  
- `GET /activities?status=PENDING` - Danh sách chờ  
- `PATCH /activities/:id/status` - Phê duyệt/Từ chối  
- **DTO:** { status: "PUBLISHED" | "REJECTED", rejectionReason? }

---

## UC_016: Phê Duyệt Chứng Minh (Proof Verification)

| Trường | Nội Dung |
|-------|---------|
| **Mã Yêu Cầu** | UC_016_PheDuyetMinhChung |
| **Tên Use Case** | Phê duyệt chứng minh tham gia hoạt động |
| **Mức Độ Cần Thiết** | Cao |
| **Tác Nhân Chính** | BCH Liên Chi Hội (hoặc Admin) |
| **Các Thành Phần Tham Gia & Mối Quan Tâm** | LCH muốn review các ảnh chứng minh từ sinh viên, xác thực tính hợp lệ. Cấp rating để track chương trình rèn luyện. |
| **Mô Tả Tóm Tắt** | Cho phép LCH xem & phê duyệt ảnh chứng minh sinh viên (UC_009). |
| **Tiền Điều Kiện** | Sinh viên đã upload proof (UC_009), status=PENDING chờ verify. |
| **Các Mối Quan Hệ** | Depends: UC_009 (Proof upload); Updates: UC_008 (Progress) |

### Luồng Xử Lý Bình Thường
1. LCH truy cập trang "Chứng Minh Chờ Xác Minh" (/lch/pending-proofs).
2. Frontend: Gửi `GET /registrations?proofStatus=PENDING&page=1&limit=20`.
3. Backend: Eager load registrations + activity, user, proof image info.
4. Backend: Trả về danh sách registrations chờ verify.
5. Frontend: Hiển thị danh sách (dạng card/gallery) với:
   - Student Name, Student Code, Activity Name
   - Proof Image (thumbnail), Submitted At
   - Status: "⏳ Chờ Xác Minh"
6. LCH click vào ảnh chứng minh.
7. Frontend: Hiển thị lightbox/modal với:
   - Ảnh full size
   - Student info: Name, MSSV, Email
   - Activity info: Title, Time, Location
   - Form rating & feedback
8. LCH xem ảnh & assess: Tính hợp lệ không?
9. **Approving Path (Ảnh Hợp Lệ):**
   - LCH click "Xác Minh" / "Phê Duyệt".
   - LCH chọn rating 1-5 sao.
   - LCH nhập feedback (optional): "Tốt, rõ ràng."
   - Frontend: `PATCH /registrations/:id/verify` với body:
     ```json
     {
       "proofStatus": "VERIFIED",
       "rating": 5,
       "feedback": "Tốt, rõ ràng."
     }
     ```
10. Backend:
    - Cập nhật registrations:
      - proofStatus = VERIFIED
      - verifiedBy = lch-id
      - verifiedAt = now()
      - rating = 5
      - feedback = "Tốt, rõ ràng."
    - Cập nhật user_criteria.progressCount += 1 (nếu chưa tính).
    - Tính toán SV5T progress mới (UC_008).
11. Backend: Notify sinh viên: "✅ Hoạt động của bạn được phê duyệt! +1 điểm [Criterion]."
12. Frontend: "✅ Đã xác minh chứng minh."
13. **Rejecting Path (Ảnh Không Hợp Lệ):**
    - LCH click "Từ Chối" / "Hủy".
    - Frontend: Popup form nhập lý do từ chối (bắt buộc).
    - LCH nhập lý do: "Ảnh mờ, không nhìn rõ người."
    - Frontend: `PATCH /registrations/:id/verify` với:
      ```json
      {
        "proofStatus": "REJECTED",
        "rating": null,
        "feedback": "Ảnh mờ, không nhìn rõ người. Vui lòng upload ảnh khác."
      }
      ```
    - Backend: Cập nhật registrations.proofStatus = REJECTED.
    - Notify sinh viên: "❌ Chứng minh từ chối. Vui lòng upload ảnh khác. Lý do: ..."
    - Frontend: "✅ Đã từ chối chứng minh."

### Các Luồng Sự Kiện Con
**A1 - Danh Sách Chứng Minh Trống:**
- 3. Không có registrations nào có proofStatus=PENDING.
- Frontend: "🎉 Không có chứng minh nào chờ xác minh!"

**A2 - Chứng Minh Bị Xóa:**
- LCH reviewing ảnh được lưu, nhưng Cloudinary URL bị expired/xóa.
- Frontend: "⚠️ Ảnh không còn available."

**A3 - Rating Scale:**
- Rating 1 = Minimal acceptable.
- Rating 5 = Excellent.
- Backend: Có thể dùng rating để analytics (quality of submissions).

**A4 - Batch Approval:**
- LCH muốn approve 10 chứng minh cùng lúc (nếu tương tự).
- Frontend: Multi-select checkbox + "Approve Selected".
- Backend: Loop & verify tất cả.

### Luồng Đặc Biệt / Lỗi
**E1 - Race Condition:**
- 2 LCH verify cùng proof cùng lúc.
- Error handling: Database constraint.
- Second LCH: "ℹ️ Chứng minh đã được xác minh bởi [LCH Name]."

**E2 - Invalid Rating:**
- Frontend gửi rating=10 (out of range 1-5).
- Backend: Validation error.
- Frontend: "⚠️ Rating phải từ 1 đến 5."

**E3 - Empty Feedback:**
- LCH reject nhưng không nhập lý do.
- Frontend: Bắt buộc nhập lý do nếu reject.

### Kết Quả
- ✅ Chứng minh được xác minh hoặc từ chối.
- ✅ proofStatus = VERIFIED, rating, feedback được lưu.
- ✅ Tiến độ criterion được cập nhật ngay lập tức.
- ✅ Sinh viên được thông báo kết quả.
- ✅ Audit trail: verifiedBy, verifiedAt.

**Endpoints:**  
- `GET /registrations?proofStatus=PENDING` - Danh sách chờ  
- `PATCH /registrations/:id/verify` - Phê duyệt/Từ chối  
- **DTO:** { proofStatus: "VERIFIED" | "REJECTED", rating?: 1-5, feedback }

---

# QUẢN TRỊ VIÊN - USE CASES (UC_017-019)

## UC_017: Quản Lý Danh Mục (Categories)

| Trường | Nội Dung |
|-------|---------|
| **Mã Yêu Cầu** | UC_017_QuanLyDanhMuc |
| **Tên Use Case** | Quản lý danh mục hoạt động |
| **Mức Độ Cần Thiết** | Cao |
| **Tác Nhân Chính** | Quản Trị Viên (Admin) |
| **Các Thành Phần Tham Gia & Mối Quan Tâm** | Admin muốn tạo, chỉnh sửa, xóa danh mục hoạt động (Thể Thao, Tình Nguyện, Học Tập, v.v.). |
| **Mô Tả Tóm Tắt** | CRUD operations cho Activity Categories. |
| **Tiền Điều Kiện** | Người dùng đã đăng nhập với vai trò ADMIN. |
| **Các Mối Quan Hệ** | Used by: UC_012, UC_004 (Activities) |

### Luồng Xử Lý Bình Thường
1. Admin truy cập trang "Quản Lý Danh Mục" (/admin/categories).
2. Frontend: `GET /activity-categories`.
3. Backend: Trả về danh sách tất cả categories.
4. Frontend: Hiển thị bảng: STT, Tên, Mô Tả, Màu Sắc, Hành Động.

**A. Thêm Danh Mục:**
1. Admin click "Thêm Danh Mục".
2. Frontend: Hiển thị form:
   - Name (text)
   - Description (textarea)
   - Color (color picker)
3. Admin nhập dữ liệu.
4. Admin click "Lưu".
5. Frontend: `POST /activity-categories` với body: { name, description, color }.
6. Backend: Validate (name not empty, not duplicate, v.v.).
7. Backend: Insert vào activity_categories table.
8. Frontend: "✅ Danh mục được tạo!"

**B. Chỉnh Sửa:**
1. Admin click "Sửa" trên category.
2. Frontend: Populate form với dữ liệu hiện tại.
3. Admin thay đổi.
4. Admin click "Lưu".
5. Frontend: `PATCH /activity-categories/:id`.
6. Backend: Update database.
7. Frontend: "✅ Cập nhật thành công!"

**C. Xóa:**
1. Admin click "Xóa".
2. Frontend: Confirm dialog "Xóa danh mục [Name] không?"
3. Admin confirm.
4. Backend: Kiểm tra không có hoạt động nào dùng category này.
   - Có: "⚠️ Danh mục này có [X] hoạt động. Hãy xóa/chuyển hoạt động trước."
   - Không: Soft delete hoặc hard delete category.
5. Frontend: "✅ Đã xóa."

### Các Luồng Sự Kiện Con
**A1 - Danh Mục Trùng Lặp:**
- 6. Backend: Detect tên category đã tồn tại.
- Thông báo: "⚠️ Danh mục [Name] đã tồn tại."

**A2 - Danh Mục Có Hoạt Động:**
- Khi xóa, có check cascading: có hoạt động dùng category này?
- Option: Auto-move activities tới category mặc định.

### Luồng Đặc Biệt / Lỗi
**E1 - Invalid Color:**
- Color format không hợp lệ.
- Backend: Validate HEX color format.

### Kết Quả
- ✅ Danh mục được tạo, chỉnh sửa, xóa thành công.
- ✅ Hoạt động có thể chọn danh mục mới.

**Endpoints:**  
- `GET /activity-categories` - Danh sách  
- `POST /activity-categories` - Tạo  
- `PATCH /activity-categories/:id` - Chỉnh sửa  
- `DELETE /activity-categories/:id` - Xóa

---

## UC_018: Quản Lý Tổ Chức (Units/Clubs)

| Trường | Nội Dung |
|-------|---------|
| **Mã Yêu Cầu** | UC_018_QuanLyToChuc |
| **Tên Use Case** | Quản lý tổ chức / Chi hội |
| **Mức Độ Cần Thiết** | Cao |
| **Tác Nhân Chính** | Quản Trị Viên (Admin) |
| **Các Thành Phần Tham Gia & Mối Quan Tâm** | Admin muốn quản lý cấu trúc tổ chức: Liên Chi Hội, Chi Hội, Ngành, v.v. Cây phân cấp. |
| **Mô Tả Tóm Tắt** | CRUD hierarchical Units (Organizations/Clubs). |
| **Tiền Điều Kiện** | Người dùng đã đăng nhập với vai trò ADMIN. |
| **Các Mối Quan Hệ** | Used by: UC_012, UC_004, UC_005 |

### Luồng Xử Lý Bình Thường
1. Admin truy cập "Quản Lý Tổ Chức" (/admin/units).
2. Frontend: `GET /units?hierarchy=true`.
3. Backend: Trả về cây phân cấp units (parentId, childrenUnits).
4. Frontend: Hiển thị tree view:
   ```
   📦 Liên Chi Hội Đại Học
      📁 Chi Hội Khoa CNTT
         📁 Ngành An Toàn Thông Tin
         📁 Ngành Hệ Thống Thông Tin
      📁 Chi Hội Khoa Kinh Tế
   ```

**A. Thêm Unit:**
1. Admin click vào node parent → "Thêm Unit Con".
2. Frontend: Form:
   - Name, Description, ParentId
3. Admin nhập thông tin.
4. Admin click "Lưu".
5. Frontend: `POST /units` với { name, description, parentId }.
6. Backend: Insert units record.
7. Frontend: Tree update, hiển thị unit mới.

**B. Chỉnh Sửa:**
1. Admin click "Sửa" trên unit node.
2. Form populate.
3. Admin change name / description.
4. Frontend: `PATCH /units/:id`.
5. Backend: Update.
6. Frontend: Tree refresh.

**C. Xóa (Nếu không có children/activities):**
1. Admin click "Xóa".
2. Backend: Check constraints.
   - Có children: "⚠️ Unit này có [X] con. Xóa/chuyển chúng trước."
   - Có hoạt động: "⚠️ Unit này có [X] hoạt động."
3. Nếu OK: Delete.

### Các Luồng Sự Kiện Con
**A1 - Move Unit (Reorganize Tree):**
- Drag & drop unit tới parent khác.
- Backend: Update parentId.

**A2 - Circular Dependency:**
- Admin cố set parentId = childId (vòng lặp).
- Backend: Validation prevent.
- Thông báo: "⚠️ Không thể set unit này làm parent của chính nó."

### Luồng Đặc Biệt / Lỗi
**E1 - Large Tree Slow Query:**
- Cây có 10k units.
- Backend: Implement lazy loading hoặc pagination.

### Kết Quả
- ✅ Cây tổ chức được quản lý chính xác.
- ✅ Units mới được tạo với parent-child relationship.
- ✅ Students có thể chọn Chi Hội trong UC_001.

**Endpoints:**  
- `GET /units?hierarchy=true` - Cây phân cấp  
- `POST /units` - Tạo  
- `PATCH /units/:id` - Chỉnh sửa  
- `DELETE /units/:id` - Xóa

---

## UC_019: Quản Lý Tài Khoản Người Dùng

| Trường | Nội Dung |
|-------|---------|
| **Mã Yêu Cầu** | UC_019_QuanLyTaiKhoan |
| **Tên Use Case** | Quản lý tài khoản người dùng |
| **Mức Độ Cần Thiết** | Cao |
| **Tác Nhân Chính** | Quản Trị Viên (Admin) |
| **Các Thành Phần Tham Gia & Mối Quan Tâm** | Admin muốn view tất cả users, cấp vai trò, khóa/mở khóa tài khoản, cập nhật thông tin. |
| **Mô Tả Tóm Tắt** | CRUD users, assign roles, manage account status. |
| **Tiền Điều Kiện** | Người dùng đã đăng nhập với vai trò ADMIN. |
| **Các Mối Quan Hệ** | Related: UC_001 (User creation) |

### Luồng Xử Lý Bình Thường
1. Admin truy cập "Quản Lý Tài Khoản" (/admin/users).
2. Frontend: `GET /users?page=1&limit=50`.
3. Backend: Trả về danh sách users (ID, Email, Name, StudentCode, Roles, Status).
4. Frontend: Hiển thị bảng: STT, Email, MSSV, Họ Tên, Vai Trò, Trạng Thái, Hành Động.

**A. Xem Chi Tiết User:**
1. Admin click vào user row.
2. Frontend: `GET /users/:id`.
3. Backend: Trả về chi tiết user + roles + SV5T progress (nếu STUDENT).
4. Frontend: Hiển thị modal/page với info.

**B. Gán Vai Trò (Assign Roles):**
1. Admin click "Gán Vai Trò" / "Sửa" trên user.
2. Frontend: Form multi-select roles:
   - ☐ STUDENT
   - ☐ CH (Club Head)
   - ☐ LCH (Union Board)
   - ☐ ADMIN
3. Admin chọn roles.
4. Admin click "Lưu".
5. Frontend: `POST /user-roles` hoặc `PATCH /users/:id/roles` với { roles: ["CH", "LCH"] }.
6. Backend: 
   - Xóa user_roles cũ nếu có.
   - Insert user_roles mới cho từng role.
7. Frontend: "✅ Vai trò được cập nhật!"

**C. Khóa Tài Khoản (Ban User):**
1. Admin click "Khóa" trên user.
2. Frontend: Confirm: "Bạn chắc chắn khóa tài khoản [Email]?"
3. Admin confirm.
4. Frontend: `PATCH /users/:id/lock` với { status: "BANNED" }.
5. Backend: 
   - Update users.status = BANNED.
   - User không thể đăng nhập (UC_002 check status).
6. Frontend: "✅ Tài khoản đã khóa."

**D. Mở Khóa Tài Khoản (Unban):**
1. Admin click "Mở Khóa".
2. Frontend: `PATCH /users/:id/unlock` với { status: "ACTIVE" }.
3. Backend: Update users.status = ACTIVE.
4. Frontend: "✅ Tài khoản đã mở khóa."

**E. Cập Nhật Thông Tin (SV5T Fields):**
1. Admin click "Cập Nhật SV5T".
2. Frontend: Form với:
   - GPA (float)
   - DRL (Điểm Rèn Luyện, float)
   - Credit Count (int)
   - SV5T Eligible (checkbox)
   - Is Disabled (checkbox - nếu user disabled, không tính SV5T)
3. Admin update values.
4. Frontend: `PATCH /users/:id/sv5t` với { gpa, drl, creditCount, sv5tEligible, isDisabled }.
5. Backend: Update users table.
6. Frontend: "✅ Thông tin SV5T được cập nhật!"

### Các Luồng Sự Kiện Con
**A1 - Tìm Kiếm User:**
- Frontend: Search box trên top.
- `GET /users?search=nguyen@ctu.edu.vn&page=1`.
- Backend: ILIKE search trên email, fullName, studentCode.

**A2 - Filter Theo Vai Trò:**
- Admin muốn xem tất cả CH.
- `GET /users?role=CH`.
- Backend: JOIN user_roles, filter.

**A3 - Filter Theo Status:**
- `GET /users?status=BANNED`.
- Backend: Filter users.status = BANNED.

**A4 - Bulk Operations:**
- Admin chọn 5 users → "Khóa Hàng Loạt".
- Frontend: Multi-select checkbox + bulk action button.
- Backend: Batch update status.

### Luồng Đặc Biệt / Lỗi
**E1 - Last Admin Can't Be Removed:**
- Nếu chỉ còn 1 ADMIN, không cho phép remove role ADMIN.
- Backend: "⚠️ Phải có ít nhất 1 ADMIN trong hệ thống."

**E2 - Invalid Role Combination:**
- Assign role không tồn tại.
- Backend: Validate roles từ roles table.

**E3 - Ban Admin:**
- Admin tự khóa account của mình.
- Backend: Allow nhưng warning.

### Kết Quả
- ✅ Danh sách users được quản lý.
- ✅ Vai trò được gán/xóa chính xác.
- ✅ Tài khoản có thể khóa/mở khóa.
- ✅ SV5T fields được update cho students.

**Endpoints:**  
- `GET /users?page=<p>&limit=<l>&search=<q>&role=<r>&status=<s>` - Danh sách  
- `GET /users/:id` - Chi tiết  
- `POST /user-roles` - Gán vai trò  
- `PATCH /users/:id/lock` - Khóa  
- `PATCH /users/:id/unlock` - Mở khóa  
- `PATCH /users/:id/sv5t` - Cập nhật SV5T

---

# KẾT LUẬN

Tài liệu này mô tả **19 Use Cases** toàn diện cho hệ thống SAMS-CTU, bao gồm:

- **Sinh Viên (11 UC):** Đăng ký, đăng nhập, xem/tìm hoạt động, quản lý hồ sơ, gợi ý AI, đăng ký, theo dõi tiến độ, điểm danh (hình & QR), lịch sử hoạt động.
- **BCH Chi Hội (3 UC):** Quản lý hoạt động, danh sách đăng ký & xuất Excel, hiển thị QR.
- **BCH Liên Chi Hội (2 UC):** Phê duyệt hoạt động, phê duyệt chứng minh.
- **Quản Trị Viên (3 UC):** Quản lý danh mục, tổ chức, tài khoản.

Mỗi use case được định nghĩa chi tiết với:
- Luồng xử lý bình thường
- Luồng sự kiện con (alternative flows)
- Luồng đặc biệt / lỗi (exception flows)
- Kết quả kỳ vọng
- Endpoints API & DTOs tương ứng

**Phiên Bản:** 1.0  
**Ngày:** Tháng 4 Năm 2026  
**Trạng Thái:** ✅ Hoàn Thành & Sẵn Sàng Triển Khai

