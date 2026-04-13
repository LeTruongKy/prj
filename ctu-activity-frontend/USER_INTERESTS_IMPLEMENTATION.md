# Tính Năng Sở Thích Của Người Dùng - Hướng Dẫn Triển Khai

## 📝 Tổng Quan

Tính năng này cho phép người dùng chỉnh sửa các sở thích (interests) của họ trực tiếp từ trang Hồ sơ cá nhân, không cần trang riêng biệt.

---

## 📂 Các File Được Tạo/Cập Nhật

### 1. **`lib/axios/privateAxios.ts`** (Mới)
**Mục đích**: Tạo instance axios có xác thực với token JWT từ localStorage

**Tính năng chính**:
- ✅ Tự động thêm Authorization header từ localStorage
- ✅ Handle token refresh khi hết hạn
- ✅ Quản lý lỗi mạng
- ✅ Tích hợp với API status store

**Sử dụng**:
```typescript
import privateAxios from "@/lib/axios/privateAxios";

// Tất cả các request sẽ tự động thêm Authorization header
const response = await privateAxios.get('/tags');
```

---

### 2. **`lib/services/tagService.ts`** (Đã tồn tại)
**Mục đích**: API wrapper để lấy danh sách tất cả các tag

**Hàm chính**:
```typescript
TagService.CallFetchAllTags(): Promise<IBackendRes<ITag[]>>
```

---

### 3. **`lib/services/userInterestService.ts`** (Đã tồn tại)
**Mục đích**: API wrapper để quản lý sở thích của người dùng

**Các hàm chính**:
```typescript
// Lấy sở thích hiện tại của người dùng
UserInterestService.CallGetMyInterests(): Promise<IBackendRes<IUserInterest[]>>

// Cập nhật sở thích (xóa cũ, tạo mới)
UserInterestService.CallUpdateUserInterests(data: { 
  tagIds: number[], 
  weight?: number 
}): Promise<IBackendRes<IUserInterest[]>>
```

---

### 4. **`app/profile/page.tsx`** (Cập nhật)
**Mục đích**: Thêm phần "Sở Thích Của Tôi" vào trang hồ sơ cá nhân

#### **State mới thêm**:
```typescript
const [userInterests, setUserInterests] = useState<IUserInterest[]>([])
const [allTags, setAllTags] = useState<ITag[]>([])
const [editingInterests, setEditingInterests] = useState(false)
const [selectedInterestIds, setSelectedInterestIds] = useState<number[]>([])
const [interestsLoading, setInterestsLoading] = useState(false)
```

#### **Hàm xử lý**:
```typescript
// Tải danh sách tag và sở thích hiện tại
const fetchInterests = async () => { ... }

// Bật chế độ chỉnh sửa
const handleEditInterests = async () => { ... }

// Lưu thay đổi sở thích
const handleSaveInterests = async () => { ... }

// Hủy chỉnh sửa
const handleCancelInterests = () => { ... }

// Toggle chọn/bỏ chọn tag
const toggleInterestTag = (tagId: number) => { ... }
```

#### **UI Component**:
- **Chế độ Hiển Thị**:
  - Hiển thị các sở thích hiện tại dưới dạng Badge màu xanh
  - Nút "Chỉnh Sửa" để bắt đầu chỉnh sửa
  - Thông báo nếu người dùng chưa chọn sở thích nào

- **Chế độ Chỉnh Sửa**:
  - Danh sách tất cả tag từ backend dạng grid button
  - Bấm vào tag để chọn/bỏ chọn (toggle)
  - Button "Lưu Thay Đổi" - gửi API cập nhật
  - Button "Hủy" - quay lại chế độ hiển thị
  - Loading state trong khi lưu

---

## 🔧 Cấu Hình Backend

Đảm bảo backend đã có các endpoint sau:

### GET `/tags`
```typescript
// Response
{
  statusCode: 200,
  message: "Tags retrieved successfully",
  data: [
    { id: 1, name: "Sport" },
    { id: 2, name: "Music" },
    // ...
  ]
}
```

### GET `/user-interests/me/interests`
```typescript
// Response
{
  statusCode: 200,
  message: "Your interests retrieved",
  data: [
    {
      id: 1,
      userId: "user-123",
      tagId: 1,
      weight: 1.0,
      tag: { id: 1, name: "Sport" }
    }
  ]
}
```

### POST `/user-interests/me/update`
```typescript
// Request
{
  tagIds: [1, 2, 3],
  weight?: 1.0  // Optional, default 1.0
}

// Response
{
  statusCode: 200,
  message: "Interests updated successfully",
  data: [
    {
      id: 1,
      userId: "user-123",
      tagId: 1,
      weight: 1.0,
      tag: { id: 1, name: "Sport" }
    }
  ]
}
```

---

## 🎯 Sử Dụng

### Cho Người Dùng:
1. Đi tới trang **Hồ sơ cá nhân**
2. Tìm phần **"Sở Thích Của Tôi"**
3. Nhấn nút **"Chỉnh Sửa"**
4. Chọn/bỏ chọn các tag mong muốn
5. Nhấn **"Lưu Thay Đổi"**
6. Thành công! Sở thích đã được cập nhật

### Cho Lập Trình Viên:

#### Import services:
```typescript
import { TagService } from '@/lib/services/tagService'
import { UserInterestService } from '@/lib/services/userInterestService'
```

#### Lấy tất cả tag:
```typescript
const tagsRes = await TagService.CallFetchAllTags()
if (tagsRes?.statusCode === 200) {
  const tags = tagsRes.data || []
}
```

#### Lấy sở thích của user:
```typescript
const interestsRes = await UserInterestService.CallGetMyInterests()
if (interestsRes?.statusCode === 200) {
  const interests = interestsRes.data || []
}
```

#### Cập nhật sở thích:
```typescript
const res = await UserInterestService.CallUpdateUserInterests({
  tagIds: [1, 2, 3],
})
if (res?.statusCode === 200 || res?.statusCode === 201) {
  console.log('Updated successfully')
}
```

---

## 🎨 Giao Diện

### Chế độ Hiển Thị
```
┌─────────────────────────────────────┐
│ Sở Thích Của Tôi          [Chỉnh Sửa] │
├─────────────────────────────────────┤
│ [Sport] [Music] [Art]               │
└─────────────────────────────────────┘
```

### Chế độ Chỉnh Sửa
```
┌─────────────────────────────────────┐
│ Sở Thích Của Tôi                    │
├─────────────────────────────────────┤
│ Chọn các sở thích của bạn:          │
│                                     │
│ [Sport] [Music] [Art] [Dancing]     │
│ [Coding] [Reading] [Gaming] [Food]  │
│                                     │
│                    [Hủy] [Lưu Thay Đổi] │
└─────────────────────────────────────┘
```

---

## 🔐 Xác Thực & Bảo Mật

- ✅ Token JWT được lưu trong localStorage
- ✅ Tự động thêm Authorization header cho tất cả request
- ✅ Handle token refresh tự động
- ✅ Chỉ user hiện tại mới có thể cập nhật sở thích của họ (xác minh bởi backend)

---

## 🐛 Xử Lý Lỗi

Tất cả các lỗi được catch và hiển thị dưới dạng alert:

```typescript
try {
  const res = await UserInterestService.CallUpdateUserInterests({...})
  // Success handling
} catch (err) {
  setError('Failed to save interests')
}
```

---

## ✅ Kiểm Tra

### Để kiểm tra tính năng hoạt động:
1. Đăng nhập vào ứng dụng
2. Vào trang Hồ sơ
3. Nhấm nút "Chỉnh Sửa" ở phần "Sở Thích Của Tôi"
4. Chọn vài tag
5. Nhấm "Lưu Thay Đổi"
6. Xác minh các tag được hiển thị chính xác
7. F5 reload trang - sở thích vẫn tồn tại

---

## 📌 Ghi Chú Quan Trọng

1. **`privateAxios` là bắt buộc**: Tất cả các API call trong services cần token JWT
2. **Response format**: Tất cả services đều trả về `IBackendRes<T>` format
3. **Tags loading**: Tags được tải một lần khi chuyển sang chế độ chỉnh sửa
4. **Bulk update**: Cập nhật xóa tất cả sở thích cũ rồi thêm cái mới (không update partial)

---

## 🚀 Tiếp Theo

Có thể nâng cao bằng:
- Thêm weight/priority cho mỗi interest
- Recommendation algorithm dựa trên interests
- Interest suggestions từ các activities đã tham gia
- Analytics về interests phổ biến nhất

