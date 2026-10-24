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
  SHARE: "/share",
} as const;

export const DRAWER_TEXTS = {
  TOTAL_OWED_LABEL: "Tổng nợ:",
  UNPAID_INVOICES_TITLE: "Các khoản chưa gạch nợ",
  BTN_COPY_DEMAND: "Sao chép text đòi tiền",
  BTN_COPIED: "Đã sao chép!",
  BTN_CLEAR_DEBT: "Gạch nợ toàn bộ",
  BTN_MARK_COMPLETED: "Đánh dấu đã thu xong toàn bill",
  BTN_COPY_SUMMARY: "Sao chép tóm tắt gửi nhóm",
  BTN_CLOSE: "Đóng",
  INVOICE_ITEMS_TITLE: "Danh sách món đã chia",
  PAID_BY_LABEL: "Người trả tiền:",
  SPLIT_WITH_LABEL: "Chia cho:",
} as const;