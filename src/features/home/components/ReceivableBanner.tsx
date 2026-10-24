"use client";

import React from "react";
import { TrendingUp, Clock, Users, Receipt } from "lucide-react";
import { HOME_TEXTS } from "../constants";
import { CURRENCY_SYMBOL, LOCALE_VI } from "@/constants";

interface ReceivableBannerProps {
  totalReceivable: number;
  unpaidMembersCount: number;
  unpaidInvoicesCount: number;
}

export const ReceivableBanner: React.FC<ReceivableBannerProps> = ({
  totalReceivable,
  unpaidMembersCount,
  unpaidInvoicesCount,
}) => {
  return (
    <section className="w-full bg-primary/10 border border-primary/25 rounded-2xl p-4 flex flex-col gap-3 shrink-0 box-border">
      {/* Header Banner */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary min-w-0">
          <TrendingUp className="size-4 shrink-0" />
          <span className="truncate">{HOME_TEXTS.BANNER_TITLE}</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-medium tracking-tight bg-primary/20 text-primary px-2.5 py-0.5 rounded-full border border-primary/30 shrink-0 whitespace-nowrap">
          <Clock className="size-3" /> {HOME_TEXTS.BANNER_STATUS_WAITING}
        </span>
      </div>

      {/* Hiển thị con số tổng */}
      <div>
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary leading-tight">
          {totalReceivable.toLocaleString(LOCALE_VI)}{" "}
          <span className="text-sm font-semibold text-muted-foreground">
            {CURRENCY_SYMBOL}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 font-medium leading-normal">
          {HOME_TEXTS.BANNER_SUBTITLE}
        </p>
      </div>

      {/* Grid 2 chỉ số phụ */}
      <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-primary/15 text-xs">
        <div className="flex items-center gap-2 bg-card/80 rounded-xl p-2.5 border border-border/50 min-h-[44px]">
          <Users className="size-4 text-primary shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-foreground text-xs leading-tight truncate">
              {unpaidMembersCount} {HOME_TEXTS.UNIT_PERSON}
            </p>
            <p className="text-[10px] text-muted-foreground tracking-tight truncate mt-0.5">
              {HOME_TEXTS.BANNER_UNPAID_MEMBERS_LABEL}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-card/80 rounded-xl p-2.5 border border-border/50 min-h-[44px]">
          <Receipt className="size-4 text-primary shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-foreground text-xs leading-tight truncate">
              {unpaidInvoicesCount} {HOME_TEXTS.UNIT_INVOICE}
            </p>
            <p className="text-[10px] text-muted-foreground tracking-tight truncate mt-0.5">
              {HOME_TEXTS.BANNER_UNPAID_INVOICES_LABEL}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
