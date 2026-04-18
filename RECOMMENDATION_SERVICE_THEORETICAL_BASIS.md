# CHƯƠNG 2: CƠ SỞ LÝ THUYẾT
## HỆ THỐNG GỢI Ý HOẠT ĐỘNG SINH VIÊN (Activity Recommendation Engine)

Chương này trình bày hệ thống các cơ sở lý thuyết khoa học nền tảng và các kỹ thuật cụ thể được áp dụng để xây dựng hệ thống gợi ý hoạt động học sinh viên tại Trường Đại học Cần Thơ. Nội dung trọng tâm đi sâu vào phân tích kiến trúc gợi ý lai ghép (Hybrid Recommendation Architecture), cơ chế tính toán độ tương đồng dựa trên nội dung (Content-Based Similarity), phương pháp xây dựng ma trận đồng xuất hiện từ dữ liệu hành vi người dùng (User Co-occurrence Matrix), và các giải pháp tối ưu hóa hiệu năng cơ sở dữ liệu. Đồng thời, chương cũng đề cập đến các cơ chế ràng buộc (Constraint Handling) và chiến lược lọc dữ liệu (Data Filtering) cần thiết cho một hệ thống gợi ý thời gian thực trong lĩnh vực quản lý hoạt động học sinh viên.

---

## 2.1. Mô hình Gợi ý Lai ghép (Hybrid Recommendation Framework)

Trong lĩnh vực hệ gợi ý (Recommender Systems), mỗi phương pháp tiếp cận đơn lẻ đều tồn tại những ưu điểm và nhược điểm cố hữu. **Lọc dựa trên nội dung** (Content-Based Filtering) dựa vào việc phân tích đặc trưng của các mục (items) và sở thích của người dùng, nhưng lại thiếu khả năng khám phá những sở thích tiềm ẩn (Serendipity Problem) và có xu hướng gợi ý lặp lại những gì người dùng đã biết (Over-specialization). Ngược lại, **Lọc cộng tác** (Collaborative Filtering) tận dụng sức mạnh cộng đồng để phát hiện những hoạt động phù hợp dựa trên hành vi người dùng tương tự, nhưng gặp khó khăn với người dùng mới (Cold-Start Problem) do thiếu dữ liệu tương tác.

Để khắc phục các hạn chế này và tận dụng tối đa sức mạnh của cả hai phương pháp, hệ thống gợi ý hoạt động sinh viên tại CTU sử dụng kiến trúc **lai ghép tuyến tính có trọng số** (Linear Weighted Hybrid Architecture). Đây là một chiến lược kết hợp mềm dẻo, cho phép điều chỉnh mức độ ảnh hưởng của từng thành phần dự đoán dựa trên đặc điểm của tập dữ liệu và bối cảnh ứng dụng [1].

### 2.1.1. Chiến lược phân bổ trọng số (Weighting Strategy)

Việc lựa chọn bộ tham số trọng số không phải là ngẫu nhiên mà dựa trên phân tích đặc thù miền ứng dụng (Domain-Specific Analysis) của hệ thống quản lý hoạt động sinh viên:

$$w_{content} = 0.60 \text{ (Trọng số ưu tiên)} $$

Hệ thống gán trọng số cao cho mô hình Content-Based. Lý do là:
- Các **sở thích của sinh viên** (thẻ quan tâm) là dữ liệu tĩnh, luôn sẵn có khi sinh viên tạo profile
- **Các đặc trưng hoạt động** (thẻ phân loại, mô tả, tiêu chí) là dữ liệu tĩnh, hoàn chỉnh khi hoạt động được tạo
- Trong giai đoạn đầu, dữ liệu hành vi (lịch sử đăng ký hoạt động) thường **rất thưa thớt** (Sparsity Problem)
- Việc ưu tiên Content-Based giúp hệ thống hoạt động **ổn định** (Robustness) ngay cả với sinh viên mới

$$w_{collab} = 0.40 \text{ (Trọng số bổ trợ)} $$

Lọc cộng tác đóng vai trò bổ sung yếu tố **"xã hội"** và **"xu hướng tập thể"**. Khi dữ liệu người dùng dày lên theo thời gian, thành phần này sẽ giúp:
- Phát hiện những hoạt động phù hợp dựa trên gu thẩm thức của những sinh viên tương đồng
- Cung cấp những gợi ý **mang tính khám phá** (Serendipitous) vượt ra ngoài sở thích khai báo
- Làm giàu tính **đa dạng** của danh sách gợi ý

Thêm vào đó, hệ thống thêm một **yếu tố ngẫu nhiên nhỏ** (0-10% của điểm số):

$$\text{noise} = \text{random}(0, 0.1) \text{ (Thêm tính đa dạng)} $$

Yếu tố này mục đích:
- Tránh việc lặp lại các gợi ý giống nhau trong các lần truy vấn liên tiếp
- Khuyến khích sinh viên khám phá các hoạt động mới ngoài "vùng thoải mái"

---

## 2.2. Kỹ thuật Lọc dựa trên nội dung (Content-Based Filtering)

Mô hình lọc dựa trên nội dung tập trung vào việc **định lượng sự tương đồng** giữa các hoạt động thông qua phân tích đặc trưng của chúng so với sở thích đã khai báo của người dùng. Trong bối cảnh hệ thống gợi ý hoạt động sinh viên, "nội dung" (Content) bao gồm các thẻ phân loại (Tags) mô tả bản chất của hoạt động.

### 2.2.1. Biểu diễn Vector Sở thích Người dùng (User Profile Vectorization)

Để máy tính có thể so sánh mức độ phù hợp giữa các hoạt động với sở thích của sinh viên, mỗi sinh viên cần được biểu diễn dưới dạng một **vector sở thích** trong không gian đa chiều, trong đó mỗi chiều tương ứng với một thẻ quan tâm (Interest Tag):

$$\vec{u}_{\text{student}} = [w_1, w_2, w_3, \ldots, w_n]$$

Trong đó:
- $u_{\text{student}}$: Vector sở thích của sinh viên
- $w_i$: Trọng số của thẻ quan tâm thứ $i$ (lấy từ bảng `UserInterest`)
- $n$: Tổng số thẻ mà sinh viên quan tâm

**Quá trình xây dựng:**

Giả sử một sinh viên khai báo sở thích như sau:

| Thẻ quan tâm | Trọng số gốc |
|-------------|-------------|
| Leadership  | 0.8         |
| Development | 0.6         |
| Sports      | 0.4         |

Thực hiện **chuẩn hóa Min-Max** để đưa tất cả trọng số về cùng một thang đo [0, 1]:

$$w_{i,\text{norm}} = \frac{w_i}{\max(w)}$$

$$w_{i,\text{norm}} = \frac{w_i}{0.8}$$

Kết quả vector sở thích chuẩn hóa:

$$\vec{u}_{\text{student}} = [1.0, 0.75, 0.5]$$

**Ý nghĩa:** Sinh viên này có sở thích mạnh nhất ở **Leadership** (hệ số 1.0), rồi đến **Development** (0.75), và yếu hơn một chút ở **Sports** (0.5).

### 2.2.2. Biểu diễn Vector Hoạt động (Activity Vectorization)

Mỗi hoạt động được biểu diễn dưới dạng một **vector nhị phân thưa** (Sparse Binary Vector), trong đó mỗi phần tử tương ứng với một thẻ từ danh sách các thẻ quan tâm của sinh viên:

$$\vec{a}_j = [b_1, b_2, b_3, \ldots, b_n]$$

Trong đó:
- $\vec{a}_j$: Vector đặc trưng của hoạt động thứ $j$
- $b_i$: Giá trị nhị phân (0 hoặc 1) - hoạt động có chứa thẻ $i$ hay không

$$b_i = \begin{cases} 1 & \text{if hoạt động } j \text{ có thẻ } i \\ 0 & \text{otherwise} \end{cases}$$

**Ví dụ:** Giả sử hệ thống có hoạt động:

| Hoạt động | Leadership | Development | Sports |
|----------|-----------|-------------|--------|
| Workshop Lãnh đạo | 1 | 1 | 0 |
| Khoá học Lập trình | 0 | 1 | 0 |
| Giải Marathon | 0 | 0 | 1 |
| Triển lãm Nghệ thuật | 0 | 0 | 0 |

Tạo thành **ma trận hoạt động** (Activity Matrix) có kích thước $m \times n$ (số hoạt động × số thẻ):

$$A = \begin{pmatrix} 1 & 1 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \\ 0 & 0 & 0 \end{pmatrix}$$

### 2.2.3. Đo lường độ tương đồng: Cosine Similarity

Sau khi vector hóa, bài toán tìm hoạt động phù hợp trở thành bài toán **hình học**: tìm các vector nằm gần nhau nhất trong không gian đa chiều. Hệ thống sử dụng **độ đo Cosine Similarity** thay vì khoảng cách Euclid truyền thống.

**Công thức tính độ tương đồng Cosine** giữa vector sở thích sinh viên $\vec{u}$ và vector đặc trưng hoạt động $\vec{a}$:

$$\text{sim}_{\text{cosine}}(\vec{u}, \vec{a}) = \cos(\theta) = \frac{\vec{u} \cdot \vec{a}}{|\vec{u}| \times |\vec{a}|}$$

Trong đó:
- $\vec{u} \cdot \vec{a}$: Tích vô hướng (Dot Product) của hai vector
- $|\vec{u}|$: Chuẩn L2 (Euclidean Norm) của vector sở thích
- $|\vec{a}|$: Chuẩn L2 của vector hoạt động

**Tính toán chi tiết - Ví dụ:**

```
Vector sở thích: u = [1.0, 0.75, 0.5]
Vector hoạt động: a = [1, 1, 0]  (Workshop Lãnh đạo)

Bước 1: Tích vô hướng
u · a = 1.0×1 + 0.75×1 + 0.5×0 = 1.75

Bước 2: Chuẩn L2 của u
|u| = √(1.0² + 0.75² + 0.5²) = √(1.0 + 0.5625 + 0.25) = √1.8125 ≈ 1.346

Bước 3: Chuẩn L2 của a
|a| = √(1² + 1² + 0²) = √2 ≈ 1.414

Bước 4: Cosine Similarity
sim = 1.75 / (1.346 × 1.414) = 1.75 / 1.904 ≈ 0.919

Kết quả: 91.9% tương đồng
```

**Tại sao chọn Cosine Similarity thay vì khoảng cách Euclid?**

Trong không gian đặc trưng hoạt động, **"hướng" của vector quan trọng hơn "độ dài"**:
- Cosine Similarity đo **góc** giữa hai vector, do đó nắm bắt được sự tương đồng về "cấu trúc" của sở thích
- Hai sinh viên có tỷ lệ sở thích tương tự (ví dụ: cả hai đều ưu tiên Leadership hơn Development) sẽ được coi là có gu thẩm thức tương tự, ngay cả nếu mức độ ưu tiên tuyệt đối khác nhau
- Cosine Similarity không bị ảnh hưởng bởi **độ dài tuyệt đối** của vector, mà chỉ quan tâm đến **hướng** của chúng

**Ma trận độ tương đồng nội dung:**

Tính độ tương đồng Cosine giữa vector sở thích $\vec{u}$ và tất cả hoạt động trong ma trận $A$:

$$S_{\text{content}} = [\text{sim}(\vec{u}, \vec{a}_1), \text{sim}(\vec{u}, \vec{a}_2), \ldots, \text{sim}(\vec{u}, \vec{a}_m)]$$

Với ví dụ trên:

$$S_{\text{content}} = [0.919, 0.559, 0.373, 0.0]$$

**Diễn giải:**
- Workshop Lãnh đạo: 91.9% phù hợp (cao nhất)
- Khoá học Lập trình: 55.9% phù hợp
- Giải Marathon: 37.3% phù hợp
- Triển lãm Nghệ thuật: 0% phù hợp (không có thẻ nào trùng)

---

## 2.3. Kỹ thuật Lọc cộng tác nâng cao (Advanced Collaborative Filtering)

Lọc cộng tác dựa trên **giả định cơ bản**: *"Nếu hai sinh viên A và B đã cùng tham gia hoạt động X, thì họ có khả năng quan tâm đến những hoạt động tương tự."* Thay vì phân tích nội dung của hoạt động, phương pháp này xây dựng **mối quan hệ giữa các hoạt động** dựa trên **mẫu tương tác người dùng** (User Interaction Patterns).

### 2.3.1. Ma trận Đồng xuất hiện (Co-occurrence Matrix)

Độc lập với lãnh vực ứng dụng, **ma trận đồng xuất hiện** là một kỹ thuật mạnh mẽ để phát hiện mối liên hệ ẩn:

**Định nghĩa:** Ma trận đồng xuất hiện $M_{\text{cooc}}$ là một ma trận vuông kích thước $m \times m$ (m = số hoạt động), trong đó phần tử $M[i][j]$ biểu thị **số sinh viên đã tham gia cả hoạt động $i$ và hoạt động $j$**:

$$M_{\text{cooc}}[i][j] = \text{count}(\text{sinh viên tham gia cả } A_i \text{ và } A_j)$$

**Quá trình xây dựng:**

```
1. Khởi tạo ma trận M[m×m] với toàn bộ phần tử = 0

2. Duyệt qua lịch sử đăng ký của tất cả sinh viên
   for each sinh viên s:
      activities = danh sách hoạt động s đã tham gia
      for each cặp (a_i, a_j) trong activities:
         if i != j:
            M[i][j] += 1

3. Chuẩn hóa ma trận để đưa về thang [0, 1]
   max_cooc = max(all M[i][j])
   for all i, j:
      M[i][j] = M[i][j] / max_cooc
```

**Ví dụ chi tiết:**

Giả sử hệ thống có 4 sinh viên và 4 hoạt động:

| Sinh viên | Hoạt động tham gia |
|-----------|------------------|
| SV1 | [A1, A2] |
| SV2 | [A1, A2] |
| SV3 | [A1, A3] |
| SV4 | [A4] |

**Bước 1: Đếm đồng xuất hiện**

- A1 & A2: SV1, SV2 tham gia → count = 2
- A1 & A3: SV3 tham gia → count = 1
- A1 & A4: 0
- A2 & A3: 0
- A2 & A4: 0
- A3 & A4: 0

Ma trận thô:

$$M_{\text{raw}} = \begin{pmatrix} 0 & 2 & 1 & 0 \\ 2 & 0 & 0 & 0 \\ 1 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{pmatrix}$$

**Bước 2: Chuẩn hóa** (max = 2):

$$M_{\text{cooc}} = \begin{pmatrix} 0 & 1.0 & 0.5 & 0 \\ 1.0 & 0 & 0 & 0 \\ 0.5 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{pmatrix}$$

**Diễn giải:**
- A1 và A2 có mối liên hệ mạnh nhất (1.0 = 100%) - 2 sinh viên cùng tham gia
- A1 và A3 có mối liên hệ trung bình (0.5 = 50%) - 1 sinh viên cùng tham gia
- A4 không có liên hệ với bất kỳ hoạt động nào

### 2.3.2. Tính điểm Lọc cộng tác (Collaborative Score Calculation)

Để tính điểm lọc cộng tác cho một hoạt động $a_{\text{candidate}}$ dựa trên lịch sử tham gia của sinh viên, hệ thống sử dụng công thức **trung bình điểm đồng xuất hiện** (Average Co-occurrence Score):

$$S_{\text{collab}}(a_{\text{candidate}}) = \frac{1}{|H|} \sum_{a_i \in H} M_{\text{cooc}}[a_i][a_{\text{candidate}}]$$

Trong đó:
- $H$: Tập hợp các hoạt động mà sinh viên đã tham gia (History)
- $|H|$: Số lượng hoạt động trong lịch sử
- $M_{\text{cooc}}[i][j]$: Điểm đồng xuất hiện chuẩn hóa giữa hoạt động $i$ và $j$

**Ví dụ:**

```
Giả sử:
- Sinh viên đã tham gia: [A1, A2]
- Xem xét hoạt động ứng viên: A3

Ma trận co-occurrence:
M_cooc = 
    A1    A2    A3
A1 [0    1.0   0.5]
A2 [1.0  0     0]
A3 [0.5  0     0]

Tính điểm:
Từ A1: M[A1][A3] = 0.5
Từ A2: M[A2][A3] = 0

S_collab(A3) = (0.5 + 0) / 2 = 0.25
```

**Diễn giải:** Hoạt động A3 có mức độ phù hợp **25%** theo tiêu chí lọc cộng tác, vì:
- A3 có liên hệ trung bình (50%) với A1 (một hoạt động sinh viên đã tham gia)
- A3 không có liên hệ (0%) với A2 (hoạt động khác sinh viên đã tham gia)

---

## 2.4. Cơ chế Scoring Lai ghép (Hybrid Scoring Mechanism)

Sau khi tính toán riêng rẽ **điểm lọc dựa trên nội dung** ($S_{\text{content}}$) và **điểm lọc cộng tác** ($S_{\text{collab}}$), bước tiếp theo là **kết hợp hai điểm này** thành một **điểm tổng hợp duy nhất** (Unified Score) đại diện cho mức độ phù hợp toàn diện của hoạt động đối với sinh viên.

### 2.4.1. Chuẩn hóa điểm số (Score Normalization)

Trước khi thực hiện phép cộng tuyến tính, cần đảm bảo cả hai điểm đều nằm trong cùng một thang đo. Mặc dù cả Cosine Similarity và Co-occurrence đều cho kết quả trong [0, 1], nhưng để bảo toàn tính đơn điệu và ổn định số, hệ thống áp dụng công thức chuẩn hóa **Min-Max Scaling** [2]:

$$\text{norm}(x) = \frac{x - \min(S)}{\max(S) - \min(S)}$$

Tuy nhiên, vì cả hai điểm đã ở trong [0, 1], nên việc chuẩn hóa có thể được **bỏ qua** hoặc chỉ áp dụng **clamping** để đảm bảo không có giá trị ngoài [0, 1]:

$$S_{\text{norm}} = \text{clamp}(S, 0.0, 1.0)$$

### 2.4.2. Công thức tính điểm Lai ghép

Điểm tổng hợp được tính bằng cách **kết hợp tuyến tính** hai thành phần với các trọng số đã xác định:

$$S_{\text{hybrid}} = w_{\text{content}} \cdot S_{\text{content,norm}} + w_{\text{collab}} \cdot S_{\text{collab,norm}}$$

$$S_{\text{hybrid}} = 0.60 \times S_{\text{content}} + 0.40 \times S_{\text{collab}}$$

### 2.4.3. Thêm yếu tố đa dạng (Diversity Factor)

Để tránh việc lặp lại các gợi ý giống nhau trong các lần truy vấn liên tiếp và khuyến khích sinh viên khám phá những hoạt động mới, hệ thống **thêm một thành phần ngẫu nhiên nhỏ**:

$$\text{noise} = \text{random}(0.0, 0.1)$$

$$S_{\text{with\_noise}} = S_{\text{hybrid}} + \text{noise}$$

### 2.4.4. Thưởng điểm cho hoạt động có tiêu chí (Criteria Bonus)

Các hoạt động được liên kết với **tiêu chí đạt được** (Achievement Criteria - như chứng chỉ, kỹ năng) thường có giá trị giáo dục cao hơn. Hệ thống thêm một **điểm thưởng nhỏ** (+0.1) nếu hoạt động có tiêu chí:

$$\text{criteria\_bonus} = \begin{cases} 0.1 & \text{if hoạt động có tiêu chí} \\ 0.0 & \text{otherwise} \end{cases}$$

$$S_{\text{final}} = S_{\text{with\_noise}} + \text{criteria\_bonus}$$

### 2.4.5. Clamping vào [0, 1]

Bước cuối cùng, đảm bảo điểm số **nằm trong khoảng [0, 1]** để có thể so sánh công bằng với các hoạt động khác:

$$S_{\text{final}} = \text{clamp}(S_{\text{final}}, 0.0, 1.0)$$

**Ví dụ tính toán đầy đủ:**

```
Hoạt động: Workshop Lãnh đạo

Bước 1: Tính điểm nội dung
S_content = 0.919

Bước 2: Tính điểm cộng tác
S_collab = 0.25

Bước 3: Kết hợp điểm
S_hybrid = 0.60 × 0.919 + 0.40 × 0.25
         = 0.5514 + 0.1
         = 0.6514

Bước 4: Thêm yếu tố ngẫu nhiên
noise = 0.062 (random)
S_with_noise = 0.6514 + 0.062 = 0.7134

Bước 5: Thêm điểm thưởng (nếu có tiêu chí)
criteria_bonus = 0.1
S_final = 0.7134 + 0.1 = 0.8134

Bước 6: Clamping
S_final = clamp(0.8134, 0.0, 1.0) = 0.8134

Kết quả cuối cùng: 81.34% phù hợp
```

---

## 2.5. Cơ chế Lọc và Ràng buộc (Filtering and Constraints)

Không phải tất cả các hoạt động đều phù hợp để gợi ý cho một sinh viên cụ thể. Hệ thống áp dụng một loạt **bộ lọc logic** để loại trừ những hoạt động không phù hợp trước khi tính điểm, giúp **tối ưu hóa hiệu năng** và **đảm bảo tính hợp lý** của gợi ý.

### 2.5.1. Lọc trạng thái hoạt động (Activity Status Filter)

Chỉ những hoạt động với trạng thái **"PUBLISHED"** (đã xuất bản) mới được xem xét:

$$\text{filter}_{\text{status}} : A_j \text{ được bảo lưu} \iff \text{status}(A_j) = \text{PUBLISHED}$$

**Ý nghĩa:** Các hoạt động đang ở trạng thái **nháp** (Draft), **hủy bỏ** (Cancelled), hoặc **đã kết thúc** (Archived) sẽ không được gợi ý.

### 2.5.2. Lọc hoạt động đã đăng ký (Registration Filter)

Tránh gợi ý những hoạt động sinh viên đã tham gia hoặc đã đăng ký:

$$\text{filter}_{\text{registered}} : A_j \text{ được bảo lưu} \iff A_j \notin H(s)$$

Trong đó $H(s)$ là tập hợp các hoạt động mà sinh viên $s$ đã tham gia/đăng ký.

**Ý nghĩa:** Không có ý nghĩa khi gợi ý lại những hoạt động sinh viên đã tham gia.

### 2.5.3. Lọc xung đột lịch trình (Schedule Conflict Filter)

Các hoạt động **trùng lịch** (có thời gian overlap) với những hoạt động sinh viên đã đăng ký sẽ bị loại trừ:

$$\text{filter}_{\text{schedule}} : A_j \text{ được bảo lưu} \iff \neg \text{hasConflict}(A_j, H(s))$$

Trong đó:

$$\text{hasConflict}(A_j, H(s)) = \exists A_i \in H(s) : \text{start}(A_j) < \text{end}(A_i) \land \text{end}(A_j) > \text{start}(A_i)$$

**Ví dụ:**

```
Sinh viên đã đăng ký:
- Activity 1: 09:00 - 11:00 (ngày 15/5)

Xem xét các hoạt động ứng viên:
- Activity 2: 10:30 - 12:00 (ngày 15/5) → XUNG ĐỘT (10:30 < 11:00 và 12:00 > 09:00)
- Activity 3: 09:00 - 11:00 (ngày 16/5) → KHÔNG XUNG ĐỘT (ngày khác)
- Activity 4: 14:00 - 16:00 (ngày 15/5) → KHÔNG XUNG ĐỘT (không overlap)
```

### 2.5.4. Ngưỡng điểm tối thiểu (Minimum Score Threshold)

Tùy chọn, hệ thống có thể thiết lập một **ngưỡng điểm tối thiểu** để lọc ra những gợi ý có độ phù hợp quá thấp:

$$\text{filter}_{\text{threshold}} : A_j \text{ được bảo lưu} \iff S_{\text{final}}(A_j) \geq \theta_{\text{min}}$$

Mặc định $\theta_{\text{min}} = 0.0$ (không lọc), nhưng có thể điều chỉnh nếu cần.

---

## 2.6. Tối ưu hóa Hiệu năng và Lưu trữ (Performance and Storage Optimization)

Để đảm bảo hệ thống gợi ý hoạt động **mượt mà** với **độ trễ thấp** (Low Latency) ngay cả khi dữ liệu tăng lên, cần áp dụng các kỹ thuật tối ưu hóa ở mức cơ sở dữ liệu và ứng dụng.

### 2.6.1. Connection Pooling (Quản lý Hồ bơi Kết nối)

Mở/đóng kết nối đến cơ sở dữ liệu là một quá trình **tốn kém tài nguyên**, thường **mất 100-500ms** mỗi khi thực hiện. Để tối ưu hóa, hệ thống duy trì một **"hồ bơi" (pool) các kết nối sẵn sàng**:

| Tham số | Giá trị | Ý nghĩa |
|--------|--------|---------|
| `pool_size` | 10 | Số kết nối cơ bản luôn duy trì |
| `max_overflow` | 20 | Có thể tạo thêm tối đa 20 kết nối nếu cần |
| **Total max connections** | 30 | Tối đa 30 kết nối đồng thời |

**Lợi ích:**
- Tái sử dụng kết nối không cần mở lại → Giảm độ trễ kết nối
- Tự động quản lý vòng đời kết nối → Giảm rủi ro rò rỉ tài nguyên
- Xử lý **concurrent requests** hiệu quả → Tăng throughput

### 2.6.2. Chiến lược lọc Query (Query Filtering Strategy)

Thay vì tải **tất cả dữ liệu** từ cơ sở dữ liệu rồi lọc trong bộ nhớ ứng dụng, hệ thống **lọc sớm ở mức cơ sở dữ liệu**:

```sql
-- TỐT: Lọc ở mức DB
SELECT * FROM activities 
WHERE status = 'PUBLISHED' 
  AND activity_id NOT IN (
    SELECT activity_id FROM activity_registrations 
    WHERE user_id = ?
  );

-- KHÔNG TỐT: Lấy tất cả rồi lọc trong ứng dụng
SELECT * FROM activities;  -- Tải 10,000 hoạt động
-- → Lọc trong code → Chỉ lấy 50 hoạt động phù hợp
```

**Lợi ích:**
- Giảm **lưu thông mạng** (Network I/O)
- Giảm **sử dụng RAM** ở phía ứng dụng
- Tận dụng **chỉ mục cơ sở dữ liệu** để tìm kiếm nhanh

### 2.6.3. Tối ưu hóa Ma trận Đồng xuất hiện (Co-occurrence Matrix Optimization)

Ma trận đồng xuất hiện là **ma trận _thưa_** (Sparse Matrix) - chỉ một **phần nhỏ** các phần tử khác 0. Lưu trữ dưới dạng ma trận **đầy đủ** (Dense Matrix) sẽ lãng phí bộ nhớ:

**Ví dụ:**
- Hệ thống có 1,000 hoạt động
- Ma trận đầy đủ: 1,000 × 1,000 = 1,000,000 phần tử
- Nếu mỗi phần tử 4 bytes (float32) → 4 MB
- **Nhưng 99% đều là 0** → Lãng phí!

**Giải pháp: Lưu trữ dạng Dictionary (Sparse Representation)**

```python
# Thay vì: co_occurrence[1000][1000] = 4MB
# Dùng: Dictionary lưu trữ chỉ các phần tử khác 0
co_occurrence = {
    1: {2: 0.5, 5: 0.3, 10: 0.7},      # Activity 1 liên quan đến 3 activities
    2: {1: 0.5, 15: 0.2},              # Activity 2 liên quan đến 2 activities
    # ... chỉ lưu những phần tử khác 0
}
# → Chỉ cần 10-50 KB thay vì 4 MB
```

### 2.6.4. Chiến lược Filtering sớm (Early Termination)

Trước khi thực hiện các phép tính expensive, hệ thống **lọc sớm** để loại trừ những hoạt động rõ ràng không phù hợp:

| Bước | Hành động | Lợi ích |
|------|----------|---------|
| 1 | Lọc trạng thái `PUBLISHED` | Giảm 50-70% dữ liệu |
| 2 | Loại bỏ đã đăng ký | Giảm 20-40% dữ liệu còn lại |
| 3 | Kiểm tra xung đột lịch trình | Lọc thêm 10-20% |
| 4 | Tính Cosine Similarity | Chỉ tính cho <100 hoạt động |
| 5 | Xây dựng co-occurrence | Chỉ cần với <100 hoạt động |

**Lợi ích:** Giảm **đáng kể** số lượng tính toán toán học (Cosine, co-occurrence) cần thiết.

---

## 2.7. Kiến trúc dữ liệu (Data Architecture)

Để hỗ trợ hiệu quả các phép toán của hệ thống gợi ý, cơ sở dữ liệu được thiết kế với các **mối quan hệ** và **chỉ mục** cụ thể.

### 2.7.1. Sơ đồ Thực thể - Quan hệ (Entity-Relationship Diagram)

```
┌─────────────────────┐
│    UserInterest     │ (Hồ sơ sở thích sinh viên)
├─────────────────────┤
│ id (PK)             │
│ user_id (FK)        │──────────────────┐
│ tag_id (FK)         │──────────┐       │
│ weight              │          │       │
└─────────────────────┘          │       │
                                 │       │
                    ┌────────────▼───────▼───────────┐
                    │           Tag                  │
                    ├────────────────────────────────┤
                    │ id (PK)                        │
                    │ name                           │
                    │ createdAt, updatedAt           │
                    └────────────────────────────────┘
                                 ▲
                                 │
                    ┌────────────┴────────────┐
                    │                         │
┌──────────────────────────────┐  ┌─────────────────────────┐
│       ActivityTag            │  │      Activity           │
├──────────────────────────────┤  ├─────────────────────────┤
│ activity_id (FK)             │  │ id (PK)                 │
│ tag_id (FK)                  │  │ title                   │
└──────────────────────────────┘  │ description             │
                    ▲               │ categoryId              │
                    │               │ startTime, endTime      │
                    │               │ location                │
                    │               │ status                  │
                    │               │ criteriaGroupId         │
                    │               │ ...                     │
                    │               └─────────────────────────┘
                    │                         ▲
                    └─────────────────────────┴──┐
                                                 │
          ┌──────────────────────────────────────┴───────────┐
          │                                                  │
┌─────────▼──────────────────┐     ┌──────────────────────────┐
│ActivityRegistration        │     │ UserActivitySchedule     │
├────────────────────────────┤     ├──────────────────────────┤
│ id (PK)                    │     │ id (PK)                  │
│ user_id (FK)               │     │ user_id (FK)             │
│ activity_id (FK)           │     │ activity_id (FK)         │
│ proofStatus                │     │ startTime, endTime       │
│ registeredAt               │     │ createdAt                │
└────────────────────────────┘     └──────────────────────────┘
```

### 2.7.2. Bảng Dữ liệu Chính

| Bảng | Mục đích | Cột quan trọng |
|------|---------|----------------|
| **Tag** | Danh sách thẻ phân loại | id, name |
| **UserInterest** | Hồ sơ sở thích người dùng | user_id, tag_id, weight |
| **Activity** | Kho hoạt động | id, title, status, criteriaGroupId |
| **ActivityTag** | Liên kết hoạt động - thẻ (M2M) | activity_id, tag_id |
| **ActivityRegistration** | Lịch sử tham gia | user_id, activity_id, proofStatus |
| **UserActivitySchedule** | Lịch biểu hoạt động của người dùng | user_id, activity_id, startTime, endTime |

### 2.7.3. Chỉ mục (Indexes) để tối ưu Query

```sql
-- Tìm kiếm nhanh hoạt động theo trạng thái
CREATE INDEX idx_activity_status ON Activity(status);

-- Tìm kiếm nhanh các hoạt động của một sinh viên
CREATE INDEX idx_activity_registration_user ON ActivityRegistration(user_id);

-- Tìm kiếm nhanh các hoạt động với một thẻ cụ thể
CREATE INDEX idx_activity_tag_tag ON ActivityTag(tag_id);

-- Tìm kiếm nhanh sở thích của một sinh viên
CREATE INDEX idx_user_interest_user ON UserInterest(user_id);

-- Kiểm tra xung đột lịch trình hiệu quả
CREATE INDEX idx_schedule_user ON UserActivitySchedule(user_id);
```

---

## 2.8. Ví dụ Toàn diện: Gợi ý cho một sinh viên

Giả sử sinh viên **Nguyễn Văn A** muốn nhận gợi ý các hoạt động. Dưới đây là quy trình **bước-bước** của hệ thống:

### Bước 1: Lấy hồ sơ sở thích

```
Query: 
SELECT tag_id, weight 
FROM UserInterest 
WHERE user_id = 'nguyen-van-a'

Kết quả:
- Leadership: 0.8
- Development: 0.6
- Sports: 0.4

Vector sở thích (chuẩn hóa):
u = [1.0, 0.75, 0.5]
```

### Bước 2: Lấy lịch sử tham gia

```
Query:
SELECT activity_id 
FROM ActivityRegistration 
WHERE user_id = 'nguyen-van-a' 
  AND proofStatus = 'VERIFIED'

Kết quả (hoạt động để loại trừ):
H = [A1, A2]
```

### Bước 3: Lấy các hoạt động ứng viên

```
Query:
SELECT A.id, A.title, A.startTime, A.endTime,
       GROUP_CONCAT(AT.tag_id) as tags
FROM Activity A
LEFT JOIN ActivityTag AT ON A.id = AT.activity_id
WHERE A.status = 'PUBLISHED'
  AND A.id NOT IN (A1, A2)
GROUP BY A.id

Kết quả:
- A3 (Workshop Lãnh đạo): tags=[Leadership, Development]
- A4 (Lập trình): tags=[Development]
- A5 (Marathon): tags=[Sports]
- A6 (Triển lãm Nghệ thuật): tags=[]
```

### Bước 4: Kiểm tra xung đột lịch trình

```
Query:
SELECT uas.activity_id FROM UserActivitySchedule uas
WHERE uas.user_id = 'nguyen-van-a'
  AND EXISTS (
    SELECT 1 FROM Activity a
    WHERE a.id = uas.activity_id
      AND NOT (a.endTime <= incoming_activity.startTime 
               OR a.startTime >= incoming_activity.endTime)
  )

Giả sử: A4 trùng lịch → loại bỏ
Hoạt động ứng viên còn lại: [A3, A5, A6]
```

### Bước 5: Tính điểm nội dung

```
A3 = [1, 1, 0]
Similarity = (1.0×1 + 0.75×1 + 0.5×0) / (√1.8125 × √2) ≈ 0.919

A5 = [0, 0, 1]
Similarity = (1.0×0 + 0.75×0 + 0.5×1) / (√1.8125 × √1) ≈ 0.373

A6 = [0, 0, 0]
Similarity = 0.0
```

### Bước 6: Xây dựng ma trận đồng xuất hiện

```
Từ lịch sử:
- SV1: [A1, A3]
- SV2: [A1, A3]
- SV3: [A2, A5]

Co-occurrence:
M[A1][A3] = 2 (SV1, SV2)
M[A3][A5] = 0
M[A5][A6] = 0

Max = 2, chuẩn hóa:
M[A1][A3] = 1.0
M[A3][A5] = 0.0
M[A5][A6] = 0.0
```

### Bước 7: Tính điểm cộng tác

```
Sinh viên đã tham gia: [A1, A2]

Cho A3:
- M[A1][A3] = 1.0
- M[A2][A3] = ? (không có)
S_collab(A3) = 1.0 / 1 = 1.0

Cho A5:
- M[A1][A5] = 0.0
- M[A2][A5] = 0.0
S_collab(A5) = 0.0 / 2 = 0.0

Cho A6:
- M[A1][A6] = 0.0
- M[A2][A6] = 0.0
S_collab(A6) = 0.0 / 2 = 0.0
```

### Bước 8: Tính điểm lai ghép

```
A3:
S_hybrid = 0.60 × 0.919 + 0.40 × 1.0 = 0.551 + 0.4 = 0.951
noise = 0.045
criteria_bonus = 0.1 (có tiêu chí)
S_final = 0.951 + 0.045 + 0.1 = 1.096 → clamp → 1.0 (100%)

A5:
S_hybrid = 0.60 × 0.373 + 0.40 × 0.0 = 0.224
noise = 0.083
criteria_bonus = 0.0
S_final = 0.224 + 0.083 = 0.307 (30.7%)

A6:
S_hybrid = 0.60 × 0.0 + 0.40 × 0.0 = 0.0
noise = 0.02
criteria_bonus = 0.0
S_final = 0.02 (2%)
```

### Bước 9: Sắp xếp và trả về

```
Sắp xếp theo điểm giảm dần:
1. A3: 100% (Workshop Lãnh đạo)
2. A5: 30.7% (Marathon)
3. A6: 2% (Triển lãm Nghệ thuật)

Nếu limit = 2, trả về: [A3, A5]
```

---

## 2.9. Độ phức tạp tính toán (Computational Complexity)

Phân tích độ phức tạp thời gian của thuật toán:

| Thao tác | Độ phức tạp | Lý do |
|----------|-----------|------|
| Lọc trạng thái & đã đăng ký | O(n) | Duyệt tất cả n hoạt động |
| Xây dựng vector sở thích | O(k) | k = số thẻ người dùng (thường <20) |
| Tính Cosine Similarity | O(n × k) | n hoạt động × k thẻ |
| Xây dựng co-occurrence | O(m × u) | m = số đã tham gia, u = số hoạt động khác |
| Tính điểm cộng tác | O(n × m) | n hoạt động × m đã tham gia |
| Sắp xếp | O(n log n) | Sắp xếp n hoạt động |
| **Tổng cộng** | **O(n log n)** | Chiếm ưu thế bởi sắp xếp |

Với điều kiện n < 1,000 và k, m < 100, thời gian thực hiện **dưới 100ms** là khả thi.

---

## 2.10. Lợi thế và Hạn chế của Mô hình

### 2.10.1. Lợi thế

1. **Xử lý Cold-Start Problem**: Content-Based giúp gợi ý cho sinh viên mới chỉ dựa trên sở thích khai báo
2. **Đa dạng**: Kết hợp content + collaborative + randomness → Gợi ý không nhàm chán
3. **Ổn định**: Vì phần lớn là content-based → Không phụ thuộc quá nhiều vào dữ liệu thưa
4. **Scalable**: Không cần embedding models hoặc neural networks → Tính toán nhanh
5. **Interpretable**: Có thể giải thích tại sao một hoạt động được gợi ý (dựa trên thẻ nào)

### 2.10.2. Hạn chế

1. **Thiếu context**: Không xem xét các yếu tố như thời gian, địa điểm, độ khó
2. **Shallow similarity**: Chỉ so sánh thẻ, không "hiểu" nội dung sâu
3. **Shilling attacks**: Có thể bị tấn công bằng cách tạo fake accounts để lợi ích một hoạt động
4. **Collaborative sparsity**: Với ít dữ liệu lịch sử, phần collaborative yếu
5. **Long-tail problem**: Các hoạt động ít tham gia khó được gợi ý

---

## Tài liệu tham khảo

[1] Burke, R. (2002). "Hybrid Recommender Systems: Survey and Evaluation". _User Modeling and User-Adapted Interaction_, 12(4), 331-370.

[2] Han, J., Kamber, M., & Pei, J. (2011). _Data Mining: Concepts and Techniques_ (3rd ed.). Morgan Kaufmann.

[3] Resnick, P., & Varian, H. R. (1997). "Recommender Systems". _Communications of the ACM_, 40(3), 56-58.

[4] Linden, G., Smith, B., & York, J. (2003). "Amazon.com Recommendations: Item-to-Item Collaborative Filtering". _IEEE Internet Computing_, 7(1), 76-80.

[5] Breese, J. S., Heckerman, D., & Kadie, C. (1998). "Empirical Analysis of Predictive Algorithms for Collaborative Filtering". _Proceedings of the 14th Conference on Uncertainty in Artificial Intelligence_.

---

**Ghi chú:** Tài liệu này được biên soạn dựa trên việc triển khai thực tế của hệ thống gợi ý hoạt động sinh viên tại Đại học Cần Thơ, với dữ liệu cấu hình từ năm học 2025-2026. Các công thức và ví dụ được chuẩn hóa để phù hợp với tính chất từng lĩnh vực ứng dụng.
