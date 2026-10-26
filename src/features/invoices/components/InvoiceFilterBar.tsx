"use client";

import React from "react";
import { SearchFilterBar, FilterTabOption } from "@/components/common/SearchFilterBar";
import { InvoiceFilterTab } from "../types";
import { INVOICE_PAGE_TEXTS } from "../constants";
import { INVOICE_STATUS } from "@/constants";

interface InvoiceFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeTab: InvoiceFilterTab;
  onTabChange: (tab: InvoiceFilterTab) => void;
}

export const InvoiceFilterBar: React.FC<InvoiceFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
}) => {
  const tabs: FilterTabOption<InvoiceFilterTab>[] = [
    { id: "all", label: INVOICE_PAGE_TEXTS.TAB_ALL },
    { id: INVOICE_STATUS.PARTIAL, label: INVOICE_PAGE_TEXTS.TAB_PARTIAL },
    { id: INVOICE_STATUS.COMPLETED, label: INVOICE_PAGE_TEXTS.TAB_COMPLETED },
  ];

  return (
    <SearchFilterBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      placeholder={INVOICE_PAGE_TEXTS.SEARCH_PLACEHOLDER}
      activeTab={activeTab}
      onTabChange={onTabChange}
      tabs={tabs}
    />
  );
};