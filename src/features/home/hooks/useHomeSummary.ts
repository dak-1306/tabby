import { useMemo } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { HomeSummaryData, FormattedRecentInvoice } from "../types";
import { MemberDebtSummary } from "@/types";
import { INVOICE_STATUS, LOCALE_VI } from "@/constants";

export const useHomeSummary = (): HomeSummaryData => {
  const { invoices, members, currentUserId } = useAppStore();

  return useMemo(() => {
    let totalReceivable = 0;
    const debtMap = new Map<string, { total: number; billIds: Set<string> }>();
    const unpaidBillSet = new Set<string>();

    const formattedInvoices: FormattedRecentInvoice[] = invoices.map((inv) => {
      let totalAmount = 0;
      let myReceivableForThisBill = 0;

      inv.items.forEach((item) => {
        totalAmount += item.price;
        if (item.assignedMemberIds.length === 0) return;

        const sharePerPerson = item.price / item.assignedMemberIds.length;

        if (inv.paidByMemberId === currentUserId) {
          item.assignedMemberIds.forEach((mId) => {
            if (mId !== currentUserId) {
              myReceivableForThisBill += sharePerPerson;

              if (inv.status !== INVOICE_STATUS.COMPLETED) {
                const current = debtMap.get(mId) || {
                  total: 0,
                  billIds: new Set(),
                };
                current.total += sharePerPerson;
                current.billIds.add(inv.id);
                debtMap.set(mId, current);
              }
            }
          });
        }
      });

      if (inv.status !== INVOICE_STATUS.COMPLETED) {
        unpaidBillSet.add(inv.id);
      }

      const collectedAmount =
        inv.status === INVOICE_STATUS.COMPLETED
          ? totalAmount
          : Math.max(0, totalAmount - myReceivableForThisBill);

      return {
        id: inv.id,
        title: inv.title,
        date: new Date(inv.createdAt).toLocaleDateString(LOCALE_VI),
        totalAmount,
        collectedAmount,
        uncollectedAmount:
          inv.status === INVOICE_STATUS.COMPLETED ? 0 : myReceivableForThisBill,
        status: inv.status,
      };
    });

    const debtMembers: MemberDebtSummary[] = [];
    debtMap.forEach((data, memberId) => {
      if (data.total > 0) {
        totalReceivable += data.total;
        const memberObj = members.find((m) => m.id === memberId);
        if (memberObj) {
          debtMembers.push({
            memberId,
            memberName: memberObj.name,
            memberAvatar: memberObj.avatar,
            totalOwed: data.total,
            unpaidBillsCount: data.billIds.size,
          });
        }
      }
    });

    return {
      totalReceivable,
      unpaidMembersCount: debtMembers.length,
      unpaidInvoicesCount: unpaidBillSet.size,
      debtMembers,
      recentInvoices: formattedInvoices,
    };
  }, [invoices, members, currentUserId]);
};
