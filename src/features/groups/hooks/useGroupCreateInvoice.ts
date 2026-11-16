"use client";

import {
  type BaseSyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
          id: "item_initial_1",
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

  // Đồng bộ lại form và người trả tiền nếu chuyển sang chế độ sửa bill
  const prevEditIdRef = useRef<string | null>(existingInvoice?.id ?? null);
  useEffect(() => {
    const currentId = existingInvoice?.id ?? null;
    if (currentId === prevEditIdRef.current) return;
    prevEditIdRef.current = currentId;

    if (existingInvoice) {
      setPaidByMemberId(existingInvoice.paidByMemberId);
      form.reset({
        title: existingInvoice.title,
        selectedMemberIds: initialMemberIds,
        items: initialItems,
      });
    }
  }, [existingInvoice, form, initialItems, initialMemberIds]);

  // Snapshot state giúp LiveReceiptPreview cập nhật tức thì theo từng phím gõ
  const [liveSnapshot, setLiveSnapshot] = useState<{
    title: string;
    selectedMemberIds: string[];
    items: InvoiceFormData["items"];
  }>(() => ({
    title: existingInvoice?.title ?? "",
    selectedMemberIds: initialMemberIds,
    items: initialItems,
  }));

  useEffect(() => {
    const syncSnapshot = () => {
      const values = form.getValues();
      setLiveSnapshot({
        title: values.title ?? "",
        selectedMemberIds: [...(values.selectedMemberIds ?? [])],
        items: (values.items ?? []).map((item, idx) => ({
          id: item?.id || `item_${idx}`,
          name: item?.name ?? "",
          price: Number(item?.price) || 0,
          assignedMemberIds: [...(item?.assignedMemberIds ?? [])],
        })),
      });
    };

    syncSnapshot();
    const subscription = form.watch(() => {
      syncSnapshot();
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const selectedMemberIds = liveSnapshot.selectedMemberIds;
  const items = liveSnapshot.items;

  const selectedMembers = group.members.filter((m) =>
    selectedMemberIds.includes(m.id),
  );

  const breakdowns = calculateMemberSplits(items, selectedMembers);

  const handleToggleMember = (mId: string) => {
    const current = form.getValues("selectedMemberIds");
    const updated = current.includes(mId)
      ? current.filter((id) => id !== mId)
      : [...current, mId];
    form.setValue("selectedMemberIds", updated, { shouldDirty: true });
  };

  const handleAddNewMember = async (name: string) => {
    const currentSessionMemberId =
      useGroupStore.getState().sessions[group.id] || defaultPayerId;
    const created = await addAndSelectMember(group.id, name);
    useGroupStore.getState().setSessionMember(group.id, currentSessionMemberId);

    if (created) {
      const current = form.getValues("selectedMemberIds");
      if (!current.includes(created.id)) {
        form.setValue("selectedMemberIds", [...current, created.id], {
          shouldDirty: true,
        });
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

  const handleSubmit = (e?: BaseSyntheticEvent) =>
    form.handleSubmit(async (data) => {
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
    })(e);

  return {
    form,
    title: liveSnapshot.title,
    items,
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