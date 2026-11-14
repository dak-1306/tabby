"use client";

import React from "react";
import { Receipt, ChevronRight } from "lucide-react";
import { Invoice } from "@/types";
import { GroupMember } from "@/types/group";
import { CURRENCY_SYMBOL, LOCALE_VI } from "@/constants";
import { getMemberShareInInvoice } from "../utils/groupSettlement";

interface GroupInvoiceListProps {
  invoices: Invoice[];
  members: GroupMember[];
  currentMemberId?: string;
  onSelectInvoice: (invoice: Invoice) => void;
}

export const GroupInvoiceList: React.FC<GroupInvoiceListProps> = ({
  invoices,
  members,
  currentMemberId,
  onSelectInvoice,
}) => {
  if (invoices.length === 0) {
    return (
      <div className="p-6 rounded-2xl border-2 border-dashed border-border/70 text-center space-y-2">
        <Receipt className="size-8 text-muted-foreground mx-auto" />
        <h3 className="text-sm font-bold">Chưa có hóa đơn nào trong nhóm</h3>
        <p className="text-xs text-muted-foreground">
          Bấm nút <strong>+ Thêm bill nhóm</strong> bên dưới để ghi lại khoản
          chi đầu tiên.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-2.5">
      <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
        Danh sách hóa đơn ({invoices.length})
      </h2>

      <div className="space-y-2">
        {invoices.map((inv) => {
          const totalAmount = inv.items.reduce((s, it) => s + it.price, 0);
          const payer = members.find((m) => m.id === inv.paidByMemberId);
          const myShare = currentMemberId
            ? getMemberShareInInvoice(inv, currentMemberId)
            : 0;

          return (
            <button
              key={inv.id}
              type="button"
              onClick={() => onSelectInvoice(inv)}
              className="w-full p-3.5 rounded-2xl bg-card border border-border/70 hover:border-primary/50 transition-all text-left flex items-center justify-between gap-2 active:scale-[0.99]"
            >
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-extrabold text-foreground truncate">
                  {inv.title}
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                  <span>
                    <strong className="text-foreground">
                      {payer?.id === currentMemberId
                        ? "Bạn"
                        : payer?.name || "Thành viên"}
                    </strong>{" "}
                    trả{" "}
                    <strong className="text-primary">
                      {totalAmount.toLocaleString(LOCALE_VI)} {CURRENCY_SYMBOL}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(inv.createdAt).toLocaleDateString(LOCALE_VI)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {currentMemberId && (
                  <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-muted/60 text-foreground">
                    {myShare > 0
                      ? `Bạn: ${myShare.toLocaleString(LOCALE_VI)}${CURRENCY_SYMBOL}`
                      : "Không ăn"}
                  </span>
                )}
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
