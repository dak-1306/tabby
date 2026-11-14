import { useState, useMemo } from "react";
import { toast } from "sonner";
import { MemberDebtSummary } from "@/types";
import { useAppStore } from "@/stores/useAppStore";
import { calculateItemShare } from "@/utils/calculations";
import {
  formatMemberDemandShareText,
  DetailedUnpaidBill,
} from "@/utils/shareFormatters";
import { TOAST_TEXTS } from "@/constants";

export const useMemberDetailDrawer = (
  member: MemberDebtSummary | null,
  onClose: () => void,
) => {
  const [expandedBillIds, setExpandedBillIds] = useState<string[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");

  const {
    invoices,
    currentUserId,
    members,
    clearMemberDebt,
    deleteMember,
    updateMember,
  } = useAppStore();

  const currentUser = members.find((m) => m.id === currentUserId);

  const unpaidInvoicesWithDetails = useMemo<DetailedUnpaidBill[]>(() => {
    if (!member) return [];
    return invoices
      .filter(
        (inv) =>
          inv.paidByMemberId === currentUserId &&
          inv.items.some((item) =>
            item.assignedMemberIds.includes(member.memberId),
          ),
      )
      .map((inv) => {
        const memberItems = inv.items
          .filter((item) => item.assignedMemberIds.includes(member.memberId))
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

        const amountOwedForBill = memberItems.reduce(
          (sum, item) => sum + item.memberShare,
          0,
        );

        return {
          id: inv.id,
          title: inv.title,
          createdAt: inv.createdAt,
          amountOwedForBill,
          items: memberItems,
        };
      });
  }, [invoices, currentUserId, member]);

  const toggleExpand = (billId: string) => {
    setExpandedBillIds((prev) =>
      prev.includes(billId)
        ? prev.filter((id) => id !== billId)
        : [...prev, billId],
    );
  };

  const handleStartEdit = () => {
    if (!member) return;
    setEditName(member.memberName);
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (member && editName.trim() && editName.trim() !== member.memberName) {
      updateMember(member.memberId, editName.trim());
      toast.success("Đã cập nhật tên thành viên");
    }
    setIsEditingName(false);
  };

  const handleCopyText = (isDetailed: boolean) => {
    if (!member) return;
    const text = formatMemberDemandShareText(
      member,
      unpaidInvoicesWithDetails,
      currentUser,
      isDetailed,
    );
    navigator.clipboard?.writeText(text);
    toast.success(TOAST_TEXTS.COPY_DEMAND_SUCCESS);
  };

  const handleClearDebt = () => {
    if (!member) return;
    clearMemberDebt(member.memberId);
    toast.success(TOAST_TEXTS.CLEAR_DEBT_SUCCESS);
    onClose();
  };

  const handleDeleteMember = () => {
    if (!member) return;
    deleteMember(member.memberId);
    toast.success(TOAST_TEXTS.DELETE_MEMBER_SUCCESS);
    onClose();
  };

  return {
    currentUser,
    unpaidInvoicesWithDetails,
    expandedBillIds,
    isEditingName,
    editName,
    setEditName,
    toggleExpand,
    handleStartEdit,
    handleSaveName,
    handleCopyText,
    handleClearDebt,
    handleDeleteMember,
  };
};
