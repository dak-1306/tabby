"use client";

import React, { useState } from "react";
import { FormattedRecentInvoice } from "@/features/home/types";
import { useAppStore } from "@/stores/useAppStore";
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
import { Copy, Check, CheckCircle2 } from "lucide-react";
import {
  DRAWER_TEXTS,
  CURRENCY_SYMBOL,
  LOCALE_VI,
  INVOICE_STATUS,
} from "@/constants";

interface InvoiceDetailDrawerProps {
  invoice: FormattedRecentInvoice | null;
  onClose: () => void;
}

export const InvoiceDetailDrawer: React.FC<InvoiceDetailDrawerProps> = ({
  invoice,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const { invoices, markInvoiceCompleted } = useAppStore();

  if (!invoice) return null;

  const fullInvoice = invoices.find((inv) => inv.id === invoice.id);

  const handleCopySummary = () => {
    const text = `Tóm tắt Bill: ${invoice.title}\nTổng bill: ${invoice.totalAmount.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}\nCòn nợ: ${invoice.uncollectedAmount.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}\nMọi người check chuyển khoản giúp mình nha!`;

    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkCompleted = () => {
    markInvoiceCompleted(invoice.id);
    onClose();
  };

  return (
    <Drawer open={Boolean(invoice)} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-base font-bold">
            {invoice.title}
          </DrawerTitle>
          <DrawerDescription className="text-xs text-muted-foreground mt-0.5">
            Ngày: {invoice.date} • Tổng:{" "}
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
                className="p-2.5 rounded-xl bg-card border border-border/60 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {DRAWER_TEXTS.SPLIT_WITH_LABEL}{" "}
                    {item.assignedMemberIds.length} người
                  </p>
                </div>
                <span className="font-bold text-foreground">
                  {item.price.toLocaleString(LOCALE_VI)} {CURRENCY_SYMBOL}
                </span>
              </div>
            ))}
          </div>
        </div>

        <DrawerFooter className="flex-col gap-2 pt-3">
          <Button
            size="lg"
            className="w-full gap-2 min-h-[44px]"
            onClick={handleCopySummary}
          >
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
            {copied ? DRAWER_TEXTS.BTN_COPIED : DRAWER_TEXTS.BTN_COPY_SUMMARY}
          </Button>

          {invoice.status !== INVOICE_STATUS.COMPLETED && (
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2 min-h-[44px]"
              onClick={handleMarkCompleted}
            >
              <CheckCircle2 className="size-4 text-primary" />
              {DRAWER_TEXTS.BTN_MARK_COMPLETED}
            </Button>
          )}

          <DrawerClose
            render={
              <Button
                variant="ghost"
                className="w-full min-h-[44px]"
                onClick={onClose}
              />
            }
          >
            {DRAWER_TEXTS.BTN_CLOSE}
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
