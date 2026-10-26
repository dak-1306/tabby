import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/stores/useAppStore";
import { DraftItem } from "../types";
import { calculateMemberSplits } from "../utils/splitCalculator";
import { ROUTES } from "@/constants";

export const useCreateInvoice = () => {
  const router = useRouter();
  const { members, currentUserId, addInvoice, addMember } = useAppStore();

  const [title, setTitle] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([
    currentUserId,
  ]);
  const [items, setItems] = useState<DraftItem[]>([
    { id: "1", name: "", price: 0, assignedMemberIds: [currentUserId] },
  ]);

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
    const newM = {
      id: `m_${Date.now()}`,
      name,
      avatar: name[0].toUpperCase(),
    };
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

    addInvoice({
      id: `inv_${Date.now()}`,
      title,
      paidByMemberId: currentUserId,
      createdAt: new Date().toISOString(),
      status: "partial",
      items: items.map((i) => ({
        id: i.id,
        name: i.name || "Món chưa tên",
        price: i.price,
        assignedMemberIds: i.assignedMemberIds,
      })),
    });

    router.push(ROUTES.HOME);
  };

  return {
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
