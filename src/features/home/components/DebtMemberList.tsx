"use client";

import React from "react";
import Link from "next/link";
import { MemberDebtSummary } from "@/types";
import { Card } from "@/components/ui/card";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { HOME_TEXTS } from "../constants";
import { CURRENCY_SYMBOL, LOCALE_VI, ROUTES } from "@/constants";

interface DebtMemberListProps {
  debtMembers: MemberDebtSummary[];
  onSelectMember?: (member: MemberDebtSummary) => void;
}

export const DebtMemberList: React.FC<DebtMemberListProps> = ({
  debtMembers,
  onSelectMember,
}) => {
  return (
    <section className="space-y-2.5">
      {/* Tiêu đề khối */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <span>{HOME_TEXTS.MEMBERS_SECTION_TITLE}</span>
          <span className="size-1.5 rounded-full bg-primary" />
        </h2>
        <Link
          href={ROUTES.LEDGER}
          className="text-xs text-primary font-semibold flex items-center hover:underline min-h-[44px] px-1"
        >
          {HOME_TEXTS.MEMBERS_LINK_LEDGER}{" "}
          <ArrowUpRight className="size-3.5 ml-0.5" />
        </Link>
      </div>

      {/* Grid 2 Cột tối ưu diện tích */}
      {debtMembers.length === 0 ? (
        <p className="text-xs text-muted-foreground p-3.5 text-center bg-card/60 rounded-xl border border-border/50">
          {HOME_TEXTS.MEMBERS_EMPTY}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {debtMembers.map((member) => (
            <Card
              key={member.memberId}
              clickable
              onClick={() => onSelectMember?.(member)}
              className="p-3 flex flex-col justify-between hover:border-primary/50 transition-all min-h-[88px] gap-2.5"
            >
              {/* Hàng 1: Avatar + Tên thành viên */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="size-8 rounded-full bg-primary/15 border border-primary/30 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  {member.memberAvatar}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-semibold text-foreground truncate leading-tight">
                    {member.memberName}
                  </h3>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                    {member.unpaidBillsCount} {HOME_TEXTS.MEMBERS_UNPAID_BILLS_SUFFIX}
                  </p>
                </div>
              </div>

              {/* Hàng 2: Số tiền + Mũi tên */}
              <div className="flex items-end justify-between pt-1.5 border-t border-border/40">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-primary leading-none truncate">
                    {member.totalOwed.toLocaleString(LOCALE_VI)} {CURRENCY_SYMBOL}
                  </div>
                  <span className="text-[9px] text-muted-foreground tracking-tight block mt-0.5">
                    {HOME_TEXTS.MEMBERS_ACTION_DEMAND}
                  </span>
                </div>
                <ChevronRight className="size-3.5 text-muted-foreground shrink-0 mb-0.5" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};