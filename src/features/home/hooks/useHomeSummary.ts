import { useMemo } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { HomeSummaryData, FormattedRecentInvoice } from "../types";
import { MemberDebtSummary } from "@/types";
import { INVOICE_STATUS, LOCALE_VI } from "@/constants";
import { calculateItemShare } from "@/utils/calculations";

export const useHomeSummary = (): HomeSummaryData => {
  const { invoices, members, currentUserId } = useAppStore();

  return useMemo(() => {
    let totalReceivable = 0;
    const debtMap = new Map<string, { total: number; billIds: Set<string> }>();
    const unpaidBillSet = new Set<string>();

    const formattedInvoices: FormattedRecentInvoice[] = invoices.map((inv) => {
      let totalAmount = 0;
      let myReceivableForThisBill = 0;
      const isBillCompleted = inv.status === INVOICE_STATUS.COMPLETED;
      const paidSet = new Set(inv.paidMemberIds ?? []);

      inv.items.forEach((item) => {
        totalAmount += item.price;
        if (item.assignedMemberIds.length === 0) return;

        // Luôn chia theo đủ tổng số người tham gia món ăn ban đầu
        const sharePerPerson = calculateItemShare(
          item.price,
          item.assignedMemberIds.length,
        );

        if (inv.paidByMemberId === currentUserId) {
          item.assignedMemberIds.forEach((mId) => {
            if (mId === currentUserId) return;

            const isMemberPaid = isBillCompleted || paidSet.has(mId);
            if (!isMemberPaid) {
              myReceivableForThisBill += sharePerPerson;

              const current = debtMap.get(mId) || {
                total: 0,
                billIds: new Set(),
              };
              current.total += sharePerPerson;
              current.billIds.add(inv.id);
              debtMap.set(mId, current);
            }
          });
        }
      });

      const hasUncollected = !isBillCompleted && myReceivableForThisBill > 0;
      if (hasUncollected) {
        unpaidBillSet.add(inv.id);
      }

      const collectedAmount = Math.max(
        0,
        totalAmount - myReceivableForThisBill,
      );

      return {
        id: inv.id,
        title: inv.title,
        date: new Date(inv.createdAt).toLocaleDateString(LOCALE_VI),
        totalAmount,
        collectedAmount,
        uncollectedAmount: myReceivableForThisBill,
        status: hasUncollected ? inv.status : INVOICE_STATUS.COMPLETED,
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
