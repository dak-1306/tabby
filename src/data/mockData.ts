import { Member, Invoice } from "@/types";
import { INVOICE_STATUS } from "@/constants";

export const CURRENT_USER_ID = "user_me";

export const MOCK_MEMBERS: Member[] = [
  { id: "user_me", name: "Đăng (Bạn)", avatar: "Đ" },
  {
    id: "m1",
    name: "Bành Vương Mỹ Ngân",
    avatar: "N",
    bankName: "MB Bank",
    accountNumber: "9999888877",
  },
  {
    id: "m2",
    name: "Trần Hoàng Nam",
    avatar: "N",
    bankName: "Vietcombank",
    accountNumber: "1010202030",
  },
  {
    id: "m3",
    name: "Lê Minh Quốc",
    avatar: "Q",
    bankName: "Techcombank",
    accountNumber: "1903000011",
  },
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "inv1",
    title: "Lẩu Haidilao Landmark 81",
    createdAt: "2026-10-24T18:30:00.000Z",
    paidByMemberId: "user_me",
    status: INVOICE_STATUS.PARTIAL,
    items: [
      {
        id: "i1",
        name: "Nước lẩu Thái & Cà chua",
        price: 210000,
        assignedMemberIds: ["user_me", "m1", "m2"],
      },
      {
        id: "i2",
        name: "Thịt bò Mỹ bắp hoa",
        price: 450000,
        assignedMemberIds: ["user_me", "m2"],
      },
      {
        id: "i3",
        name: "Phần Lẩu Mỹ Ngân",
        price: 150000,
        assignedMemberIds: ["m1"],
      },
      {
        id: "i4",
        name: "Bộ gia vị & Nước uống",
        price: 120000,
        assignedMemberIds: ["user_me", "m1", "m2", "m3"],
      },
    ],
  },
  {
    id: "inv2",
    title: "Cà phê Highlands Coffee",
    createdAt: "2026-10-22T09:15:00.000Z",
    paidByMemberId: "user_me",
    status: INVOICE_STATUS.PARTIAL,
    items: [
      {
        id: "i5",
        name: "Phin sữa đá (L)",
        price: 90000,
        assignedMemberIds: ["m1"],
      },
      {
        id: "i6",
        name: "Matcha Freeze",
        price: 80000,
        assignedMemberIds: ["m3"],
      },
    ],
  },
  {
    id: "inv3",
    title: "Vé xem phim IMAX Metiz",
    createdAt: "2026-10-18T20:00:00.000Z",
    paidByMemberId: "user_me",
    status: INVOICE_STATUS.COMPLETED,
    items: [
      {
        id: "i7",
        name: "3x Vé IMAX 3D",
        price: 420000,
        assignedMemberIds: ["user_me", "m1", "m2"],
      },
    ],
  },
];
