"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { InlineConfirmButton } from "@/components/common/InlineConfirmButton";
import { Copy, Edit2 } from "lucide-react";
import { Invoice } from "@/types";
import { GroupMember } from "@/types/group";
import {
  CURRENCY_SYMBOL,
  DRAWER_TEXTS,
  GROUP_DETAIL_TEXTS,
  GROUP_ROUTES,
  LOCALE_VI,
  TOAST_TEXTS,
} from "@/constants";
import { calculateItemShare, roundToThousand } from "@/utils/calculations";
import { formatInvoiceGroupShareText } from "@/utils/shareFormatters";

interface GroupInvoiceDetailDrawerProps {
  groupId: string;
  invoice: Invoice | null;
  members: GroupMember[];
  onClose: () => void;
  onDeleteInvoice: (invoiceId: string) => Promise<void>;
}

export const GroupInvoiceDetailDrawer: React.FC<
  GroupInvoiceDetailDrawerProps
> = ({ groupId, invoice, members, onClose, onDeleteInvoice }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!invoice) return null;

  const payer = members.find((m) => m.id === invoice.paidByMemberId);
  const totalAmount = invoice.items.reduce((s, it) => s + it.price, 0);

  const perMemberTotals = new Map<string, number>();
  invoice.items.forEach((item) => {
    if (item.assignedMemberIds.length === 0) return;
    const share = calculateItemShare(item.price, item.assignedMemberIds.length);
    item.assignedMemberIds.forEach((mId) => {
      perMemberTotals.set(mId, (perMemberTotals.get(mId) || 0) + share);
    });
  });

  const handleCopyBill = () => {
    const text = formatInvoiceGroupShareText(invoice, members, payer);
    navigator.clipboard.writeText(text);
    toast.success(TOAST_TEXTS.COPY_BILL_SUCCESS);
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDeleteInvoice(invoice.id);
      toast.success(TOAST_TEXTS.DELETE_INVOICE_SUCCESS);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Drawer
      open={Boolean(invoice)}
      onOpenChange={(open) => {
        if (!open && !isDeleting) onClose();
      }}
    >
      <DrawerContent className="max-h-[88dvh] flex flex-col">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-base font-extrabold">
            {invoice.title}
          </DrawerTitle>
          <DrawerDescription className="text-xs">
            {GROUP_DETAIL_TEXTS.INVOICE_PAYER_PREFIX}{" "}
            <strong className="text-foreground">
              {payer?.name || GROUP_DETAIL_TEXTS.DEFAULT_MEMBER_NAME}
            </strong>{" "}
            {GROUP_DETAIL_TEXTS.INVOICE_TOTAL_PREFIX}{" "}
            <strong className="text-primary">
              {totalAmount.toLocaleString(LOCALE_VI)} {CURRENCY_SYMBOL}
            </strong>
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 py-2 overflow-y-auto space-y-3 scrollbar-none">
          {/* Danh sách món */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {DRAWER_TEXTS.INVOICE_ITEMS_TITLE}
            </p>
            {invoice.items.map((item) => {
              const share = roundToThousand(
                calculateItemShare(item.price, item.assignedMemberIds.length),
              );
              return (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-muted/30 border border-border/50 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{item.name}</span>
                    <span className="text-primary">
                      {item.price.toLocaleString(LOCALE_VI)} {CURRENCY_SYMBOL}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1 flex-wrap">
                      {item.assignedMemberIds.map((mId) => {
                        const m = members.find((mem) => mem.id === mId);
                        if (!m) return null;
                        return (
                          <span
                            key={mId}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-background border border-border/60 text-[10px] font-semibold text-foreground"
                          >
                            <MemberAvatar
                              name={m.name}
                              fallbackText={m.avatar}
                              size="xs"
                            />
                            {m.name}
                          </span>
                        );
                      })}
                    </div>
                    <span className="shrink-0 font-semibold">
                      {share.toLocaleString(LOCALE_VI)} {CURRENCY_SYMBOL}
                      {GROUP_DETAIL_TEXTS.PER_PERSON_UNIT}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tổng hợp chia từng người */}
          <div className="space-y-1.5 pt-2 border-t border-border/50">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {GROUP_DETAIL_TEXTS.MEMBER_SHARES_TITLE}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {Array.from(perMemberTotals.entries()).map(([mId, amount]) => {
                const m = members.find((mem) => mem.id === mId);
                if (!m) return null;
                return (
                  <div
                    key={mId}
                    className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/60 text-xs"
                  >
                    <span className="font-semibold truncate">{m.name}</span>
                    <span className="font-bold text-primary shrink-0">
                      {roundToThousand(amount).toLocaleString(LOCALE_VI)}{" "}
                      {CURRENCY_SYMBOL}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DrawerFooter className="flex-col gap-2 pt-3">
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button
              type="button"
              size="lg"
              disabled={isDeleting}
              className="w-full gap-1.5 min-h-[44px] text-xs font-bold"
              onClick={handleCopyBill}
            >
              <Copy className="size-4" />
              {GROUP_DETAIL_TEXTS.BTN_COPY_BILL_GROUP}
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              disabled={isDeleting}
              className="w-full gap-1.5 min-h-[44px] text-xs font-bold"
              onClick={() => {
                const editUrl = GROUP_ROUTES.CREATE_BILL(groupId, invoice.id);
                onClose();
                router.push(editUrl);
              }}
            >
              <Edit2 className="size-4" />
              {GROUP_DETAIL_TEXTS.BTN_EDIT_BILL}
            </Button>
          </div>

          <InlineConfirmButton
            buttonText={DRAWER_TEXTS.BTN_DELETE_INVOICE}
            confirmTitle={DRAWER_TEXTS.DELETE_INVOICE_TITLE}
            confirmDesc={DRAWER_TEXTS.DELETE_INVOICE_DESC}
            onConfirm={handleDelete}
            disabled={isDeleting}
            variant="destructive"
          />

          <DrawerClose
            render={
              <Button
                type="button"
                variant="ghost"
                disabled={isDeleting}
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
