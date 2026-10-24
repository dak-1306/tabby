# AGENT.md - Rules & Instructions for AI Code Agent

Bạn là một AI Software Engineer cao cấp, chịu trách nhiệm xây dựng ứng dụng Web Mobile (PWA) tên là **"Tabby"** dùng để chia tiền hóa đơn nhanh gọn, offline-first lưu LocalStorage, viết bằng Next.js 15 App Router, TypeScript, Tailwind CSS v4, Zustand và Shadcn UI.

Hãy tuân thủ nghiêm ngặt và tuyệt đối các quy chuẩn kiến trúc và nguyên tắc viết code dưới đây:

---

## 1. Quy tắc Quản lý Hằng số (Constants Management)

- **Cấm Hardcode:** Tuyệt đối KHÔNG viết trực tiếp chuỗi văn bản cố định, nhãn menu, thông báo lỗi, cài đặt mặc định, regex validation,... vào các file UI hay Logic.
- **Phân vùng Constant:**
  - Hằng số dùng chung toàn app -> Đặt tại `src/constants/`.
  - Hằng số riêng của tính năng -> Đặt tại `src/features/[feature_name]/constants/`.
  - Hằng số nội bộ 1 file -> Đặt lên **đầu file** (ngoài scope Component) bằng dạng `UPPER_SNAKE_CASE` (ví dụ: `const DEFAULT_PAGE_SIZE = 10;`).

---

## 2. Quy tắc Dùng Shadcn UI & Styling (Strict UI Rules)

- **Không phá vỡ Design System:** Tất cả các component UI dùng chung nằm tại `src/components/ui/` đã được custom chuẩn cho di động.
- **Hạn chế đè `className` tùy tiện:** KHÔNG truyền các class thay đổi khung nền tảng như `padding`, `rounded-*`, `font-size`, `bg-*` qua props `className` khi gọi component Shadcn ở bên ngoài, ngoại trừ class vị trí bố cục (`margin`, `width`, `flex/grid position`).
- **Tạo Variant mới:** Nếu cần một kiểu hiển thị lặp lại của component, hãy định nghĩa variant mới trong file gốc của component bằng `cva` thay vì truyền `className` dài ngoằng ở file trang.

---

## 3. Semantic Design System & Color Tokens

CẤM CỰC KỲ việc dùng mã màu thô (`#1a202c`) hoặc các màu Tailwind mặc định (`bg-slate-900`, `text-zinc-500`, `bg-white`). Mọi component BẮT BUỘC dùng **CSS Semantic Variables**:

| Mục đích                | Token bắt buộc                           | Ý nghĩa                                       |
| :---------------------- | :--------------------------------------- | :-------------------------------------------- |
| **Nền ứng dụng**        | `bg-background` / `text-foreground`      | Nền tổng thể ứng dụng.                        |
| **Thẻ / Khung**         | `bg-card` / `text-card-foreground`       | Nền các thẻ bill, card thành viên.            |
| **Thành phần phụ**      | `bg-muted` / `text-muted-foreground`     | Nền ô input, nhãn phụ, thông tin ngày tháng.  |
| **Nút bấm / Điểm nhấn** | `bg-primary` / `text-primary-foreground` | Xanh Emerald chủ đạo cho CTA chính & số tiền. |
| **Đường viền**          | `border-border` / `ring-ring`            | Viền thẻ, vạch phân cách.                     |
| **Cảnh báo / Xóa**      | `bg-destructive/10` / `text-destructive` | Nút xóa, hủy tác vụ.                          |

---

## 4. Quy chuẩn Typography, Spacing & Touch Target

- **Screen Title:** `text-xl font-bold tracking-tight text-foreground`
- **Card Title:** `text-base font-semibold tracking-tight text-foreground`
- **Body Text:** `text-sm text-foreground leading-normal`
- **Caption / Meta:** `text-xs text-muted-foreground leading-relaxed`
- **Badge / Label:** `text-[10px] font-medium tracking-tight`
- **Touch Target:** Chiều cao tối thiểu cho mọi phần tử có thể bấm trên di động là **44px** (`h-11`).

---

## 5. Chất lượng Code & Tách biệt Trách nhiệm (Code Quality)

1. **Giới hạn số dòng:** Tuyệt đối KHÔNG gộp chung Logic State (hooks/stores) và UI Presentation trong 1 file dài quá **150 dòng**. Phải tách nhỏ thành sub-components hoặc custom hooks.
2. **State Management:** Dùng Zustand với middleware `persist` lưu dữ liệu vào `window.localStorage`.
3. **TypeScript:** Định nghĩa TypeScript interfaces đầy đủ trong file `types.ts` của từng feature. Cấm dùng `any`.
4. **Viết Code Sạch:** Thêm comment giải thích ngắn gọn, xử lý mượt mà tất cả trường hợp dữ liệu rỗng (empty state) hoặc thao tác chưa xong.
