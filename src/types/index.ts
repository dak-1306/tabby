export type InvoiceStatus = "completed" | "partial";

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
  paidByMemberId: string;
  createdAt: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  paidMemberIds?: string[]; // Danh sách thành viên đã thanh toán (gạch nợ) phần của mình trong bill này
}

export interface MemberDebtSummary {
  memberId: string;
  memberName: string;
  memberAvatar: string;
  totalOwed: number;
  unpaidBillsCount: number;
}

export interface AppState {
  currentUserId: string;
  members: Member[];
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (invoiceId: string) => void;
  markInvoiceCompleted: (invoiceId: string) => void;
  clearMemberDebt: (memberId: string) => void;
  addMember: (member: Member) => void;
  updateMember: (memberId: string, name: string) => void;
  deleteMember: (memberId: string) => void;
  updateCurrentUserProfile: (profileData: Partial<Member>) => void;
  importData: (newState: Partial<AppState>) => void;
  resetData: () => void;
  migrateCurrentUserId: (
    newUserId: string,
    profile?: { name?: string; avatar?: string },
  ) => void;
}
