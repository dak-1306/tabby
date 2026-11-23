"use client";

import React from "react";
import { FormattedRecentInvoice } from "@/features/home/types";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { InlineConfirmButton } from "@/components/common/InlineConfirmButton";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Copy, CheckCircle2, Pencil } from "lucide-react";
import {
  DRAWER_TEXTS,
  CURRENCY_SYMBOL,
  LOCALE_VI,
  INVOICE_STATUS,
} from "@/constants";
import { useInvoiceDetailDrawer } from "@/hooks/useInvoiceDetailDrawer";
import { cn } from "@/utils/utils";

interface InvoiceDetailDrawerProps {
  invoice: FormattedRecentInvoice | null;
  onClose: () => void;
}

export const InvoiceDetailDrawer: React.FC<InvoiceDetailDrawerProps> = ({
  invoice,
  onClose,
}) => {
  const {
    fullInvoice,
    members,
    handleCopySummary,
    handleEdit,
    handleDelete,
    handleMarkCompleted,
  } = useInvoiceDetailDrawer(invoice, onClose);

  if (!invoice) return null;

  const paidMemberSet = new Set(fullInvoice?.paidMemberIds ?? []);
  const isBillCompleted =
    (fullInvoice?.status ?? invoice.status) === INVOICE_STATUS.COMPLETED;

  return (
    <Drawer open={Boolean(invoice)} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-base font-bold">
            {invoice.title}
          </DrawerTitle>
          <DrawerDescription className="text-xs text-muted-foreground mt-0.5">
            {DRAWER_TEXTS.INVOICE_DATE_PREFIX} {invoice.date}{" "}
            {DRAWER_TEXTS.INVOICE_TOTAL_PREFIX}{" "}
            <span className="font-bold text-foreground">
              {invoice.totalAmount.toLocaleString(LOCALE_VI)} {CURRENCY_SYMBOL}
            </span>
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 py-2 space-y-2.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {DRAWER_TEXTS.INVOICE_ITEMS_TITLE}
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {fullInvoice?.items.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl bg-card border border-border/60 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">
                    {item.name}
                  </span>
                  <span className="font-bold text-primary">
                    {item.price.toLocaleString(LOCALE_VI)} {CURRENCY_SYMBOL}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  {item.assignedMemberIds.map((mId) => {
                    const m = members.find((mem) => mem.id === mId);
                    if (!m) return null;
                    const isPaid =
                      mId !== fullInvoice.paidByMemberId &&
                      (isBillCompleted || paidMemberSet.has(mId));

                    return (
                      <span
                        key={mId}
                        className={cn(
                          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-semibold",
                          isPaid
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                            : "bg-background border-border/60 text-foreground",
                        )}
                      >
                        <MemberAvatar
                          name={m.name}
                          fallbackText={m.avatar}
                          size="xs"
                        />
                        <span>{m.name}</span>
                        {isPaid && (
                          <span className="text-[9px] font-bold">
                            ({DRAWER_TEXTS.PAID_BADGE_LABEL})
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DrawerFooter className="flex-col gap-2 pt-3">
          <Button
            type="button"
            size="lg"
            className="w-full gap-2 min-h-[44px]"
            onClick={handleCopySummary}
          >
            <Copy className="size-4" />
            {DRAWER_TEXTS.BTN_COPY_SUMMARY}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full gap-2 min-h-[44px]"
            onClick={handleEdit}
          >
            <Pencil className="size-4" />
            {DRAWER_TEXTS.BTN_EDIT_INVOICE}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isBillCompleted}
            className="w-full gap-2 min-h-[44px]"
            onClick={handleMarkCompleted}
          >
            <CheckCircle2 className="size-4 text-primary" />
            {isBillCompleted
              ? DRAWER_TEXTS.BTN_ALREADY_COMPLETED
              : DRAWER_TEXTS.BTN_MARK_COMPLETED}
          </Button>

          <InlineConfirmButton
            buttonText={DRAWER_TEXTS.BTN_DELETE_INVOICE}
            confirmTitle={DRAWER_TEXTS.DELETE_INVOICE_TITLE}
            confirmDesc={DRAWER_TEXTS.DELETE_INVOICE_DESC}
            onConfirm={handleDelete}
            variant="destructive"
          />

          <DrawerClose
            render={
              <Button
                type="button"
                variant="ghost"
                className="w-full min-h-[44px]"
                onClick={onClose}
              >
                {DRAWER_TEXTS.BTN_CLOSE}
              </Button>
            }
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
