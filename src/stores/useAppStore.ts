import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AppState, Invoice, Member } from "@/types";
import { STORAGE_KEY } from "@/constants";

const initialMembers: Member[] = [
  { id: "m1", name: "Bạn (Host)", avatar: "H" },
];

const DEFAULT_HOST_NAMES = ["bạn (host)", "tôi", "bạn", "host"];

const isDefaultHostName = (name?: string): boolean =>
  !name || DEFAULT_HOST_NAMES.includes(name.trim().toLowerCase());

const getInvoiceParticipantIds = (invoice: Invoice): string[] => {
  const ids = new Set<string>();
  invoice.items.forEach((item) => {
    item.assignedMemberIds.forEach((id) => ids.add(id));
  });
  return Array.from(ids);
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentUserId: "m1",
      members: initialMembers,
      invoices: [],

      addInvoice: (invoice) =>
        set((state) => ({
          invoices: [{ ...invoice, paidMemberIds: [] }, ...state.invoices],
        })),

      updateInvoice: (updatedInvoice) =>
        set((state) => ({
          invoices: state.invoices.map((inv) => {
            if (inv.id !== updatedInvoice.id) return inv;

            const participants = getInvoiceParticipantIds(updatedInvoice);
            const validPaidIds = (inv.paidMemberIds ?? []).filter((id) =>
              participants.includes(id),
            );
            const hasUnpaidOthers = participants.some(
              (id) =>
                id !== updatedInvoice.paidByMemberId &&
                !validPaidIds.includes(id),
            );

            return {
              ...updatedInvoice,
              paidMemberIds: validPaidIds,
              status: hasUnpaidOthers ? "partial" : "completed",
            };
          }),
        })),

      deleteInvoice: (invoiceId) =>
        set((state) => ({
          invoices: state.invoices.filter((inv) => inv.id !== invoiceId),
        })),

      markInvoiceCompleted: (invoiceId) =>
        set((state) => ({
          invoices: state.invoices.map((inv) => {
            if (inv.id !== invoiceId) return inv;
            return {
              ...inv,
              status: "completed",
              paidMemberIds: getInvoiceParticipantIds(inv),
            };
          }),
        })),

      clearMemberDebt: (memberId) =>
        set((state) => ({
          invoices: state.invoices.map((inv) => {
            if (inv.paidByMemberId !== state.currentUserId) return inv;
            if (inv.status === "completed") return inv;

            const participants = getInvoiceParticipantIds(inv);
            if (!participants.includes(memberId)) return inv;

            const currentPaidIds = inv.paidMemberIds ?? [];
            if (currentPaidIds.includes(memberId)) return inv;

            // Giữ nguyên assignedMemberIds trên từng món, chỉ ghi nhận memberId đã trả nợ
            const nextPaidIds = [...currentPaidIds, memberId];
            const remainingUnpaidOthers = participants.some(
              (id) =>
                id !== state.currentUserId && !nextPaidIds.includes(id),
            );

            return {
              ...inv,
              paidMemberIds: nextPaidIds,
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
            paidMemberIds: inv.paidMemberIds
              ? Array.from(
                  new Set(
                    inv.paidMemberIds.map((id) =>
                      id === oldUserId ? newUserId : id,
                    ),
                  ),
                )
              : undefined,
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