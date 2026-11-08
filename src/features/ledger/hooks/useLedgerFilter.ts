import { useState, useMemo } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { calculateItemShare } from "@/lib/calculations";
import {
  LedgerFilterTab,
  LedgerMemberSummary,
  LedgerStatsData,
} from "../types";
import { INVOICE_STATUS } from "@/constants";

export const useLedgerFilter = () => {
  const { invoices, members, currentUserId } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<LedgerFilterTab>("all");

  const ledgerMembers = useMemo<LedgerMemberSummary[]>(() => {
    const debtMap = new Map<string, { total: number; billIds: Set<string> }>();

    invoices.forEach((inv) => {
      if (inv.paidByMemberId !== currentUserId) return;

      inv.items.forEach((item) => {
        if (item.assignedMemberIds.length === 0) return;
        const share = calculateItemShare(
          item.price,
          item.assignedMemberIds.length,
        );

        item.assignedMemberIds.forEach((mId) => {
          if (
            mId !== currentUserId &&
            inv.status !== INVOICE_STATUS.COMPLETED
          ) {
            const current = debtMap.get(mId) || {
              total: 0,
              billIds: new Set(),
            };
            current.total += share;
            current.billIds.add(inv.id);
            debtMap.set(mId, current);
          }
        });
      });
    });

    return members
      .filter((m) => m.id !== currentUserId)
      .map((m) => {
        const debtInfo = debtMap.get(m.id);
        const totalOwed = debtInfo ? debtInfo.total : 0;
        const unpaidBillsCount = debtInfo ? debtInfo.billIds.size : 0;

        return {
          memberId: m.id,
          memberName: m.name,
          memberAvatar: m.avatar,
          totalOwed,
          unpaidBillsCount,
          isSettled: totalOwed === 0,
        };
      });
  }, [invoices, members, currentUserId]);

  const filteredMembers = useMemo(() => {
    return ledgerMembers.filter((m) => {
      const matchesSearch = m.memberName
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());

      const matchesTab =
        activeTab === "all"
          ? true
          : activeTab === "has_debt"
            ? !m.isSettled
            : m.isSettled;

      return matchesSearch && matchesTab;
    });
  }, [ledgerMembers, searchQuery, activeTab]);

  const stats = useMemo<LedgerStatsData>(() => {
    let totalOwed = 0;
    let debtMembersCount = 0;
    let settledMembersCount = 0;

    ledgerMembers.forEach((m) => {
      if (m.isSettled) {
        settledMembersCount++;
      } else {
        debtMembersCount++;
        totalOwed += m.totalOwed;
      }
    });

    return {
      totalOwed,
      debtMembersCount,
      settledMembersCount,
    };
  }, [ledgerMembers]);

  return {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    filteredMembers,
    stats,
  };
};
