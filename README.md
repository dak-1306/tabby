# Tabby - Mobile Web App Chia Hóa Đơn

## 1. Tổng quan dự án & Mục đích

- **Tên ứng dụng:** Tabby
- **Mục đích:** Ứng dụng web di động (Mobile Web App / PWA) giúp chia tiền hóa đơn nhanh gọn, giải quyết vấn đề ghi chú phức tạp trên điện thoại.
- **Kiến trúc dữ liệu:** Offline-first, toàn bộ dữ liệu lưu trữ trực tiếp trên `localStorage` (chưa cần database phức tạp ở giai đoạn đầu).

## 2. Công nghệ sử dụng (Tech Stack)

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 + `tw-animate-css`
- **UI Components:** Shadcn UI (customized theo chuẩn mobile) + Base UI / Radix primitives
- **Icons & Utilities:** `lucide-react`, `clsx`, `tailwind-merge`, `zustand`, `html2canvas` (xuất ảnh bill/bảng nợ)

## 3. Cấu trúc thư mục (Feature-First Architecture)

```text
src/
├── app/
│   ├── (main)/
│   │   ├── layout.tsx         # Layout bọc MobileContainer & BottomNav thông minh
│   │   ├── page.tsx           # Màn hình chính (Home) / Lịch sử hóa đơn
│   │   ├── create/page.tsx    # Trang tạo mới hóa đơn (Ẩn bottom nav)
│   │   ├── ledger/page.tsx    # Trang sổ nợ thành viên & truy vết chi tiết
│   │   └── share/page.tsx     # Trang xuất văn bản Zalo & khung ảnh nợ
│   ├── layout.tsx             # Root layout cấu hình font & mobile frame
│   └── globals.css            # Global CSS & Design Tokens
├── components/
│   ├── layout/                # Header (linh hoạt theo route), BottomNav
│   ├── mobile/                # MobileContainer (giả lập desktop / tràn viền mobile), SplashScreen
│   └── ui/                    # Custom UI Atoms (Button, Card, Dialog, Drawer)
├── features/                  # Business logic chia theo module riêng
│   ├── invoices/              # Quản lý hóa đơn, nhập món, phân chia tiền
│   ├── members/               # Quản lý thành viên & tính toán tổng nợ
│   └── sharing/               # Công cụ xuất text Zalo & html2canvas export
└── utils/                     # Các tiện ích chung (cn.ts,...)
```
