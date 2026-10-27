export const APP_NAME = "Tabby";
export const STORAGE_KEY = "splito_tabby_storage";
export const CURRENCY_SYMBOL = "đ";
export const LOCALE_VI = "vi-VN";

export const INVOICE_STATUS = {
  COMPLETED: "completed",
  PARTIAL: "partial",
} as const;

export const ROUTES = {
  HOME: "/",
  INVOICES: "/invoices",
  CREATE: "/create",
  LEDGER: "/ledger",
  PROFILE: "/profile",
} as const;

export const HEADER_TITLES: Record<
  string,
  { title: string; subtitle: string }
> = {
  [ROUTES.HOME]: { title: "Tabby", subtitle: "Chia tiền sòng phẳng" },
  [ROUTES.INVOICES]: {
    title: "Danh sách hóa đơn",
    subtitle: "Quản lý tất cả bill",
  },
  [ROUTES.LEDGER]: {
    title: "Sổ nợ thành viên",
    subtitle: "Tổng hợp dư nợ nhóm",
  },
  [ROUTES.CREATE]: {
    title: "Tạo hóa đơn mới",
    subtitle: "Chia tiền khoản chi mới",
  },
  [ROUTES.PROFILE]: {
    title: "Cài đặt ứng dụng",
    subtitle: "Quản lý tài khoản & dữ liệu",
  },
};

export const CREATE_TEXTS = {
  TITLE_PLACEHOLDER: "Ví dụ: Lẩu Haidilao Landmark 81...",
  TITLE_LABEL: "Tên hóa đơn",
  MEMBERS_SECTION_TITLE: "Thành viên tham gia",
  ADD_MEMBER_BTN: "+ Thêm người mới",
  NEW_MEMBER_NAME_PLACEHOLDER: "Nhập tên người mới...",
  ITEMS_SECTION_TITLE: "Danh sách món ăn & Dịch vụ",
  ADD_ITEM_BTN: "+ Thêm món mới",
  ITEM_NAME_PLACEHOLDER: "Tên món...",
  ITEM_PRICE_PLACEHOLDER: "Số tiền...",
  LIVE_PREVIEW_TITLE: "Hóa đơn xem trước",
  SUBMIT_BTN: "Lưu & Chia tiền hóa đơn",
  SUBMIT_EDIT_BTN: "Cập nhật hóa đơn",
  SUCCESS_MSG: "Đã tạo hóa đơn thành công!",
  SELECT_ALL: "Chọn tất cả",
  DESELECT_ALL: "Bỏ chọn",
} as const;

export const DRAWER_TEXTS = {
  TOTAL_OWED_LABEL: "Tổng nợ:",
  UNPAID_INVOICES_TITLE: "Các khoản chưa gạch nợ",
  BTN_COPY_DEMAND: "Sao chép tin nhắn đòi tiền",
  BTN_CLEAR_DEBT: "Gạch nợ toàn bộ",
  BTN_MARK_COMPLETED: "Đánh dấu hoàn tất bill",
  BTN_COPY_SUMMARY: "Sao chép tóm tắt gửi nhóm",
  BTN_EDIT_INVOICE: "Chỉnh sửa hóa đơn",
  BTN_DELETE_INVOICE: "Xóa hóa đơn này",
  DELETE_INVOICE_TITLE: "Bạn có chắc muốn xóa hóa đơn này?",
  DELETE_INVOICE_DESC:
    "Mọi dữ liệu chi tiền liên quan sẽ bị xóa khỏi hệ thống.",
  BTN_DELETE_MEMBER: "Xóa thành viên khỏi danh sách",
  DELETE_MEMBER_TITLE: "Bạn có chắc muốn xóa thành viên này?",
  DELETE_MEMBER_DESC: "Chỉ có thể xóa khi thành viên đã trả hết toàn bộ nợ.",
  MEMBER_HAS_DEBT_WARNING: "Cần gạch nợ hết trước khi xóa thành viên này.",
  BTN_CLOSE: "Đóng",
  INVOICE_ITEMS_TITLE: "Danh sách món đã chia",
} as const;

export const TOAST_TEXTS = {
  COPY_BILL_SUCCESS: "Đã sao chép tóm tắt hóa đơn gửi nhóm!",
  COPY_DEMAND_SUCCESS: "Đã sao chép tin nhắn đòi tiền cá nhân!",
  CLEAR_DEBT_SUCCESS: "Đã gạch nợ toàn bộ thành công!",
  MARK_COMPLETED_SUCCESS: "Đã đánh dấu hoàn tất hóa đơn!",
  CREATE_INVOICE_SUCCESS: "Tạo hóa đơn mới thành công!",
  UPDATE_INVOICE_SUCCESS: "Đã cập nhật hóa đơn thành công!",
  DELETE_INVOICE_SUCCESS: "Đã xóa hóa đơn thành công!",
  DELETE_MEMBER_SUCCESS: "Đã xóa thành viên thành công!",
} as const;
