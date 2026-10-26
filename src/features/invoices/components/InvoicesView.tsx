"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { useInvoicesFilter } from "../hooks/useInvoicesFilter";
import { InvoiceFilterBar } from "./InvoiceFilterBar";
import { InvoiceStats } from "./InvoiceStats";
import { InvoiceGrid } from "./InvoiceGrid";
import { InvoiceDetailDrawer } from "@/components/common/InvoiceDetailDrawer";
import { FormattedRecentInvoice } from "@/features/home/types";

export const InvoicesView: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    filteredInvoices,
    stats,
  } = useInvoicesFilter();

  const [selectedInvoice, setSelectedInvoice] =
    useState<FormattedRecentInvoice | null>(null);

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground relative overflow-hidden">
      <Header />

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24 scrollbar-none flex flex-col gap-4">
        <InvoiceStats stats={stats} />

        <InvoiceFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <InvoiceGrid
          invoices={filteredInvoices}
          onSelectInvoice={(inv) => setSelectedInvoice(inv)}
        />
      </main>

      <InvoiceDetailDrawer
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />

      <BottomNav />
    </div>
  );
};
