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

export const GROUP_STORAGE_KEY = "splito_tabby_groups_v1";
export const GROUP_SESSION_KEY = "splito_tabby_group_sessions_v1";

export const GROUP_ROUTES = {
  DETAIL: (groupId: string) => `/g/${groupId}`,
  CREATE_BILL: (groupId: string, editBillId?: string) =>
    editBillId
      ? `/g/${groupId}/create?edit=${editBillId}`
      : `/g/${groupId}/create`,
} as const;

export const GROUP_TEXTS = {
  SECTION_TITLE: "Chia tiền nhóm (Đồng bộ Link)",
  BTN_CREATE_GROUP: "Tạo nhóm mới",
  BTN_JOIN_CODE: "Vào bằng mã",
  EMPTY_GROUPS: "Chưa có nhóm nào. Tạo nhóm để gửi link chia tiền qua Zalo!",
  CREATE_DRAWER_TITLE: "Tạo nhóm chia tiền mới",
  CREATE_DRAWER_DESC:
    "Thêm tên các thành viên để tạo link mời qua Zalo/Messenger.",
  GROUP_NAME_LABEL: "Tên nhóm / Chuyến đi",
  GROUP_NAME_PLACEHOLDER: "Ví dụ: Đà Lạt 2026, Ăn trưa team...",
  YOUR_NAME_LABEL: "Tên của bạn (Người tạo)",
  YOUR_NAME_PLACEHOLDER: "Nhập tên của bạn...",
  OTHER_MEMBERS_LABEL: "Thành viên khác trong nhóm",
  OTHER_MEMBER_PLACEHOLDER: "Nhập tên thành viên...",
  JOIN_CODE_TITLE: "Vào nhóm bằng mã",
  JOIN_CODE_DESC: "Nhập mã nhóm gồm 6 ký tự được chia sẻ từ bạn bè.",
  IDENTITY_TITLE: "Bạn là ai trong nhóm này?",
  IDENTITY_DESC:
    "Chọn tên của bạn để hệ thống tự tính phần chi tiêu và công nợ.",
  INVITE_TITLE: "Mời thành viên vào nhóm",
  INVITE_DESC: "Gửi link riêng từng người để app tự nhận diện tên khi mở.",
} as const;

export const GROUP_DETAIL_TEXTS = {
  TAB_MY_BALANCE: "Của tôi",
  TAB_ALL_DEBTS: "Cả nhóm",
  PAYER_LABEL: "Người thanh toán (Trả tiền bill này)",
  BTN_ADD_BILL: "Thêm bill nhóm",
  BTN_SETTLE_PAIR: "Chốt nợ (Đã thanh toán)",
  SETTLE_CONFIRM_TITLE: "Xác nhận đã thanh toán khoản này?",
  SETTLE_CONFIRM_DESC:
    "Hệ thống sẽ ghi nhận giao dịch chốt nợ và đưa số dư giữa 2 người về 0 đ.",
  SETTLE_SUCCESS: "Đã chốt nợ thành công!",
  COPY_PAIR_SUCCESS: "Đã sao chép chi tiết đối soát gửi Zalo!",
} as const;