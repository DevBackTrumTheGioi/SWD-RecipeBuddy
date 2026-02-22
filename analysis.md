# 📊 Phân Tích Hệ Thống RecipeBuddy

Tài liệu này phân tích sâu về các Actor (Tác nhân) và Use Case (Trường hợp sử dụng) của hệ thống RecipeBuddy để đảm bảo trải nghiệm người dùng tối ưu và luồng nghiệp vụ chặt chẽ.

---

## 1. Phân Tích Actor (Tác Nhân)

### 1.1. Người dùng (User) - Target chính
Chia làm 2 trạng thái:
- **Khách (Guest):** Những người truy cập vãng lai.
  - *Mục tiêu:* Tìm nhanh món ăn hôm nay, xem hướng dẫn nấu.
  - *Quyền hạn:* Xem trang chủ, tìm kiếm, xem chi tiết công thức.
- **Thành viên (Registered User):** Những người đã đăng nhập.
  - *Mục tiêu:* Quản lý sổ tay nấu ăn cá nhân, lưu giữ các món yêu thích.
  - *Quyền hạn:* 
    - Bao gồm tất cả quyền của Khách.
    - Lưu công thức vào "Sổ tay cá nhân" (Bookmark).
    - Đánh giá (Rate) và Bình luận (Review) công thức.
    - Tạo và quản lý "Danh sách đi chợ" (Shopping List).
    - (Mở rộng) Đóng góp công thức riêng.

### 1.2. Quản trị viên (Admin)
- *Mục tiêu:* Đảm bảo chất lượng nội dung, giữ cho cộng đồng "sạch" và tích cực.
- *Quyền hạn:*
  - Quản lý danh mục (Thêm/Sửa/Xóa loại món ăn).
  - Quản lý công thức (Duyệt công thức từ người dùng, sửa/xóa các công thức vi phạm).
  - Quản lý người dùng (Block/Unblock tài khoản).
  - Xem báo cáo thống kê (Lượt xem, món ăn trending).

---

## 2. Luồng Use Case Chính (Main Flows)

### 2.1. Luồng Khám Phá & Tìm Kiếm (Discovery Flow)
Đây là luồng quan trọng nhất để giữ chân người dùng.
1. **Khởi đầu:** User vào trang chủ.
2. **Hành động:** 
   - Xem gợi ý theo thời gian (Sáng/Trưa/Chiều).
   - Chọn một Category (VD: "Món chay", "Dưới 50k").
   - Nhập từ khóa vào ô Search.
3. **Xử lý:** Hệ thống lọc dữ liệu từ Supabase theo tiêu chí.
4. **Kết thúc:** Hiển thị danh sách Recipe Card.

### 2.2. Luồng Nấu Ăn (Cooking Flow - UX Trọng tâm)
1. **Khởi đầu:** User chọn một món ăn cụ thể.
2. **Hành động:** 
   - User kiểm tra nguyên liệu (Tick vào checkbox để đánh dấu món đã chuẩn bị).
   - User nhấn nút "Bắt đầu nấu" (Vào chế độ Cooking Mode).
3. **Xử lý:** Màn hình chuyển sang dạng Slide/Thẻ lớn, giữ màn hình luôn sáng.
4. **Hành động:** User vuốt qua từng bước, nhấn vào Timer (nếu có) để đếm ngược thời gian.
5. **Kết thúc:** Hoàn thành món ăn, User quay lại trang chi tiết.

### 2.3. Luồng Quản Lý Nội Dung (Admin Workflow)
1. **Khởi đầu:** Admin đăng nhập vào Dashboard.
2. **Hành động:** Xem danh sách công thức mới được người dùng đóng góp.
3. **Kiểm duyệt:** 
   - Kiểm tra hình ảnh (có nhạy cảm không?).
   - Kiểm tra nội dung (có đầy đủ các bước không?).
4. **Quyết định:** 
   - "Duyệt": Công thức xuất hiện công khai trên App.
   - "Từ chối": Gửi thông báo kèm lý do cho người dùng.

---

## 3. Chi Tiết Use Case Cho Thành Viên (Registered User)

### 3.1. Quản lý Tài khoản (Authentication & Profile)
| Use Case | Mô tả | Kết quả mong đợi |
| :--- | :--- | :--- |
| **Đăng ký/Đăng nhập** | Người dùng tạo tài khoản hoặc đăng nhập qua Google/Email. | Truy cập được vào dữ liệu cá nhân (Bookmark, Shopping list). |
| **Cập nhật hồ sơ** | Thay đổi tên hiển thị, ảnh đại diện, khẩu vị cá nhân. | Thông tin được cá nhân hóa trên toàn App. |
| **Đăng xuất** | Thoát khỏi phiên làm việc. | Đảm bảo tính riêng tư của dữ liệu trên thiết bị dùng chung. |

### 3.2. Tương tác với Công thức (Recipe Interaction)
| Use Case | Mô tả | Kết quả mong đợi |
| :--- | :--- | :--- |
| **Lưu món tiêu biểu** | Nhấn icon "Lưu" trên Recipe Card hoặc trang chi tiết. | Công thức xuất hiện trong mục "Sổ tay của tôi". |
| **Bỏ lưu món** | Xóa công thức khỏi danh sách yêu thích. | Danh sách yêu thích được cập nhật ngay lập tức. |
| **Đánh giá & Bình luận** | Gửi số sao (1-5) và nội dung nhận xét sau khi nấu. | Điểm số trung bình của món ăn được cập nhật; bình luận hiển thị công khai. |
| **Đóng góp công thức** | Tải lên món ăn tự sáng tạo (ảnh, nguyên liệu, các bước). | Công thức ở trạng thái "Chờ duyệt" trước khi Admin kiểm tra. |

### 3.3. Hỗ trợ Nấu nướng (Cooking Support)
| Use Case | Mô tả | Kết quả mong đợi |
| :--- | :--- | :--- |
| **Tạo danh sách đi chợ** | Nhấn "Thêm vào giỏ" các nguyên liệu chưa có sẵn. | Nguyên liệu được gom nhóm theo loại (Rau, Thịt, Gia vị) trong Shopping List. |
| **Đánh dấu đã mua** | Cập nhật trạng thái các nguyên liệu trong khi đi chợ. | Danh sách liệt kê rõ món nào còn thiếu. |

---

## 4. Chi Tiết Use Case Cho Quản Trị Viên (Admin)

### 4.1. Quản lý Nội dung (Content Moderation)
| Use Case | Mô tả | Kết quả mong đợi |
| :--- | :--- | :--- |
| **Kiểm duyệt công thức** | Xem, sửa lỗi chính tả, hoặc xóa công thức người dùng tải lên. | Hệ thống chỉ chứa các nội dung chất lượng cao, đúng quy chuẩn. |
| **Quản lý Danh mục** | Thêm các danh mục mới (VD: "Món Tết", "Món nhậu"). | Các danh mục mới xuất hiện trên trang chủ. |
| **Quản lý Bình luận** | Xóa các bình luận không phù hợp hoặc mang tính công kích. | Duy trì môi trường cộng đồng văn minh. |

### 4.2. Quản lý Hệ thống (System Management)
| Use Case | Mô tả | Kết quả mong đợi |
| :--- | :--- | :--- |
| **Thống kê Dashboard** | Xem biểu đồ lượt xem, lượng user mới, công thức hot nhất. | Giúp Admin đưa ra định hướng nội dung phù hợp. |
| **Quản lý Người dùng** | Xem danh sách user, khóa tài khoản vi phạm chính sách. | Đảm bảo an ninh cho hệ thống. |

---

## 5. Sơ đồ Use Case (Tóm lược)

```mermaid
usecaseDiagram
    actor "Khách/User" as U
    actor "Admin" as A

    package "Khám phá & Xem" {
        U -- (Tìm kiếm công thức)
        U -- (Xem chi tiết món ăn)
        U -- (Sử dụng Cooking Mode)
    }

    package "Tương tác (Cần Đăng nhập)" {
        U -- (Lưu món yêu thích)
        U -- (Đánh giá/Bình luận)
        U -- (Tạo Shopping List)
    }

    package "Quản trị" {
        A -- (Duyệt công thức)
        A -- (Quản lý User)
        A -- (Quản lý Danh mục)
    }
```

---

## 6. Phân Tích Trái Nghiệm Mobile (Mobile-First Focus)

Vì Project ưu tiên Mobile, các luồng trên sẽ được thiết kế theo quy tắc:
- **One-Handed Operation:** Các nút quan trọng (Search, Save, Link tới Cooking Mode) nằm ở khu vực ngón cái dễ chạm tới (phía dưới hoặc giữa màn hình).
- **Offline Readiness:** (Giai đoạn sau) Lưu tạm công thức đang xem vào Cache để nếu vào bếp sóng yếu vẫn xem được.
- **Micro-Interactions:** Hiệu ứng rung nhẹ (Haptic) khi tick vào danh sách nguyên liệu hoặc khi Timer hoàn thành.
