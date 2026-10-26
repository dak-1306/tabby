import { DraftItem, MemberSplitBreakdown } from "../types";
import { Member } from "@/types";

export const calculateMemberSplits = (
  items: DraftItem[],
  selectedMembers: Member[],
): MemberSplitBreakdown[] => {
  const breakdownMap = new Map<
    string,
    { amount: number; itemsCount: number }
  >();

  selectedMembers.forEach((m) => {
    breakdownMap.set(m.id, { amount: 0, itemsCount: 0 });
  });

  items.forEach((item) => {
    if (item.price <= 0 || item.assignedMemberIds.length === 0) return;

    const share = item.price / item.assignedMemberIds.length;

    item.assignedMemberIds.forEach((mId) => {
      const current = breakdownMap.get(mId);
      if (current) {
        current.amount += share;
        current.itemsCount += 1;
      }
    });
  });

  return selectedMembers.map((m) => {
    const data = breakdownMap.get(m.id) || { amount: 0, itemsCount: 0 };
    return {
      memberId: m.id,
      memberName: m.name,
      memberAvatar: m.avatar,
      amountOwed: data.amount,
      assignedItemsCount: data.itemsCount,
    };
  });
};
