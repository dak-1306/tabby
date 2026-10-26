import { useState, useMemo } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { InvoiceFilterTab, InvoicesStatsData } from "../types";
import { FormattedRecentInvoice } from "@/features/home/types";
import { INVOICE_STATUS, LOCALE_VI } from "@/constants";

export const useInvoicesFilter = () => {
  const { invoices, currentUserId } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<InvoiceFilterTab>("all");

  const formattedInvoices = useMemo<FormattedRecentInvoice[]>(() => {
    return invoices.map((inv) => {
      let totalAmount = 0;
      let myReceivable = 0;

      inv.items.forEach((item) => {
        totalAmount += item.price;
        if (item.assignedMemberIds.length === 0) return;

        const share = item.price / item.assignedMemberIds.length;
        if (inv.paidByMemberId === currentUserId) {
          item.assignedMemberIds.forEach((mId) => {
            if (mId !== currentUserId) myReceivable += share;
          });
        }
      });

      const collectedAmount =
        inv.status === INVOICE_STATUS.COMPLETED
          ? totalAmount
          : Math.max(0, totalAmount - myReceivable);

      return {
        id: inv.id,
        title: inv.title,
        date: new Date(inv.createdAt).toLocaleDateString(LOCALE_VI),
        totalAmount,
        collectedAmount,
        uncollectedAmount:
          inv.status === INVOICE_STATUS.COMPLETED ? 0 : myReceivable,
        status: inv.status,
      };
    });
  }, [invoices, currentUserId]);

  const filteredInvoices = useMemo(() => {
    return formattedInvoices.filter((inv) => {
      const matchesSearch = inv.title
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());
      const matchesTab = activeTab === "all" ? true : inv.status === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [formattedInvoices, searchQuery, activeTab]);

  const stats = useMemo<InvoicesStatsData>(() => {
    let totalAmount = 0;
    let collectedAmount = 0;
    let completedCount = 0;
    let partialCount = 0;

    formattedInvoices.forEach((inv) => {
      totalAmount += inv.totalAmount;
      collectedAmount += inv.collectedAmount;
      if (inv.status === INVOICE_STATUS.COMPLETED) {
        completedCount++;
      } else {
        partialCount++;
      }
    });

    return {
      totalCount: formattedInvoices.length,
      completedCount,
      partialCount,
      totalAmount,
      collectedAmount,
    };
  }, [formattedInvoices]);

  return {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    filteredInvoices,
    stats,
  };
};
