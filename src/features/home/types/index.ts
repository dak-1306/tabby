import { MemberDebtSummary, InvoiceStatus } from "@/types";

export interface FormattedRecentInvoice {
  id: string;
  title: string;
  date: string;
  totalAmount: number;
  collectedAmount: number;
  uncollectedAmount: number;
  status: InvoiceStatus;
}

export interface HomeSummaryData {
  totalReceivable: number;
  unpaidMembersCount: number;
  unpaidInvoicesCount: number;
  debtMembers: MemberDebtSummary[];
  recentInvoices: FormattedRecentInvoice[];
}
