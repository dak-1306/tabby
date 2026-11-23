import {
  type BaseSyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAppStore } from "@/stores/useAppStore";
import { invoiceSchema, InvoiceFormData } from "@/validations";
import { calculateMemberSplits } from "@/utils/calculations";
import { ROUTES, TOAST_TEXTS } from "@/constants";

const focusAndScrollToRow = (rowIndex: number) => {
  const nextInput = document.getElementById(
    `item-name-input-${rowIndex}`,
  ) as HTMLInputElement | null;
  const nextRowEl = document.getElementById(`item-row-${rowIndex}`);

  if (nextInput) {
    nextInput.focus({ preventScroll: true });
    nextRowEl?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};

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
          id: "item_initial_1",
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

  const prevInvoiceIdRef = useRef<string | null>(existingInvoice?.id ?? null);

  useEffect(() => {
    const currentEditId = existingInvoice?.id ?? null;
    if (currentEditId === prevInvoiceIdRef.current) return;
    prevInvoiceIdRef.current = currentEditId;

    if (existingInvoice) {
      form.reset({
        title: existingInvoice.title,
        selectedMemberIds: initialMemberIds,
        items: initialItems,
      });
    } else {
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
  }, [currentUserId, existingInvoice, form, initialItems, initialMemberIds]);

  useEffect(() => {
    if (isEditMode) return;
    const validMemberIds = new Set(members.map((m) => m.id));
    if (!validMemberIds.has(currentUserId)) return;

    const currentSelected = form.getValues("selectedMemberIds");
    if (currentSelected.includes("m1") && !validMemberIds.has("m1")) {
      const nextSelected = Array.from(
        new Set(
          currentSelected.map((id) => (id === "m1" ? currentUserId : id)),
        ),
      );
      form.setValue("selectedMemberIds", nextSelected);

      const currentItems = form.getValues("items");
      const nextItems = currentItems.map((item) => ({
        ...item,
        assignedMemberIds: Array.from(
          new Set(
            item.assignedMemberIds.map((id) =>
              id === "m1" ? currentUserId : id,
            ),
          ),
        ),
      }));
      form.setValue("items", nextItems);
    }
  }, [currentUserId, form, isEditMode, members]);

  const selectedMemberIds = liveSnapshot.selectedMemberIds;
  const items = liveSnapshot.items;

  const selectedMembers = members.filter((m) =>
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

  const handleToggleSelectAllMembers = () => {
    const current = form.getValues("selectedMemberIds");
    const isAll =
      members.length > 0 && members.every((m) => current.includes(m.id));
    const nextIds = isAll ? [] : members.map((m) => m.id);
    form.setValue("selectedMemberIds", nextIds, { shouldDirty: true });
  };

  const handleAddNewMember = (name: string) => {
    const newM = { id: `m_${Date.now()}`, name, avatar: name[0].toUpperCase() };
    addMember(newM);
    const current = form.getValues("selectedMemberIds");
    form.setValue("selectedMemberIds", [...current, newM.id], {
      shouldDirty: true,
    });
  };

  const handleAddItem = () => {
    const nextIndex = form.getValues("items").length;
    const activeMemberIds = form.getValues("selectedMemberIds");

    flushSync(() => {
      append({
        id: `item_${Date.now()}`,
        name: "",
        price: 0,
        assignedMemberIds:
          activeMemberIds.length > 0 ? [...activeMemberIds] : [currentUserId],
      });
    });

    focusAndScrollToRow(nextIndex);
  };

  const handleNextRow = (currentIndex: number) => {
    const currentItems = form.getValues("items");
    const nextIndex = currentIndex + 1;

    if (nextIndex < currentItems.length) {
      focusAndScrollToRow(nextIndex);
      return;
    }

    handleAddItem();
  };

  const handleSubmit = (e?: BaseSyntheticEvent) =>
    form.handleSubmit((data) => {
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
    })(e);

  return {
    form,
    title: liveSnapshot.title,
    items,
    isEditMode,
    fields,
    allMembers: members,
    selectedMemberIds,
    selectedMembers,
    breakdowns,
    handleToggleMember,
    handleToggleSelectAllMembers,
    handleAddNewMember,
    handleUpdateMember: updateMember,
    handleAddItem,
    handleNextRow,
    handleRemoveItem: remove,
    handleUpdateItem: update,
    handleSubmit,
  };
};
