import { Invoice, Member } from "@/types";
import { DraftItem, MemberSplitBreakdown } from "@/features/create/types";

// 1. Helper làm tròn về mốc 1.000đ chuẩn VND
export const roundToThousand = (amount: number): number => {
  if (!amount || amount <= 0) return 0;
  return Math.round(amount / 1000) * 1000;
};

// 2. Tính phần tiền 1 người phải chịu cho 1 món
export const calculateItemShare = (
  price: number,
  splitCount: number,
): number => {
  if (splitCount <= 0) return 0;
  return roundToThousand(price / splitCount);
};

// 3. Tính phân bổ tiền cho màn hình Create/Edit Invoice
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
      amountOwed: roundToThousand(data.amount),
      assignedItemsCount: data.itemsCount,
    };
  });
};

// 4. Tính tổng chi tiêu cá nhân của Host
export const calculateHostTotalExpense = (
  invoices: Invoice[],
  hostId: string,
): number => {
  return invoices.reduce((total, inv) => {
    const billHostExpense = inv.items
      .filter((item) => item.assignedMemberIds.includes(hostId))
      .reduce(
        (sum, item) =>
          sum + calculateItemShare(item.price, item.assignedMemberIds.length),
        0,
      );
    return total + billHostExpense;
  }, 0);
};
