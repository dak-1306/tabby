"use client";

import React from "react";
import { LedgerMemberSummary } from "../types";
import { Card } from "@/components/ui/card";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { LEDGER_PAGE_TEXTS } from "../constants";
import { HOME_TEXTS } from "@/features/home/constants";
import { CURRENCY_SYMBOL, LOCALE_VI } from "@/constants";

interface LedgerGridProps {
  members: LedgerMemberSummary[];
  onSelectMember: (member: LedgerMemberSummary) => void;
}

export const LedgerGrid: React.FC<LedgerGridProps> = ({
  members,
  onSelectMember,
}) => {
  if (members.length === 0) {
    return (
      <p className="text-xs text-muted-foreground p-4 text-center bg-card/60 rounded-xl border border-border/50">
        {LEDGER_PAGE_TEXTS.EMPTY_SEARCH}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {members.map((member) => (
        <Card
          key={member.memberId}
          clickable={!member.isSettled}
          onClick={() => !member.isSettled && onSelectMember(member)}
          className="p-3 flex flex-col justify-between hover:border-primary/50 transition-all min-h-[88px] gap-2.5"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-8 rounded-full bg-primary/15 border border-primary/30 text-primary flex items-center justify-center font-bold text-xs shrink-0">
              {member.memberAvatar}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-semibold text-foreground truncate leading-tight">
                {member.memberName}
              </h3>
              <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                {member.isSettled
                  ? LEDGER_PAGE_TEXTS.SETTLED_STATUS_LABEL
                  : `${member.unpaidBillsCount} ${HOME_TEXTS.MEMBERS_UNPAID_BILLS_SUFFIX}`}
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between pt-1.5 border-t border-border/40">
            <div className="min-w-0">
              {member.isSettled ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                  <CheckCircle2 className="size-3" /> Đã trả hết
                </span>
              ) : (
                <>
                  <div className="text-xs font-bold text-primary leading-none truncate">
                    {member.totalOwed.toLocaleString(LOCALE_VI)}{" "}
                    {CURRENCY_SYMBOL}
                  </div>
                  <span className="text-[9px] text-muted-foreground tracking-tight block mt-0.5">
                    {HOME_TEXTS.MEMBERS_ACTION_DEMAND}
                  </span>
                </>
              )}
            </div>
            {!member.isSettled && (
              <ChevronRight className="size-3.5 text-muted-foreground shrink-0 mb-0.5" />
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
