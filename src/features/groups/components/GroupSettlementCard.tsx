"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Scale, ChevronRight } from "lucide-react";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { CURRENCY_SYMBOL, GROUP_DETAIL_TEXTS, LOCALE_VI } from "@/constants";
import { PairwiseDebt } from "../utils/groupSettlement";
import { cn } from "@/utils/utils";

interface GroupSettlementCardProps {
  pairwiseDebts: PairwiseDebt[];
  currentMemberId?: string;
  onSelectPair: (pair: PairwiseDebt) => void;
}

export const GroupSettlementCard: React.FC<GroupSettlementCardProps> = ({
  pairwiseDebts,
  currentMemberId,
  onSelectPair,
}) => {
  const [viewMode, setViewMode] = useState<"mine" | "all">("mine");

  const myDebts = currentMemberId
    ? pairwiseDebts.filter(
        (p) =>
          p.fromMember.id === currentMemberId ||
          p.toMember.id === currentMemberId,
      )
    : pairwiseDebts;

  const displayedList = viewMode === "mine" ? myDebts : pairwiseDebts;

  const totalToReceive = currentMemberId
    ? myDebts
        .filter((p) => p.toMember.id === currentMemberId)
        .reduce((s, p) => s + p.netAmount, 0)
    : 0;

  const totalToPay = currentMemberId
    ? myDebts
        .filter((p) => p.fromMember.id === currentMemberId)
        .reduce((s, p) => s + p.netAmount, 0)
    : 0;

  return (
    <section className="p-4 rounded-2xl bg-card border border-border/70 border-l-4 border-l-primary shadow-xs space-y-3">
      {/* Header + Switch Của tôi / Cả nhóm */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Scale className="size-4 text-primary" />
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
            {GROUP_DETAIL_TEXTS.SETTLEMENT_BOARD_TITLE}
          </h2>
        </div>

        <div className="inline-flex p-0.5 rounded-xl bg-muted border border-border/50">
          <button
            type="button"
            onClick={() => setViewMode("mine")}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all",
              viewMode === "mine"
                ? "bg-background text-primary shadow-2xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {GROUP_DETAIL_TEXTS.TAB_MY_BALANCE}
          </button>
          <button
            type="button"
            onClick={() => setViewMode("all")}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all",
              viewMode === "all"
                ? "bg-background text-primary shadow-2xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {GROUP_DETAIL_TEXTS.TAB_ALL_DEBTS}
          </button>
        </div>
      </div>

      {/* Tóm tắt nhanh khi ở tab "Của tôi" */}
      {viewMode === "mine" && currentMemberId && (
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block">
              {GROUP_DETAIL_TEXTS.MY_RECEIVE_LABEL}
            </span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              +{totalToReceive.toLocaleString(LOCALE_VI)} {CURRENCY_SYMBOL}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 block">
              {GROUP_DETAIL_TEXTS.MY_PAY_LABEL}
            </span>
            <span className="text-sm font-black text-rose-600 dark:text-rose-400">
              -{totalToPay.toLocaleString(LOCALE_VI)} {CURRENCY_SYMBOL}
            </span>
          </div>
        </div>
      )}

      {/* Danh sách các cặp cần thanh toán */}
      {displayedList.length > 0 ? (
        <div className="space-y-2">
          {displayedList.map((pair) => {
            const isOwedToMe = pair.toMember.id === currentMemberId;
            const iOweThem = pair.fromMember.id === currentMemberId;

            return (
              <button
                key={pair.pairKey}
                type="button"
                onClick={() => onSelectPair(pair)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-muted/35 hover:bg-muted/60 border border-border/50 transition-all text-left min-h-[48px] active:scale-[0.99]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MemberAvatar
                    name={pair.fromMember.name}
                    fallbackText={pair.fromMember.avatar}
                    size="xs"
                  />
                  <span className="text-xs font-bold truncate max-w-[72px]">
                    {iOweThem
                      ? GROUP_DETAIL_TEXTS.SELF_LABEL
                      : pair.fromMember.name}
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground shrink-0" />
                  <MemberAvatar
                    name={pair.toMember.name}
                    fallbackText={pair.toMember.avatar}
                    size="xs"
                  />
                  <span className="text-xs font-bold truncate max-w-[72px]">
                    {isOwedToMe
                      ? GROUP_DETAIL_TEXTS.SELF_LABEL
                      : pair.toMember.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={cn(
                      "text-xs font-black",
                      isOwedToMe
                        ? "text-emerald-600 dark:text-emerald-400"
                        : iOweThem
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-primary",
                    )}
                  >
                    {pair.netAmount.toLocaleString(LOCALE_VI)} {CURRENCY_SYMBOL}
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 py-3 text-xs font-semibold text-muted-foreground bg-muted/25 rounded-xl">
          <CheckCircle2 className="size-4 text-primary" />
          <span>
            {viewMode === "mine"
              ? GROUP_DETAIL_TEXTS.EMPTY_MY_DEBTS
              : GROUP_DETAIL_TEXTS.EMPTY_ALL_DEBTS}
          </span>
        </div>
      )}
    </section>
  );
};
