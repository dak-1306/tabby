import { Invoice, Member } from "./index";

export interface GroupMember extends Member {
  isCreator?: boolean;
  linkedUserId?: string; // Gắn usr_<email> nếu thành viên có đăng nhập Google
  joinedAt: string;
}

export interface GroupSettlement {
  id: string;
  fromMemberId: string;
  toMemberId: string;
  amount: number;
  settledAt: string;
}

export interface Group {
  id: string;
  code: string; // Mã ngắn 6 ký tự (VD: DL2026)
  name: string;
  createdAt: string;
  updatedAt: string;
  members: GroupMember[];
  invoices: Invoice[];
  settlements: GroupSettlement[];
}

// Lưu map { [groupId]: memberId } trên thiết bị hiện tại
export type GroupSessionMap = Record<string, string>;
