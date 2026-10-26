import { INVOICE_STATUS } from "@/constants";

export type InvoiceFilterTab =
  | "all"
  | typeof INVOICE_STATUS.PARTIAL
  | typeof INVOICE_STATUS.COMPLETED;

export interface InvoicesStatsData {
  totalCount: number;
  completedCount: number;
  partialCount: number;
  totalAmount: number;
  collectedAmount: number;
}
