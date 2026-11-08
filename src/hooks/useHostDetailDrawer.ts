import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/stores/useAppStore";
import { calculateItemShare } from "@/lib/calculations";
import {
  formatHostExpenseShareText,
  DetailedUnpaidBill,
} from "@/lib/shareFormatters";

export const useHostDetailDrawer = () => {
  const [expandedBillIds, setExpandedBillIds] = useState<string[]>([]);
  const { invoices, currentUserId, members } = useAppStore();

  const currentUser = members.find((m) => m.id === currentUserId);
  const hostName = currentUser?.name || "Bạn (Host)";

  const hostUnpaidBills = useMemo<DetailedUnpaidBill[]>(() => {
    return invoices
      .filter((inv) =>
        inv.items.some((item) =>
          item.assignedMemberIds.includes(currentUserId),
        ),
      )
      .map((inv) => {
        const hostItems = inv.items
          .filter((item) => item.assignedMemberIds.includes(currentUserId))
          .map((item) => {
            const memberShare = calculateItemShare(
              item.price,
              item.assignedMemberIds.length,
            );
            return {
              name: item.name,
              totalPrice: item.price,
              splitCount: item.assignedMemberIds.length,
              memberShare,
            };
          });

        const amountOwedForBill = hostItems.reduce(
          (sum, item) => sum + item.memberShare,
          0,
        );

        return {
          id: inv.id,
          title: inv.title,
          createdAt: inv.createdAt,
          amountOwedForBill,
          items: hostItems,
        };
      });
  }, [invoices, currentUserId]);

  const totalHostExpense = useMemo(
    () =>
      hostUnpaidBills.reduce((sum, bill) => sum + bill.amountOwedForBill, 0),
    [hostUnpaidBills],
  );

  const toggleExpand = (billId: string) => {
    setExpandedBillIds((prev) =>
      prev.includes(billId)
        ? prev.filter((id) => id !== billId)
        : [...prev, billId],
    );
  };

  const handleCopySummary = () => {
    const text = formatHostExpenseShareText(
      hostName,
      hostUnpaidBills,
      totalHostExpense,
    );
    navigator.clipboard?.writeText(text);
    toast.success("Đã sao chép chi tiêu cá nhân!");
  };

  return {
    hostName,
    currentUser,
    hostUnpaidBills,
    totalHostExpense,
    expandedBillIds,
    toggleExpand,
    handleCopySummary,
  };
};
