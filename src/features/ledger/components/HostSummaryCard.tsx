"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { useAppStore } from "@/stores/useAppStore";
import { ChevronRight } from "lucide-react";
import { CURRENCY_SYMBOL, LOCALE_VI } from "@/constants";
import { calculateHostTotalExpense } from "@/utils/calculations";
import { LEDGER_PAGE_TEXTS } from "../constants";

interface HostSummaryCardProps {
  onClick: () => void;
}

export const HostSummaryCard: React.FC<HostSummaryCardProps> = ({
  onClick,
}) => {
  const { invoices, currentUserId, members } = useAppStore();

  const currentUser = members.find((m) => m.id === currentUserId);
  const hostName = currentUser?.name || LEDGER_PAGE_TEXTS.HOST_DEFAULT_NAME;

  const totalHostExpense = calculateHostTotalExpense(invoices, currentUserId);

  return (
    <Card
      clickable
      onClick={onClick}
      className="p-3 bg-card border border-border/70 border-l-4 border-l-primary hover:border-primary/80 transition-all flex items-center justify-between gap-2.5 shadow-xs rounded-xl"
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <MemberAvatar
          name={hostName}
          fallbackText={currentUser?.avatar || "H"}
          size="sm"
        />

        <div className="min-w-0 flex-1">
          <h3 className="text-xs font-bold text-foreground truncate leading-tight">
            {hostName}
          </h3>
          <p className="text-[10px] text-muted-foreground truncate mt-0.5">
            {LEDGER_PAGE_TEXTS.HOST_CARD_SUBTITLE}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 pl-2.5 border-l border-border/40">
        <div className="text-right">
          <span className="text-[9px] text-muted-foreground block font-medium uppercase tracking-wider whitespace-nowrap">
            {LEDGER_PAGE_TEXTS.HOST_CARD_AMOUNT_LABEL}
          </span>
          <span className="text-xs font-extrabold text-primary whitespace-nowrap">
            {totalHostExpense.toLocaleString(LOCALE_VI)} {CURRENCY_SYMBOL}
          </span>
        </div>
        <ChevronRight className="size-4 text-muted-foreground shrink-0" />
      </div>
    </Card>
  );
};
