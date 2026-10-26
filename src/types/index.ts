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
  status: "completed" | "partial";
  items: InvoiceItem[];
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
  markInvoiceCompleted: (invoiceId: string) => void;
  clearMemberDebt: (memberId: string) => void;
  addMember: (member: Member) => void;
  updateCurrentUserProfile: (profileData: Partial<Member>) => void;
  importData: (newState: Partial<AppState>) => void;
  resetData: () => void;
}