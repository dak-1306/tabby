"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { useLedgerFilter } from "../hooks/useLedgerFilter";
import { LedgerStats } from "./LedgerStats";
import { LedgerFilterBar } from "./LedgerFilterBar";
import { LedgerGrid } from "./LedgerGrid";
import { MemberDetailDrawer } from "@/components/common/MemberDetailDrawer";
import { LedgerMemberSummary } from "../types";

export const LedgerView: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    filteredMembers,
    stats,
  } = useLedgerFilter();

  const [selectedMember, setSelectedMember] =
    useState<LedgerMemberSummary | null>(null);

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground relative overflow-hidden">
      <Header />

      <main className="flex-1 overflow-y-auto px-4 py-4 scrollbar-none flex flex-col gap-4">
        <LedgerStats stats={stats} />

        <LedgerFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <LedgerGrid
          members={filteredMembers}
          onSelectMember={(member) => setSelectedMember(member)}
        />
      </main>

      <MemberDetailDrawer
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />

      <BottomNav />
    </div>
  );
};
