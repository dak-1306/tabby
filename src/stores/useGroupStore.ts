"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Group,
  GroupMember,
  GroupSessionMap,
  GroupSettlement,
} from "@/types/group";
import { GROUP_SESSION_KEY } from "@/constants";
import { groupService } from "@/features/groups/services/groupService";
import { useAppStore } from "@/stores/useAppStore";
import { Invoice } from "@/types";

interface GroupStoreState {
  sessions: GroupSessionMap; // { [groupId]: memberId }
  cachedGroups: Record<string, Group>; // Cache hiển thị tức thì

  createGroup: (params: {
    name: string;
    creatorName: string;
    memberNames: string[];
  }) => Promise<{ group: Group; creatorMember: GroupMember }>;

  syncGroupById: (groupId: string) => Promise<Group | null>;
  syncGroupByCode: (code: string) => Promise<Group | null>;
  syncJoinedGroups: () => Promise<void>;

  setSessionMember: (groupId: string, memberId: string) => void;
  addMember: (
    groupId: string,
    memberName: string,
  ) => Promise<GroupMember | null>;
  addAndSelectMember: (
    groupId: string,
    memberName: string,
    linkCurrentUser?: boolean,
  ) => Promise<GroupMember | null>;

  updateMemberName: (
    groupId: string,
    memberId: string,
    name: string,
  ) => Promise<void>;
  addGroupInvoice: (groupId: string, invoice: Invoice) => Promise<void>;
  updateGroupInvoice: (groupId: string, invoice: Invoice) => Promise<void>;
  deleteGroupInvoice: (groupId: string, invoiceId: string) => Promise<void>;
  settlePairDebt: (
    groupId: string,
    fromMemberId: string,
    toMemberId: string,
    amount: number,
  ) => Promise<void>;
}

export const useGroupStore = create<GroupStoreState>()(
  persist(
    (set, get) => ({
      sessions: {},
      cachedGroups: {},

      createGroup: async (params) => {
        const result = await groupService.createGroup(params);
        set((state) => ({
          sessions: {
            ...state.sessions,
            [result.group.id]: result.creatorMember.id,
          },
          cachedGroups: {
            ...state.cachedGroups,
            [result.group.id]: result.group,
          },
        }));
        return result;
      },

      syncGroupById: async (groupId) => {
        const freshGroup = await groupService.getGroupById(groupId);
        if (freshGroup) {
          set((state) => ({
            cachedGroups: {
              ...state.cachedGroups,
              [freshGroup.id]: freshGroup,
            },
          }));
        }
        return freshGroup;
      },

      syncGroupByCode: async (code) => {
        const found = await groupService.getGroupByCode(code);
        if (found) {
          set((state) => ({
            cachedGroups: {
              ...state.cachedGroups,
              [found.id]: found,
            },
          }));
        }
        return found;
      },

      syncJoinedGroups: async () => {
        const currentSessions = get().sessions;
        const joinedIds = Object.keys(currentSessions);
        const currentUserId = useAppStore.getState().currentUserId;

        const freshList = await groupService.getGroupsByIds(joinedIds);
        const nextCache: Record<string, Group> = {};
        const nextSessions: GroupSessionMap = { ...currentSessions };

        for (const g of freshList) {
          nextCache[g.id] = g;
          // Tự động khôi phục session nếu thành viên đã gắn với tài khoản Google hiện tại
          if (!nextSessions[g.id] && currentUserId) {
            const linkedMember = g.members.find(
              (m) => m.linkedUserId === currentUserId,
            );
            if (linkedMember) {
              nextSessions[g.id] = linkedMember.id;
            }
          }
        }

        set({ cachedGroups: nextCache, sessions: nextSessions });
      },

      setSessionMember: (groupId, memberId) => {
        set((state) => ({
          sessions: {
            ...state.sessions,
            [groupId]: memberId,
          },
        }));
      },

      addMember: async (groupId, memberName) => {
        const res = await groupService.addMemberToGroup(
          groupId,
          memberName,
          false,
        );
        if (!res) return null;

        set((state) => ({
          cachedGroups: {
            ...state.cachedGroups,
            [groupId]: res.group,
          },
        }));
        return res.member;
      },

      addAndSelectMember: async (
        groupId,
        memberName,
        linkCurrentUser = true,
      ) => {
        const res = await groupService.addMemberToGroup(
          groupId,
          memberName,
          linkCurrentUser,
        );
        if (!res) return null;

        set((state) => ({
          sessions: {
            ...state.sessions,
            [groupId]: res.member.id,
          },
          cachedGroups: {
            ...state.cachedGroups,
            [groupId]: res.group,
          },
        }));
        return res.member;
      },

      updateMemberName: async (groupId, memberId, name) => {
        const updated = await groupService.updateMemberInGroup(
          groupId,
          memberId,
          name,
        );
        if (updated) {
          set((state) => ({
            cachedGroups: { ...state.cachedGroups, [groupId]: updated },
          }));
        }
      },

      addGroupInvoice: async (groupId, invoice) => {
        const updated = await groupService.addInvoiceToGroup(groupId, invoice);
        if (updated) {
          set((state) => ({
            cachedGroups: { ...state.cachedGroups, [groupId]: updated },
          }));
        }
      },

      updateGroupInvoice: async (groupId, invoice) => {
        const updated = await groupService.updateInvoiceInGroup(
          groupId,
          invoice,
        );
        if (updated) {
          set((state) => ({
            cachedGroups: { ...state.cachedGroups, [groupId]: updated },
          }));
        }
      },

      deleteGroupInvoice: async (groupId, invoiceId) => {
        const updated = await groupService.deleteInvoiceFromGroup(
          groupId,
          invoiceId,
        );
        if (updated) {
          set((state) => ({
            cachedGroups: { ...state.cachedGroups, [groupId]: updated },
          }));
        }
      },

      settlePairDebt: async (groupId, fromMemberId, toMemberId, amount) => {
        const settlement: GroupSettlement = {
          id: `stl_${Date.now().toString(36)}`,
          fromMemberId,
          toMemberId,
          amount,
          settledAt: new Date().toISOString(),
        };
        const updated = await groupService.addSettlementToGroup(
          groupId,
          settlement,
        );
        if (updated) {
          set((state) => ({
            cachedGroups: { ...state.cachedGroups, [groupId]: updated },
          }));
        }
      },
    }),
    {
      name: GROUP_SESSION_KEY,
      partialize: (state) => ({
        sessions: state.sessions,
        cachedGroups: state.cachedGroups,
      }),
    },
  ),
);
