import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormattedRecentInvoice } from "@/features/home/types";
import { useAppStore } from "@/stores/useAppStore";
import { formatInvoiceGroupShareText } from "@/lib/shareFormatters";
import { TOAST_TEXTS, ROUTES } from "@/constants";

export const useInvoiceDetailDrawer = (
  invoice: FormattedRecentInvoice | null,
  onClose: () => void,
) => {
  const router = useRouter();
  const {
    invoices,
    members,
    currentUserId,
    markInvoiceCompleted,
    deleteInvoice,
  } = useAppStore();

  const fullInvoice = useMemo(
    () =>
      invoice ? invoices.find((inv) => inv.id === invoice.id) || null : null,
    [invoice, invoices],
  );

  const currentUser = useMemo(
    () => members.find((m) => m.id === currentUserId),
    [members, currentUserId],
  );

  const handleCopySummary = () => {
    if (!fullInvoice) return;
    const text = formatInvoiceGroupShareText(fullInvoice, members, currentUser);
    navigator.clipboard?.writeText(text);
    toast.success(TOAST_TEXTS.COPY_BILL_SUCCESS);
  };

  const handleEdit = () => {
    if (!invoice) return;
    onClose();
    router.push(`${ROUTES.CREATE}?edit=${invoice.id}`);
  };

  const handleDelete = () => {
    if (!invoice) return;
    deleteInvoice(invoice.id);
    toast.success(TOAST_TEXTS.DELETE_INVOICE_SUCCESS);
    onClose();
  };

  const handleMarkCompleted = () => {
    if (!invoice) return;
    markInvoiceCompleted(invoice.id);
    toast.success(TOAST_TEXTS.MARK_COMPLETED_SUCCESS);
    onClose();
  };

  return {
    fullInvoice,
    members,
    handleCopySummary,
    handleEdit,
    handleDelete,
    handleMarkCompleted,
  };
};
