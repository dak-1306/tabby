"use client";

import React from "react";
import {
  SearchFilterBar,
  FilterTabOption,
} from "@/components/common/SearchFilterBar";
import { LedgerFilterTab } from "../types";
import { LEDGER_PAGE_TEXTS } from "../constants";

interface LedgerFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeTab: LedgerFilterTab;
  onTabChange: (tab: LedgerFilterTab) => void;
}

export const LedgerFilterBar: React.FC<LedgerFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
}) => {
  const tabs: FilterTabOption<LedgerFilterTab>[] = [
    { id: "all", label: LEDGER_PAGE_TEXTS.TAB_ALL },
    { id: "has_debt", label: LEDGER_PAGE_TEXTS.TAB_HAS_DEBT },
    { id: "settled", label: LEDGER_PAGE_TEXTS.TAB_SETTLED },
  ];

  return (
    <SearchFilterBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      placeholder={LEDGER_PAGE_TEXTS.SEARCH_PLACEHOLDER}
      activeTab={activeTab}
      onTabChange={onTabChange}
      tabs={tabs}
    />
  );
};
