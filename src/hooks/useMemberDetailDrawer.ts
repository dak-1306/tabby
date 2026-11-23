import { useState, useMemo } from "react";
import { toast } from "sonner";
import { MemberDebtSummary } from "@/types";
import { useAppStore } from "@/stores/useAppStore";
import { calculateItemShare } from "@/utils/calculations";
import {
  formatMemberDemandShareText,
  DetailedUnpaidBill,
} from "@/utils/shareFormatters";
import { INVOICE_STATUS, TOAST_TEXTS } from "@/constants";

export const useMemberDetailDrawer = (
  member: MemberDebtSummary | null,
  onClose: () => void,
) => {
  const [expandedBillIds, setExpandedBillIds] = useState<string[]>([]);
  const [selectedBillIds, setSelectedBillIds] = useState<string[]>([]);
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
          inv.status !== INVOICE_STATUS.COMPLETED &&
          !(inv.paidMemberIds ?? []).includes(member.memberId) &&
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

  // Chỉ giữ lại các ID hóa đơn vẫn đang nằm trong danh sách chưa trả nợ
  const validSelectedBillIds = useMemo(() => {
    const unpaidIdSet = new Set(unpaidInvoicesWithDetails.map((b) => b.id));
    return selectedBillIds.filter((id) => unpaidIdSet.has(id));
  }, [selectedBillIds, unpaidInvoicesWithDetails]);

  const isPartialSelection =
    validSelectedBillIds.length > 0 &&
    validSelectedBillIds.length < unpaidInvoicesWithDetails.length;

  const targetBills = useMemo(() => {
    if (validSelectedBillIds.length === 0) return unpaidInvoicesWithDetails;
    const selectedSet = new Set(validSelectedBillIds);
    return unpaidInvoicesWithDetails.filter((b) => selectedSet.has(b.id));
  }, [unpaidInvoicesWithDetails, validSelectedBillIds]);

  const targetAmount = useMemo(
    () => targetBills.reduce((sum, b) => sum + b.amountOwedForBill, 0),
    [targetBills],
  );

  const toggleExpand = (billId: string) => {
    setExpandedBillIds((prev) =>
      prev.includes(billId)
        ? prev.filter((id) => id !== billId)
        : [...prev, billId],
    );
  };

  const toggleSelectBill = (billId: string) => {
    setSelectedBillIds((prev) => {
      const unpaidIdSet = new Set(unpaidInvoicesWithDetails.map((b) => b.id));
      const cleanPrev = prev.filter((id) => unpaidIdSet.has(id));
      return cleanPrev.includes(billId)
        ? cleanPrev.filter((id) => id !== billId)
        : [...cleanPrev, billId];
    });
  };

  const toggleSelectAllBills = () => {
    if (validSelectedBillIds.length === unpaidInvoicesWithDetails.length) {
      setSelectedBillIds([]);
    } else {
      setSelectedBillIds(unpaidInvoicesWithDetails.map((b) => b.id));
    }
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
    const summaryForCopy: MemberDebtSummary = {
      ...member,
      totalOwed: targetAmount,
      unpaidBillsCount: targetBills.length,
    };
    const text = formatMemberDemandShareText(
      summaryForCopy,
      targetBills,
      currentUser,
      isDetailed,
    );
    navigator.clipboard?.writeText(text);
    toast.success(TOAST_TEXTS.COPY_DEMAND_SUCCESS);
  };

  const handleClearDebt = () => {
    if (!member) return;
    const isClearingAll =
      validSelectedBillIds.length === 0 ||
      validSelectedBillIds.length === unpaidInvoicesWithDetails.length;

    clearMemberDebt(
      member.memberId,
      isClearingAll ? undefined : validSelectedBillIds,
    );
    setSelectedBillIds([]);

    if (isClearingAll) {
      toast.success(TOAST_TEXTS.CLEAR_DEBT_SUCCESS);
      onClose();
    } else {
      toast.success(TOAST_TEXTS.CLEAR_PARTIAL_DEBT_SUCCESS);
    }
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
    validSelectedBillIds,
    isPartialSelection,
    targetBillsCount: targetBills.length,
    targetAmount,
    isEditingName,
    editName,
    setEditName,
    toggleExpand,
    toggleSelectBill,
    toggleSelectAllBills,
    handleStartEdit,
    handleSaveName,
    handleCopyText,
    handleClearDebt,
    handleDeleteMember,
  };
};