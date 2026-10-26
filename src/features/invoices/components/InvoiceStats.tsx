"use client";

import React from "react";
import { StatCard } from "@/components/common/StatCard";
import { InvoicesStatsData } from "../types";
import { INVOICE_PAGE_TEXTS } from "../constants";

interface InvoiceStatsProps {
  stats: InvoicesStatsData;
}

export const InvoiceStats: React.FC<InvoiceStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <StatCard
        label={INVOICE_PAGE_TEXTS.STATS_TOTAL_COUNT}
        value={stats.totalCount}
        variant="default"
      />
      <StatCard
        label={INVOICE_PAGE_TEXTS.STATS_COLLECTED}
        value={stats.completedCount}
        variant="success"
      />
      <StatCard
        label={INVOICE_PAGE_TEXTS.STATS_PARTIAL}
        value={stats.partialCount}
        variant="warning"
      />
    </div>
  );
};
