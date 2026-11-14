import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAppStore } from "@/stores/useAppStore";
import { invoiceSchema, InvoiceFormData } from "@/validations";
import { calculateMemberSplits } from "@/utils/calculations";
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
    updateMember,
  } = useAppStore();

  const existingInvoice = useMemo(
    () => (editId ? invoices.find((i) => i.id === editId) : null),
    [editId, invoices],
  );

  const isEditMode = Boolean(existingInvoice);

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
        {
          id: `item_${Date.now()}`,
          name: "",
          price: 0,
          assignedMemberIds: [currentUserId],
        },
      ];
    }
    return existingInvoice.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      assignedMemberIds: [...item.assignedMemberIds],
    }));
  }, [existingInvoice, currentUserId]);

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      title: existingInvoice?.title ?? "",
      selectedMemberIds: initialMemberIds,
      items: initialItems,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const [prevInvoiceId, setPrevInvoiceId] = useState<string | null>(
    existingInvoice?.id ?? null,
  );

  if (existingInvoice && existingInvoice.id !== prevInvoiceId) {
    setPrevInvoiceId(existingInvoice.id);
    form.reset({
      title: existingInvoice.title,
      selectedMemberIds: initialMemberIds,
      items: initialItems,
    });
  } else if (!existingInvoice && prevInvoiceId !== null) {
    setPrevInvoiceId(null);
    form.reset({
      title: "",
      selectedMemberIds: [currentUserId],
      items: [
        {
          id: `item_${Date.now()}`,
          name: "",
          price: 0,
          assignedMemberIds: [currentUserId],
        },
      ],
    });
  }

  const selectedMemberIds = form.watch("selectedMemberIds");
  const watchItems = form.watch("items");

  const selectedMembers = useMemo(
    () => members.filter((m) => selectedMemberIds.includes(m.id)),
    [members, selectedMemberIds],
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

  const handleAddNewMember = (name: string) => {
    const newM = { id: `m_${Date.now()}`, name, avatar: name[0].toUpperCase() };
    addMember(newM);
    const current = form.getValues("selectedMemberIds");
    form.setValue("selectedMemberIds", [...current, newM.id]);
  };

  const handleAddItem = () => {
    const activeMemberIds = form.getValues("selectedMemberIds");
    append({
      id: `item_${Date.now()}`,
      name: "",
      price: 0,
      assignedMemberIds:
        activeMemberIds.length > 0 ? [...activeMemberIds] : [currentUserId],
    });
  };

  const handleSubmit = form.handleSubmit((data) => {
    if (isEditMode && existingInvoice) {
      updateInvoice({
        ...existingInvoice,
        title: data.title,
        items: data.items,
      });
      toast.success(TOAST_TEXTS.UPDATE_INVOICE_SUCCESS);
    } else {
      addInvoice({
        id: `inv_${Date.now()}`,
        title: data.title,
        paidByMemberId: currentUserId,
        createdAt: new Date().toISOString(),
        status: "partial",
        items: data.items,
      });
      toast.success(TOAST_TEXTS.CREATE_INVOICE_SUCCESS);
    }
    router.push(ROUTES.HOME);
  });

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
      if (nextInput) {
        nextInput.focus();
      }
    }, 50);
  };

  return {
    form,
    isEditMode,
    fields,
    allMembers: members,
    selectedMemberIds,
    selectedMembers,
    breakdowns,
    handleToggleMember,
    handleAddNewMember,
    handleUpdateMember: updateMember,
    handleAddItem,
    handleNextRow,
    handleRemoveItem: remove,
    handleUpdateItem: update,
    handleSubmit,
  };
};
