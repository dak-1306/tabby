"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { useAppStore } from "@/stores/useAppStore";
import { ChevronRight, Receipt } from "lucide-react";
import { CURRENCY_SYMBOL, LOCALE_VI } from "@/constants";
import { calculateHostTotalExpense } from "@/utils/calculations";

interface HostSummaryCardProps {
  onClick: () => void;
}

export const HostSummaryCard: React.FC<HostSummaryCardProps> = ({
  onClick,
}) => {
  const { invoices, currentUserId, members } = useAppStore();

  const currentUser = members.find((m) => m.id === currentUserId);
  const hostName = currentUser?.name || "Bạn (Host)";

  const totalHostExpense = calculateHostTotalExpense(invoices, currentUserId);

  const hostBillCount = invoices.filter((inv) =>
    inv.items.some((item) => item.assignedMemberIds.includes(currentUserId)),
  ).length;

  return (
    <Card
      clickable
      onClick={onClick}
      className="p-3 bg-card border border-border/70 border-l-4 border-l-primary hover:border-primary/80 transition-all flex items-center justify-between shadow-xs rounded-xl"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <MemberAvatar
          name={hostName}
          fallbackText={currentUser?.avatar || "H"}
          size="sm"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-bold text-foreground truncate">
              {hostName}
            </h3>
            <span className="text-[9px] bg-primary/15 text-primary font-bold px-1.5 py-0.5 rounded-md leading-none">
              Chi tiêu cá nhân
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <Receipt className="size-3 shrink-0" />
            <span>
              {hostBillCount > 0
                ? `${hostBillCount} hóa đơn có bạn`
                : "Chưa tham gia món nào"}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-border/40">
        <div className="text-right">
          <span className="text-[9px] text-muted-foreground block font-medium uppercase tracking-wider">
            Phần của bạn
          </span>
          <span className="text-xs font-extrabold text-primary">
            {totalHostExpense.toLocaleString(LOCALE_VI)} {CURRENCY_SYMBOL}
          </span>
        </div>
        <ChevronRight className="size-4 text-muted-foreground shrink-0" />
      </div>
    </Card>
  );
};
