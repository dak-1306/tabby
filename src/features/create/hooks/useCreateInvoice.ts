import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAppStore } from "@/stores/useAppStore";
import { DraftItem } from "../types";
import { calculateMemberSplits } from "../utils/splitCalculator";
import { ROUTES, TOAST_TEXTS } from "@/constants";

export const useCreateInvoice = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const {
    invoices,
    members,
    currentUserId,
    addInvoice,
    updateInvoice,
    addMember,
  } = useAppStore();

  const existingInvoice = useMemo(
    () => (editId ? invoices.find((i) => i.id === editId) : null),
    [editId, invoices],
  );

  const isEditMode = Boolean(existingInvoice);

  // 1. Tính toán giá trị khởi tạo động từ existingInvoice
  const initialMemberIds = useMemo(() => {
    if (!existingInvoice) return [currentUserId];
    const set = new Set<string>([existingInvoice.paidByMemberId]);
    existingInvoice.items.forEach((item) => {
      item.assignedMemberIds.forEach((mId) => set.add(mId));
    });
    return Array.from(set);
  }, [existingInvoice, currentUserId]);

  const initialItems = useMemo(() => {
    if (!existingInvoice) {
      return [
        { id: "1", name: "", price: 0, assignedMemberIds: [currentUserId] },
      ];
    }
    return existingInvoice.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      assignedMemberIds: [...item.assignedMemberIds],
    }));
  }, [existingInvoice, currentUserId]);

  // 2. Khởi tạo State lười (Lazy Initializer)
  const [title, setTitle] = useState(() => existingInvoice?.title ?? "");
  const [selectedMemberIds, setSelectedMemberIds] =
    useState<string[]>(initialMemberIds);
  const [items, setItems] = useState<DraftItem[]>(initialItems);

  // 3. Đồng bộ State trực tiếp trong quá trình Render khi editId/existingInvoice thay đổi (Thay thế useEffect)
  const [prevInvoiceId, setPrevInvoiceId] = useState<string | null>(
    existingInvoice?.id ?? null,
  );

  if (existingInvoice && existingInvoice.id !== prevInvoiceId) {
    setPrevInvoiceId(existingInvoice.id);
    setTitle(existingInvoice.title);
    setSelectedMemberIds(initialMemberIds);
    setItems(initialItems);
  } else if (!existingInvoice && prevInvoiceId !== null) {
    setPrevInvoiceId(null);
    setTitle("");
    setSelectedMemberIds([currentUserId]);
    setItems([
      { id: "1", name: "", price: 0, assignedMemberIds: [currentUserId] },
    ]);
  }

  const selectedMembers = useMemo(
    () => members.filter((m) => selectedMemberIds.includes(m.id)),
    [members, selectedMemberIds],
  );

  const breakdowns = useMemo(
    () => calculateMemberSplits(items, selectedMembers),
    [items, selectedMembers],
  );

  const handleToggleMember = (mId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(mId) ? prev.filter((id) => id !== mId) : [...prev, mId],
    );
  };

  const handleAddNewMember = (name: string) => {
    const newM = { id: `m_${Date.now()}`, name, avatar: name[0].toUpperCase() };
    addMember(newM);
    setSelectedMemberIds((prev) => [...prev, newM.id]);
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item_${Date.now()}`,
        name: "",
        price: 0,
        assignedMemberIds: [...selectedMemberIds],
      },
    ]);
  };

  const handleUpdateItem = (updated: DraftItem) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const handleRemoveItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleSubmit = () => {
    if (!title.trim() || items.length === 0) return;

    const formattedItems = items.map((i) => ({
      id: i.id,
      name: i.name || "Món chưa tên",
      price: i.price,
      assignedMemberIds: i.assignedMemberIds,
    }));

    if (isEditMode && existingInvoice) {
      updateInvoice({
        ...existingInvoice,
        title,
        items: formattedItems,
      });
      toast.success(TOAST_TEXTS.UPDATE_INVOICE_SUCCESS);
    } else {
      addInvoice({
        id: `inv_${Date.now()}`,
        title,
        paidByMemberId: currentUserId,
        createdAt: new Date().toISOString(),
        status: "partial",
        items: formattedItems,
      });
      toast.success(TOAST_TEXTS.CREATE_INVOICE_SUCCESS);
    }

    router.push(ROUTES.HOME);
  };

  return {
    isEditMode,
    title,
    setTitle,
    allMembers: members,
    selectedMemberIds,
    selectedMembers,
    items,
    breakdowns,
    handleToggleMember,
    handleAddNewMember,
    handleAddItem,
    handleUpdateItem,
    handleRemoveItem,
    handleSubmit,
  };
};
