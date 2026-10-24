import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Member, Invoice } from "@/types";
import { MOCK_MEMBERS, MOCK_INVOICES, CURRENT_USER_ID } from "@/data/mockData";
import { STORAGE_KEY, INVOICE_STATUS } from "@/constants";

interface AppState {
  currentUserId: string;
  members: Member[];
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  addMember: (member: Member) => void;
  clearMemberDebt: (memberId: string) => void;
  markInvoiceCompleted: (invoiceId: string) => void;
  resetToMock: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentUserId: CURRENT_USER_ID,
      members: MOCK_MEMBERS,
      invoices: MOCK_INVOICES,

      addInvoice: (newInvoice) =>
        set((state) => ({ invoices: [newInvoice, ...state.invoices] })),

      addMember: (newMember) =>
        set((state) => ({ members: [...state.members, newMember] })),

      // Gạch nợ toàn bộ tiền của 1 thành viên
      clearMemberDebt: (memberId) =>
        set((state) => ({
          invoices: state.invoices.map((inv) => {
            if (inv.paidByMemberId !== state.currentUserId) return inv;
            const updatedItems = inv.items.map((item) => ({
              ...item,
              assignedMemberIds: item.assignedMemberIds.filter(
                (id) => id !== memberId,
              ),
            }));
            return { ...inv, items: updatedItems };
          }),
        })),

      // Đánh dấu hóa đơn đã thu xong
      markInvoiceCompleted: (invoiceId) =>
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === invoiceId
              ? { ...inv, status: INVOICE_STATUS.COMPLETED }
              : inv,
          ),
        })),

      resetToMock: () =>
        set({
          currentUserId: CURRENT_USER_ID,
          members: MOCK_MEMBERS,
          invoices: MOCK_INVOICES,
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
