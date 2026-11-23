"use client";

import React, { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { useInvoicesFilter } from "../hooks/useInvoicesFilter";
import { InvoiceFilterBar } from "./InvoiceFilterBar";
import { InvoiceStats } from "./InvoiceStats";
import { InvoiceGrid } from "./InvoiceGrid";
import { InvoiceDetailDrawer } from "@/components/common/InvoiceDetailDrawer";

export const InvoicesView: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    formattedInvoices,
    filteredInvoices,
    stats,
  } = useInvoicesFilter();

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null,
  );

  const selectedInvoice = useMemo(
    () =>
      selectedInvoiceId
        ? (formattedInvoices.find((inv) => inv.id === selectedInvoiceId) ??
          null)
        : null,
    [formattedInvoices, selectedInvoiceId],
  );

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground relative overflow-hidden">
      <Header />

      <main className="flex-1 overflow-y-auto px-4 py-4 scrollbar-none flex flex-col gap-4">
        <InvoiceStats stats={stats} />

        <InvoiceFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <InvoiceGrid
          invoices={filteredInvoices}
          onSelectInvoice={(inv) => setSelectedInvoiceId(inv.id)}
        />
      </main>

      <InvoiceDetailDrawer
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoiceId(null)}
      />

      <BottomNav />
    </div>
  );
};
