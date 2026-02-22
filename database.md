# Kiến Trúc Cơ Sở Dữ Liệu (Supabase/PostgreSQL)

## 1. Phân Tích & Giải Pháp Cấu Trúc
Để đáp ứng các tính năng cốt lõi (Tìm kiếm thông minh, Tủ lạnh có gì, Đi chợ, Kiểm duyệt), CSDL cần đạt chuẩn Normalization (Chuẩn hóa) thứ 3 (3NF) nhưng vẫn tối ưu truy vấn đọc.

- **Quản lý Nguyên liệu (Master Data):** Thay vì lưu text tự do, cần bảng `ingredients_master` để chuẩn hóa dữ liệu. Điều này bẳt buộc cho tính năng "Tủ lạnh có gì?" và gom nhóm "Shopping List" (Ví dụ: Cà chua luôn thuộc nhóm Rau củ).
- **Hệ thống Tags Đa Biến (Polymorphic-like):** Dùng `tags` thay vì `category_id` đơn lẻ. Giúp một công thức đáp ứng nhiều bộ lọc (Thời gian, Độ khó, Bữa ăn, Bộ sưu tập "Dưới 50k", "Eat Clean").
- **Workflow Kiểm Duyệt:** Cần trường `status` và bảng log để Admin theo dõi lịch sử duyệt bài.

---

## 2. Lược Đồ Bảng (Schema Design)

### 2.1. Authentication & Users
Hệ thống sử dụng **Supabase Auth** làm cơ chế xác thực chính (Ưu tiên: Google OAuth). 
- **Cơ chế:** Khi đăng nhập Google thành công, Supabase tự quản lý user trong schema `auth`. 
- **Đồng bộ:** Dùng Database Trigger để map `auth.users` sang bảng `profiles` dưới đây.

| Bảng | Cột | Kiểu | Ràng buộc / Khóa | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| **profiles** | id | uuid | PK, FK(auth.users.id) | Khởi tạo qua Trigger |
| | username | varchar(50) | UNIQUE | Tên hiển thị định danh |
| | full_name | text | | |
| | avatar_url | text | | |
| | role | enum | 'user', 'admin' | Phân quyền truy cập |

### 2.2. Master Data (Dữ liệu gốc)
| Bảng | Cột | Kiểu | Ràng buộc / Khóa | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| **tags** | id | uuid | PK | |
| | name | text | UNIQUE | Tên tag (VD: Món chay, Heo) |
| | type | enum | 'collection', 'meal_type', 'diet' | Phân loại hiển thị UI |
| | icon | text | | Tên icon Lucide |
| **ingredient_master**| id | uuid | PK | Danh mục nguyên liệu chuẩn |
| | name | text | UNIQUE | (VD: Cà chua, Thịt bò) |
| | category | enum | 'produce', 'meat', 'dairy', 'pantry'| Dùng để gom nhóm đi chợ |

### 2.3. Core Entity: Công Thức (Recipes)
| Bảng | Cột | Kiểu | Ràng buộc / Khóa | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| **recipes** | id | uuid | PK | |
| | author_id | uuid | FK(profiles.id) | Người đóng góp |
| | title | text | | |
| | description | text | | |
| | cover_image| text | | |
| | prep_time | int | | Phút |
| | cook_time | int | | Phút |
| | difficulty | enum | 'easy', 'medium', 'hard' | |
| | base_servings| int | Default: 2 | Khẩu phần gốc để tính tỷ lệ |
| | status | enum | 'draft', 'pending', 'published', 'rejected' | Flow kiểm duyệt |
| | avg_rating | decimal | Default: 0 | Denormalized: Tối ưu order/lọc |

### 2.4. Mapping & Chi Tiết Công Thức
| Bảng | Cột | Kiểu | Ràng buộc / Khóa | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| **recipe_tags** | recipe_id | uuid | PK, FK(recipes.id) | Junction Table |
| | tag_id | uuid | PK, FK(tags.id) | |
| **recipe_ingredients**| id | uuid | PK | |
| | recipe_id | uuid | FK(recipes.id) ON DELETE CASCADE | |
| | ingredient_id | uuid | FK(ingredient_master.id) | Map với Master data |
| | quantity | numeric | | (VD: 200, 1.5) Dùng tính toán tỈ lệ|
| | unit | varchar(20)| | (VD: gram, muỗng, quả) |
| | prep_note | text | | (VD: Thái lựu, Băm nhuyễn) |
| **recipe_steps** | id | uuid | PK | |
| | recipe_id | uuid | FK(recipes.id) ON DELETE CASCADE | |
| | step_order | int | | 1, 2, 3... |
| | content | text | | Hướng dẫn |
| | timer_seconds| int | Nullable | Sync với Cooking Mode |

### 2.5. Tương Tác Của Người Dùng (User Interactions)
| Bảng | Cột | Kiểu | Ràng buộc / Khóa | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| **bookmarks** | user_id | uuid | PK, FK(profiles.id) | |
| | recipe_id | uuid | PK, FK(recipes.id) | |
| | created_at | tmpstmp | | |
| **reviews** | id | uuid | PK | |
| | user_id | uuid | FK(profiles.id) | |
| | recipe_id | uuid | FK(recipes.id) | |
| | rating | int | 1 to 5 | Trigger tính lại avg_rating bảng recipes|
| | content | text | | |
| | is_hidden | boolean| Default: false | Admin ẩn |

### 2.6. Tiện Ích Cá Nhân (Productivity/Shopping)
| Bảng | Cột | Kiểu | Ràng buộc / Khóa | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| **shopping_list** | id | uuid | PK | |
| | user_id | uuid | FK(profiles.id) | |
| | ingredient_id | uuid | FK(ingredient_master.id) | Map để group (Rau, thịt) |
| | target_quantity| numeric | | |
| | unit | varchar(20)| | |
| | is_checked | boolean| Default: false | Đã mua chưa |
| **user_fridge** | user_id | uuid | PK, FK(profiles.id) | Tủ lạnh có gì |
| | ingredient_id | uuid | PK, FK(ingredient_master.id) | |

---

## 3. Indexes Đề Xuất (Tối Ưu Hiệu Năng)
- `idx_recipes_status`: Lọc món ăn đã duyệt (published).
- `idx_recipe_ingredients_ingredient_id`: Tìm món theo nguyên liệu (Tủ lạnh có gì).
- Trigram Search Index (`pg_trgm`) trên `recipes.title` cho thanh tìm kiếm.

## 4. Quản Lý Access Control (RLS - Row Level Security)
- **Select:** Public được xem recipes (`published`), tags, master data, reviews (không bị hidden). Người dùng xem được thông tin cá nhân. Admin xem tất cả.
- **Insert/Update/Delete:**
  - Users: Thay đổi profiles, bookmarks, shopping_list, fridge của chính họ. Đăng công thức (chỉ set status='pending|draft').
  - Admin: Toàn quyền cập nhật status recipes duyệt/xóa, quản lý tags/master data.
