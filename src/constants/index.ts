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
  BTN_ADD_MEMBER_TAG: "Thêm",
  ARIA_REMOVE_MEMBER_PREFIX: "Xóa",
  BTN_SUBMIT_CREATE_GROUP: "Tạo nhóm & Lấy link mời",
  CREATE_SUCCESS_PREFIX: "Tạo nhóm “",
  CREATE_SUCCESS_SUFFIX: "” thành công!",
  GROUP_CODE_PREFIX: "Mã nhóm:",
  CREATE_SUCCESS_DESC_SUFFIX:
    "• Gửi link bên dưới vào Zalo/Messenger để mọi người cùng vào.",
  GENERAL_LINK_LABEL: "Link mời chung (Gửi vào group chat)",
  PERSONAL_LINKS_LABEL: "Hoặc gửi link định danh riêng (Tự nhận tên)",
  PERSONAL_LINK_FOR_PREFIX: "Link cho",
  BTN_ENTER_GROUP_NOW: "Vào nhóm ngay",
  ERR_GROUP_NAME_REQUIRED: "Vui lòng nhập tên nhóm.",
  ERR_CREATOR_NAME_REQUIRED: "Vui lòng nhập tên của bạn.",
  JOIN_CODE_TITLE: "Vào nhóm bằng mã",
  JOIN_CODE_DESC: "Nhập mã nhóm gồm 6 ký tự được chia sẻ từ bạn bè.",
  JOIN_CODE_PLACEHOLDER: "VD: DL2026",
  BTN_SUBMIT_JOIN_CODE: "Tham gia nhóm",
  ERR_INVALID_CODE_LENGTH: "Mã nhóm gồm đủ 6 ký tự.",
  ERR_GROUP_NOT_FOUND: "Không tìm thấy nhóm với mã này. Kiểm tra lại nhé!",
  IDENTITY_TITLE: "Bạn là ai trong nhóm này?",
  IDENTITY_DESC:
    "Chọn tên của bạn để hệ thống tự tính phần chi tiêu và công nợ.",
  BTN_NOT_IN_LIST: "Tôi chưa có tên trong danh sách",
  BTN_JOIN_AS_NEW: "Vào nhóm",
  INVITE_TITLE: "Mời thành viên vào nhóm",
  INVITE_DESC: "Gửi link riêng từng người để app tự nhận diện tên khi mở.",
  GROUP_CODE_CARD_LABEL: "Mã nhóm 6 ký tự",
  GENERAL_LINK_CARD_LABEL: "Link chung nhóm",
  ADD_NEW_MEMBER_LABEL: "Thêm thành viên mới",
  NEW_FRIEND_PLACEHOLDER: "Nhập tên bạn mới...",
  MEMBER_LINKS_LIST_LABEL: "Link định danh từng thành viên",
  BTN_COPY: "Sao chép",
  BTN_COPIED: "Đã chép",
  BTN_COPY_LINK: "Chép link",
  BTN_COPY_PERSONAL_LINK: "Chép link riêng",
} as const;

export const GROUP_DETAIL_TEXTS = {
  LOADING_GENERIC: "Đang tải...",
  LOADING_GROUP: "Đang tải dữ liệu nhóm...",
  NOT_FOUND_TITLE: "Không tìm thấy nhóm",
  NOT_FOUND_DESC:
    "Đường link có thể không chính xác hoặc nhóm chưa được đồng bộ trên thiết bị này.",
  BTN_BACK_HOME: "Về Trang chủ",
  ARIA_BACK: "Quay lại",
  ARIA_BACK_TO_GROUP: "Quay lại nhóm",
  GROUP_PREFIX: "Nhóm:",
  MEMBERS_UNIT: "thành viên",
  INVOICES_UNIT: "hóa đơn",
  BTN_INVITE: "Mời bạn",
  IN_APP_BROWSER_PART1:
    "Đang mở trong trình duyệt ứng dụng (Zalo/Messenger). Bấm dấu",
  IN_APP_BROWSER_DOTS: "•••",
  IN_APP_BROWSER_ACTION: "Mở bằng trình duyệt",
  IN_APP_BROWSER_PART2: "để lưu nhóm lâu dài.",
  CURRENT_IDENTITY_LABEL: "Bạn đang tham gia với tên:",
  NO_IDENTITY_LABEL: "Chưa chọn danh tính",
  BTN_SWITCH_IDENTITY: "Đổi tên",
  SETTLEMENT_BOARD_TITLE: "Bảng Đối Soát Bù Trừ",
  TAB_MY_BALANCE: "Của tôi",
  TAB_ALL_DEBTS: "Cả nhóm",
  MY_RECEIVE_LABEL: "Bạn được nhận lại",
  MY_PAY_LABEL: "Bạn cần trả thêm",
  SELF_LABEL: "Bạn",
  DEFAULT_MEMBER_NAME: "Thành viên",
  EMPTY_MY_DEBTS: "Bạn đang sòng phẳng, không nợ hay thiếu ai!",
  EMPTY_ALL_DEBTS: "Cả nhóm đã thanh toán sòng phẳng!",
  EMPTY_INVOICES_TITLE: "Chưa có hóa đơn nào trong nhóm",
  EMPTY_INVOICES_DESC_PREFIX: "Bấm nút",
  EMPTY_INVOICES_DESC_SUFFIX: "bên dưới để ghi lại khoản chi đầu tiên.",
  INVOICE_LIST_TITLE: "Danh sách hóa đơn",
  PAID_VERB: "trả",
  MY_SHARE_PREFIX: "Bạn:",
  NOT_PARTICIPATING_LABEL: "Không ăn",
  PAYER_LABEL: "Người thanh toán (Trả tiền bill này)",
  CREATE_BILL_TITLE: "Thêm bill nhóm mới",
  EDIT_BILL_TITLE: "Sửa bill nhóm",
  BTN_ADD_BILL: "Thêm bill nhóm",
  INVOICE_PAYER_PREFIX: "Người trả:",
  INVOICE_TOTAL_PREFIX: "• Tổng:",
  PER_PERSON_UNIT: "/người",
  MEMBER_SHARES_TITLE: "Phần chia từng thành viên",
  BTN_COPY_BILL_GROUP: "Copy gửi nhóm",
  BTN_EDIT_BILL: "Sửa hóa đơn",
  NEED_TO_SEND_LABEL: "Cần gửi cho",
  PAIR_DETAIL_DESC_PREFIX: "Chi tiết bù trừ các hóa đơn giữa",
  PAIR_DETAIL_DESC_AND: "và",
  SETTLEMENT_TX_LABEL: "Giao dịch chốt nợ",
  PAID_FOR_SUFFIX: "trả hộ",
  SPLIT_COUNT_PREFIX: "(chia",
  SPLIT_ARROW: "→",
  BTN_COPY_PAIR_ZALO: "Sao chép đối soát gửi Zalo",
  BTN_SETTLE_PAIR: "Chốt nợ (Đã thanh toán)",
  SETTLE_CONFIRM_TITLE: "Xác nhận đã thanh toán khoản này?",
  SETTLE_CONFIRM_DESC:
    "Hệ thống sẽ ghi nhận giao dịch chốt nợ và đưa số dư giữa 2 người về 0 đ.",
  SETTLE_SUCCESS: "Đã chốt nợ thành công!",
  COPY_PAIR_SUCCESS: "Đã sao chép chi tiết đối soát gửi Zalo!",
} as const;
