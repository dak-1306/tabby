import { MemberDebtSummary } from "@/types";

export type LedgerFilterTab = "all" | "has_debt" | "settled";

export interface LedgerMemberSummary extends MemberDebtSummary {
  isSettled: boolean;
}

export interface LedgerStatsData {
  totalOwed: number;
  debtMembersCount: number;
  settledMembersCount: number;
}
