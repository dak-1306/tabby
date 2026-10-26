"use client";

import React from "react";
import { StatCard } from "@/components/common/StatCard";
import { LedgerStatsData } from "../types";
import { LEDGER_PAGE_TEXTS } from "../constants";
import { CURRENCY_SYMBOL, LOCALE_VI } from "@/constants";

interface LedgerStatsProps {
  stats: LedgerStatsData;
}

export const LedgerStats: React.FC<LedgerStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <StatCard
        label={LEDGER_PAGE_TEXTS.STATS_TOTAL_OWED}
        value={`${stats.totalOwed.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}`}
        variant="primary"
      />
      <StatCard
        label={LEDGER_PAGE_TEXTS.STATS_DEBT_COUNT}
        value={stats.debtMembersCount}
        variant="warning"
      />
      <StatCard
        label={LEDGER_PAGE_TEXTS.STATS_SETTLED_COUNT}
        value={stats.settledMembersCount}
        variant="success"
      />
    </div>
  );
};
