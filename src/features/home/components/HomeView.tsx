"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { useHomeSummary } from "../hooks/useHomeSummary";
import { ReceivableBanner } from "./ReceivableBanner";
import { DebtMemberList } from "./DebtMemberList";
import { RecentInvoiceList } from "./RecentInvoiceList";
import { MemberDetailDrawer } from "@/components/common/MemberDetailDrawer";
import { InvoiceDetailDrawer } from "@/components/common/InvoiceDetailDrawer";
import { OnboardingModal } from "@/components/common/OnboardingModal";
import { MemberDebtSummary } from "@/types";
import { FormattedRecentInvoice } from "../types";
import { HomeGroupSection } from "@/features/groups/components/HomeGroupSection";

export const HomeView: React.FC = () => {
  const summary = useHomeSummary();
  const [selectedMember, setSelectedMember] =
    useState<MemberDebtSummary | null>(null);
  const [selectedInvoice, setSelectedInvoice] =
    useState<FormattedRecentInvoice | null>(null);

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground relative overflow-hidden">
      {/* Trigger Modal lần đầu mở app */}
      <OnboardingModal />

      <Header />

      <main className="flex-1 overflow-y-auto px-4 py-4 scrollbar-none flex flex-col gap-5">
        <ReceivableBanner
          totalReceivable={summary.totalReceivable}
          unpaidMembersCount={summary.unpaidMembersCount}
          unpaidInvoicesCount={summary.unpaidInvoicesCount}
        />

        <HomeGroupSection />

        <DebtMemberList
          debtMembers={summary.debtMembers}
          onSelectMember={(member) => setSelectedMember(member)}
        />

        <RecentInvoiceList
          invoices={summary.recentInvoices}
          onSelectInvoice={(invoice) => setSelectedInvoice(invoice)}
        />
      </main>

      <MemberDetailDrawer
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />

      <InvoiceDetailDrawer
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />

      <BottomNav />
    </div>
  );
};
