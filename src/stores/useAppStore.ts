import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AppState, Member } from "@/types";
import { STORAGE_KEY } from "@/constants";

// Chỉ khởi tạo 1 tài khoản duy nhất cho Host (Người chi tiền)
const initialMembers: Member[] = [
  { id: "m1", name: "Bạn (Host)", avatar: "H" },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentUserId: "m1",
      members: initialMembers,
      invoices: [],

      addInvoice: (invoice) =>
        set((state) => ({ invoices: [invoice, ...state.invoices] })),

      markInvoiceCompleted: (invoiceId) =>
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === invoiceId ? { ...inv, status: "completed" } : inv,
          ),
        })),

      clearMemberDebt: (memberId) =>
        set((state) => ({
          invoices: state.invoices.map((inv) => {
            if (inv.paidByMemberId !== state.currentUserId) return inv;
            const hasMemberInItems = inv.items.some((item) =>
              item.assignedMemberIds.includes(memberId),
            );
            if (!hasMemberInItems) return inv;

            const updatedItems = inv.items.map((item) => ({
              ...item,
              assignedMemberIds: item.assignedMemberIds.filter(
                (id) => id !== memberId,
              ),
            }));

            const remainingUnpaidOthers = updatedItems.some((item) =>
              item.assignedMemberIds.some((id) => id !== state.currentUserId),
            );

            return {
              ...inv,
              items: updatedItems,
              status: remainingUnpaidOthers ? "partial" : "completed",
            };
          }),
        })),

      addMember: (member) =>
        set((state) => ({ members: [...state.members, member] })),

      updateCurrentUserProfile: (profileData) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.id === state.currentUserId ? { ...m, ...profileData } : m,
          ),
        })),

      importData: (newState) =>
        set(() => ({
          currentUserId: newState.currentUserId || "m1",
          members: newState.members || initialMembers,
          invoices: newState.invoices || [],
        })),

      resetData: () =>
        set(() => ({
          currentUserId: "m1",
          members: initialMembers,
          invoices: [],
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
