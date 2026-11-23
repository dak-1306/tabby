export const ROUTES = {
  HOME: "/",
  INVOICES: "/invoices",
  CREATE: "/create",
  LEDGER: "/ledger",
  PROFILE: "/profile",
} as const;

export const GROUP_ROUTES = {
  DETAIL: (groupId: string) => `/g/${groupId}`,
  CREATE_BILL: (groupId: string, editBillId?: string) =>
    editBillId
      ? `/g/${groupId}/create?edit=${editBillId}`
      : `/g/${groupId}/create`,
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
