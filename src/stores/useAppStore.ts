import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AppState, Member } from "@/types";
import { STORAGE_KEY } from "@/constants";

const initialMembers: Member[] = [
  { id: "m1", name: "Bạn (Host)", avatar: "H" },
];

const DEFAULT_HOST_NAMES = ["bạn (host)", "tôi", "bạn", "host"];

const isDefaultHostName = (name?: string): boolean =>
  !name || DEFAULT_HOST_NAMES.includes(name.trim().toLowerCase());

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentUserId: "m1",
      members: initialMembers,
      invoices: [],

      addInvoice: (invoice) =>
        set((state) => ({ invoices: [invoice, ...state.invoices] })),

      updateInvoice: (updatedInvoice) =>
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === updatedInvoice.id ? updatedInvoice : inv,
          ),
        })),

      deleteInvoice: (invoiceId) =>
        set((state) => ({
          invoices: state.invoices.filter((inv) => inv.id !== invoiceId),
        })),

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

      updateMember: (memberId, name) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.id === memberId
              ? { ...m, name, avatar: name[0]?.toUpperCase() || m.avatar }
              : m,
          ),
        })),

      deleteMember: (memberId) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== memberId),
        })),

      updateCurrentUserProfile: (profileData) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.id === state.currentUserId ? { ...m, ...profileData } : m,
          ),
        })),

      migrateCurrentUserId: (newUserId, profile) =>
        set((state) => {
          const oldUserId = state.currentUserId;

          // Nếu đã mang ID Google -> Chỉ cập nhật tên/avatar nếu đang là tên mặc định
          if (oldUserId === newUserId) {
            if (!profile?.name) return state;
            return {
              members: state.members.map((m) =>
                m.id === newUserId && isDefaultHostName(m.name)
                  ? {
                      ...m,
                      name: profile.name!,
                      avatar:
                        profile.avatar ||
                        profile.name!.charAt(0).toUpperCase(),
                    }
                  : m,
              ),
            };
          }

          // Chuyển toàn bộ tham chiếu từ oldUserId ("m1") sang Google User ID
          const hasTargetMember = state.members.some((m) => m.id === newUserId);
          const updatedMembers = hasTargetMember
            ? state.members.filter((m) => m.id !== oldUserId)
            : state.members.map((m) => {
                if (m.id !== oldUserId) return m;
                const nextName =
                  isDefaultHostName(m.name) && profile?.name
                    ? profile.name
                    : m.name;
                return {
                  ...m,
                  id: newUserId,
                  name: nextName,
                  avatar: nextName.charAt(0).toUpperCase() || m.avatar,
                };
              });

          const updatedInvoices = state.invoices.map((inv) => ({
            ...inv,
            paidByMemberId:
              inv.paidByMemberId === oldUserId ? newUserId : inv.paidByMemberId,
            items: inv.items.map((item) => ({
              ...item,
              assignedMemberIds: Array.from(
                new Set(
                  item.assignedMemberIds.map((id) =>
                    id === oldUserId ? newUserId : id,
                  ),
                ),
              ),
            })),
          }));

          return {
            currentUserId: newUserId,
            members: updatedMembers,
            invoices: updatedInvoices,
          };
        }),

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