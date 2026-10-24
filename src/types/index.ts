import { INVOICE_STATUS } from "@/constants";

export type InvoiceStatus =
  (typeof INVOICE_STATUS)[keyof typeof INVOICE_STATUS];

export interface Member {
  id: string;
  name: string;
  avatar: string;
  bankName?: string;
  accountNumber?: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  price: number;
  assignedMemberIds: string[];
}

export interface Invoice {
  id: string;
  title: string;
  createdAt: string;
  paidByMemberId: string;
  items: InvoiceItem[];
  status: InvoiceStatus;
}

export interface MemberDebtSummary {
  memberId: string;
  memberName: string;
  memberAvatar: string;
  totalOwed: number;
  unpaidBillsCount: number;
}
