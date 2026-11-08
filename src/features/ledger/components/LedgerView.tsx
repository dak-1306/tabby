"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { useLedgerFilter } from "../hooks/useLedgerFilter";
import { LedgerStats } from "./LedgerStats";
import { LedgerFilterBar } from "./LedgerFilterBar";
import { LedgerGrid } from "./LedgerGrid";
import { HostSummaryCard } from "./HostSummaryCard";
import { MemberDetailDrawer } from "@/components/common/MemberDetailDrawer";
import { HostDetailDrawer } from "@/components/common/HostDetailDrawer";
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

  const [isHostDrawerOpen, setIsHostDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground relative overflow-hidden">
      <Header />

      <main className="flex-1 overflow-y-auto px-4 py-4 scrollbar-none flex flex-col gap-4">
        {/* Thống kê tổng quan */}
        <LedgerStats stats={stats} />

        {/* Card chi tiêu cá nhân của Host */}
        <HostSummaryCard onClick={() => setIsHostDrawerOpen(true)} />

        {/* Thanh tìm kiếm & bộ lọc */}
        <LedgerFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Danh sách thành viên */}
        <LedgerGrid
          members={filteredMembers}
          onSelectMember={(member) => setSelectedMember(member)}
        />
      </main>

      {/* Drawer chi tiết của Thành viên khác */}
      <MemberDetailDrawer
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />

      {/* Drawer chi tiết chi tiêu cá nhân của Host */}
      <HostDetailDrawer
        isOpen={isHostDrawerOpen}
        onClose={() => setIsHostDrawerOpen(false)}
      />

      <BottomNav />
    </div>
  );
};
