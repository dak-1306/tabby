"use client";

import React from "react";
import Link from "next/link";
import { FormattedRecentInvoice } from "../types";
import { Card } from "@/components/ui/card";
import { Receipt, ChevronRight, CheckCircle2, Clock } from "lucide-react";
import { HOME_TEXTS } from "../constants";
import {
  CURRENCY_SYMBOL,
  LOCALE_VI,
  INVOICE_STATUS,
  ROUTES,
} from "@/constants";

interface RecentInvoiceListProps {
  invoices: FormattedRecentInvoice[];
  onSelectInvoice?: (invoice: FormattedRecentInvoice) => void;
}

export const RecentInvoiceList: React.FC<RecentInvoiceListProps> = ({
  invoices,
  onSelectInvoice,
}) => {
  return (
    <section className="space-y-2.5">
      {/* Tiêu đề khối */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {HOME_TEXTS.INVOICES_SECTION_TITLE}
        </h2>
        <Link
          href={ROUTES.INVOICES}
          className="text-xs text-primary font-semibold flex items-center hover:underline min-h-[44px] px-1"
        >
          {HOME_TEXTS.INVOICES_LINK_ALL}{" "}
          <ChevronRight className="size-3.5 ml-0.5" />
        </Link>
      </div>

      {/* Grid 2 Cột gọn gàng */}
      {invoices.length === 0 ? (
        <p className="text-xs text-muted-foreground p-3.5 text-center bg-card/60 rounded-xl border border-border/50">
          {HOME_TEXTS.INVOICES_EMPTY}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {invoices.map((inv) => (
            <Card
              key={inv.id}
              clickable
              onClick={() => onSelectInvoice?.(inv)}
              className="p-3 flex flex-col justify-between hover:border-primary/50 transition-all min-h-[100px] gap-2.5"
            >
              {/* Đầu card: Icon, Trạng thái & Tên bill */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <div className="size-7 rounded-lg bg-muted/80 flex items-center justify-center text-foreground shrink-0 border border-border/60">
                    <Receipt className="size-3.5 text-primary" />
                  </div>

                  {inv.status === INVOICE_STATUS.COMPLETED ? (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold tracking-tight bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                      <CheckCircle2 className="size-2.5" />
                      {HOME_TEXTS.INVOICE_STATUS_COMPLETED}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold tracking-tight bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-500/20 shrink-0">
                      <Clock className="size-2.5" />
                      {HOME_TEXTS.INVOICE_STATUS_PARTIAL}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-foreground truncate leading-tight">
                    {inv.title}
                  </h3>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                    {inv.date}
                  </p>
                </div>
              </div>

              {/* Đáy card: 2 chỉ số Tổng bill & Đã thu */}
              <div className="pt-2 border-t border-border/40 grid grid-cols-2 gap-1 text-center">
                <div className="bg-muted/40 p-1.5 rounded-lg border border-border/30 min-w-0">
                  <span className="text-[9px] text-muted-foreground block tracking-tight truncate">
                    {HOME_TEXTS.INVOICE_TOTAL_LABEL}
                  </span>
                  <span className="font-semibold text-foreground text-[11px] truncate block mt-0.5">
                    {inv.totalAmount.toLocaleString(LOCALE_VI)}{" "}
                    {CURRENCY_SYMBOL}
                  </span>
                </div>

                <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20 min-w-0">
                  <span className="text-[9px] text-muted-foreground block tracking-tight truncate">
                    {HOME_TEXTS.INVOICE_COLLECTED_LABEL}
                  </span>
                  <span className="font-semibold text-emerald-400 text-[11px] truncate block mt-0.5">
                    {inv.collectedAmount.toLocaleString(LOCALE_VI)}{" "}
                    {CURRENCY_SYMBOL}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};
