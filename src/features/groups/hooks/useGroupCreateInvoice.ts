"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { invoiceSchema, InvoiceFormData } from "@/validations";
import { calculateMemberSplits } from "@/utils/calculations";
import { Group } from "@/types/group";
import { GROUP_ROUTES, TOAST_TEXTS } from "@/constants";
import { useGroupStore } from "@/stores/useGroupStore";

interface UseGroupCreateInvoiceParams {
  group: Group;
  defaultPayerId: string;
  editBillId?: string | null;
}

export const useGroupCreateInvoice = ({
  group,
  defaultPayerId,
  editBillId,
}: UseGroupCreateInvoiceParams) => {
  const router = useRouter();
  const addGroupInvoice = useGroupStore((s) => s.addGroupInvoice);
  const updateGroupInvoice = useGroupStore((s) => s.updateGroupInvoice);
  const addAndSelectMember = useGroupStore((s) => s.addAndSelectMember);
  const updateMemberName = useGroupStore((s) => s.updateMemberName);

  const existingInvoice = useMemo(
    () => (editBillId ? group.invoices.find((i) => i.id === editBillId) : null),
    [editBillId, group.invoices],
  );

  const isEditMode = Boolean(existingInvoice);

  const [paidByMemberId, setPaidByMemberId] = useState<string>(
    existingInvoice?.paidByMemberId || defaultPayerId,
  );

  const initialMemberIds = useMemo(() => {
    if (!existingInvoice) {
      return group.members.map((m) => m.id);
    }
    const set = new Set<string>([existingInvoice.paidByMemberId]);
    existingInvoice.items.forEach((item) => {
      item.assignedMemberIds.forEach((mId) => set.add(mId));
    });
    return Array.from(set);
  }, [existingInvoice, group.members]);

  const initialItems = useMemo(() => {
    if (!existingInvoice) {
      return [
        {
          id: `item_${Date.now()}`,
          name: "",
          price: 0,
          assignedMemberIds: [defaultPayerId],
        },
      ];
    }
    return existingInvoice.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      assignedMemberIds: [...item.assignedMemberIds],
    }));
  }, [existingInvoice, defaultPayerId]);

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      title: existingInvoice?.title ?? "",
      selectedMemberIds: initialMemberIds,
      items: initialItems,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const selectedMemberIds = form.watch("selectedMemberIds");
  const watchItems = form.watch("items");

  const selectedMembers = useMemo(
    () => group.members.filter((m) => selectedMemberIds.includes(m.id)),
    [group.members, selectedMemberIds],
  );

  const breakdowns = useMemo(
    () => calculateMemberSplits(watchItems || [], selectedMembers),
    [watchItems, selectedMembers],
  );

  const handleToggleMember = (mId: string) => {
    const current = form.getValues("selectedMemberIds");
    const updated = current.includes(mId)
      ? current.filter((id) => id !== mId)
      : [...current, mId];
    form.setValue("selectedMemberIds", updated);
  };

  const handleAddNewMember = async (name: string) => {
    // Giữ nguyên session hiện tại của người đang thao tác
    const currentSessionMemberId =
      useGroupStore.getState().sessions[group.id] || defaultPayerId;
    const created = await addAndSelectMember(group.id, name);
    useGroupStore.getState().setSessionMember(group.id, currentSessionMemberId);

    if (created) {
      const current = form.getValues("selectedMemberIds");
      if (!current.includes(created.id)) {
        form.setValue("selectedMemberIds", [...current, created.id]);
      }
    }
  };

  const handleUpdateMember = async (memberId: string, name: string) => {
    await updateMemberName(group.id, memberId, name);
  };

  const handleAddItem = () => {
    const activeMemberIds = form.getValues("selectedMemberIds");
    append({
      id: `item_${Date.now()}`,
      name: "",
      price: 0,
      assignedMemberIds:
        activeMemberIds.length > 0 ? [...activeMemberIds] : [paidByMemberId],
    });
  };

  const handleNextRow = (currentIndex: number) => {
    const currentItems = form.getValues("items");
    const nextIndex = currentIndex + 1;

    if (nextIndex < currentItems.length) {
      const nextInput = document.getElementById(`item-name-input-${nextIndex}`);
      if (nextInput) {
        nextInput.focus();
        return;
      }
    }

    handleAddItem();
    setTimeout(() => {
      const nextInput = document.getElementById(`item-name-input-${nextIndex}`);
      if (nextInput) nextInput.focus();
    }, 50);
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    if (isEditMode && existingInvoice) {
      await updateGroupInvoice(group.id, {
        ...existingInvoice,
        title: data.title,
        paidByMemberId,
        items: data.items,
      });
      toast.success(TOAST_TEXTS.UPDATE_INVOICE_SUCCESS);
    } else {
      await addGroupInvoice(group.id, {
        id: `inv_${Date.now().toString(36)}`,
        title: data.title,
        paidByMemberId,
        createdAt: new Date().toISOString(),
        status: "partial",
        items: data.items,
      });
      toast.success(TOAST_TEXTS.CREATE_INVOICE_SUCCESS);
    }
    router.push(GROUP_ROUTES.DETAIL(group.id));
  });

  return {
    form,
    isEditMode,
    fields,
    paidByMemberId,
    setPaidByMemberId,
    allMembers: group.members,
    selectedMemberIds,
    selectedMembers,
    breakdowns,
    handleToggleMember,
    handleAddNewMember,
    handleUpdateMember,
    handleAddItem,
    handleRemoveItem: remove,
    handleNextRow,
    handleSubmit,
  };
};
