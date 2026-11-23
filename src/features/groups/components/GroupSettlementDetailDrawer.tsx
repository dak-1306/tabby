"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { InlineConfirmButton } from "@/components/common/InlineConfirmButton";
import {
  ArrowRight,
  Copy,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  CURRENCY_SYMBOL,
  DRAWER_TEXTS,
  GROUP_DETAIL_TEXTS,
  LOCALE_VI,
} from "@/constants";
import {
  PairwiseDebt,
  formatPairSettlementShareText,
} from "../utils/groupSettlement";
import { cn } from "@/utils/utils";

interface GroupSettlementDetailDrawerProps {
  groupName: string;
  pair: PairwiseDebt | null;
  onClose: () => void;
  onSettlePair: (
    fromMemberId: string,
    toMemberId: string,
    amount: number,
  ) => Promise<void>;
}

export const GroupSettlementDetailDrawer: React.FC<
  GroupSettlementDetailDrawerProps
> = ({ groupName, pair, onClose, onSettlePair }) => {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [isSettling, setIsSettling] = useState(false);

  if (!pair) return null;

  const isSettled = pair.netAmount <= 0;
  const isSettleDisabled = isSettled || isSettling;

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleCopy = (isDetailed: boolean) => {
    const text = formatPairSettlementShareText(groupName, pair, isDetailed);
    navigator.clipboard.writeText(text);
    toast.success(GROUP_DETAIL_TEXTS.COPY_PAIR_SUCCESS);
  };

  const handleConfirmSettle = async () => {
    if (isSettleDisabled) return;
    setIsSettling(true);
    try {
      await onSettlePair(pair.fromMember.id, pair.toMember.id, pair.netAmount);
      toast.success(GROUP_DETAIL_TEXTS.SETTLE_SUCCESS);
      onClose();
    } finally {
      setIsSettling(false);
    }
  };

  const settleButtonLabel = isSettling
    ? GROUP_DETAIL_TEXTS.BTN_SETTLING_PAIR
    : isSettled
      ? GROUP_DETAIL_TEXTS.BTN_PAIR_SETTLED
      : GROUP_DETAIL_TEXTS.BTN_SETTLE_PAIR;

  return (
    <Drawer
      open={Boolean(pair)}
      onOpenChange={(open) => {
        if (!open && !isSettling) onClose();
      }}
    >
      <DrawerContent className="max-h-[88dvh] flex flex-col">
        <DrawerHeader>
          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="flex flex-col items-center gap-1">
              <MemberAvatar
                name={pair.fromMember.name}
                fallbackText={pair.fromMember.avatar}
                size="lg"
              />
              <span className="text-xs font-extrabold">
                {pair.fromMember.name}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1 px-2">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">
                {GROUP_DETAIL_TEXTS.NEED_TO_SEND_LABEL}
              </span>
              <ArrowRight className="size-5 text-primary" />
            </div>

            <div className="flex flex-col items-center gap-1">
              <MemberAvatar
                name={pair.toMember.name}
                fallbackText={pair.toMember.avatar}
                size="lg"
              />
              <span className="text-xs font-extrabold">
                {pair.toMember.name}
              </span>
            </div>
          </div>

          <DrawerTitle className="text-center text-xl font-black text-primary pt-2">
            {pair.netAmount.toLocaleString(LOCALE_VI)} {CURRENCY_SYMBOL}
          </DrawerTitle>
          <DrawerDescription className="text-center text-xs">
            {GROUP_DETAIL_TEXTS.PAIR_DETAIL_DESC_PREFIX} {pair.fromMember.name}{" "}
            {GROUP_DETAIL_TEXTS.PAIR_DETAIL_DESC_AND} {pair.toMember.name}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 py-2 overflow-y-auto space-y-2 max-h-60 scrollbar-none">
          {pair.entries.map((entry) => {
            const isPositive = entry.fromMemberId === pair.fromMember.id;
            const isExpanded = expandedIds.includes(entry.id);
            const hasItems = entry.items && entry.items.length > 0;

            return (
              <div
                key={entry.id}
                className="rounded-xl bg-card border border-border/60 overflow-hidden text-xs"
              >
                <button
                  type="button"
                  disabled={!hasItems}
                  onClick={() => hasItems && toggleExpand(entry.id)}
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-muted/30 transition-colors min-h-[44px]"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-foreground truncate">
                      {entry.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(entry.date).toLocaleDateString(LOCALE_VI)} •{" "}
                      {entry.type === "settlement"
                        ? GROUP_DETAIL_TEXTS.SETTLEMENT_TX_LABEL
                        : isPositive
                          ? `${pair.toMember.name} ${GROUP_DETAIL_TEXTS.PAID_FOR_SUFFIX}`
                          : `${pair.fromMember.name} ${GROUP_DETAIL_TEXTS.PAID_FOR_SUFFIX}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={cn(
                        "font-bold",
                        entry.type === "settlement"
                          ? "text-muted-foreground"
                          : isPositive
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-emerald-600 dark:text-emerald-400",
                      )}
                    >
                      {entry.type === "settlement"
                        ? "-"
                        : isPositive
                          ? "+"
                          : "-"}
                      {entry.amount.toLocaleString(LOCALE_VI)} {CURRENCY_SYMBOL}
                    </span>
                    {hasItems &&
                      (isExpanded ? (
                        <ChevronUp className="size-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="size-4 text-muted-foreground" />
                      ))}
                  </div>
                </button>

                {isExpanded && entry.items && (
                  <div className="px-3 pb-3 pt-1.5 border-t border-border/40 bg-muted/20 space-y-1">
                    {entry.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-[11px] text-muted-foreground"
                      >
                        <span className="font-medium text-foreground">
                          • {it.name}
                        </span>
                        <span>
                          {it.totalPrice.toLocaleString(LOCALE_VI)}{" "}
                          {CURRENCY_SYMBOL}{" "}
                          {GROUP_DETAIL_TEXTS.SPLIT_COUNT_PREFIX}{" "}
                          {it.splitCount} {GROUP_DETAIL_TEXTS.SPLIT_ARROW}{" "}
                          <strong className="text-foreground">
                            {it.memberShare.toLocaleString(LOCALE_VI)}{" "}
                            {CURRENCY_SYMBOL}
                          </strong>
                          )
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <DrawerFooter className="flex-col gap-2 pt-3">
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button
              type="button"
              size="lg"
              disabled={isSettleDisabled}
              className="w-full gap-1.5 min-h-[44px] text-xs font-bold"
              onClick={() => handleCopy(true)}
            >
              <FileText className="size-4" />
              {DRAWER_TEXTS.BTN_COPY_DETAILED}
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              disabled={isSettleDisabled}
              className="w-full gap-1.5 min-h-[44px] text-xs font-bold"
              onClick={() => handleCopy(false)}
            >
              <Copy className="size-4" />
              {DRAWER_TEXTS.BTN_COPY_COMPACT}
            </Button>
          </div>

          <InlineConfirmButton
            buttonText={settleButtonLabel}
            confirmTitle={GROUP_DETAIL_TEXTS.SETTLE_CONFIRM_TITLE}
            confirmDesc={GROUP_DETAIL_TEXTS.SETTLE_CONFIRM_DESC}
            onConfirm={handleConfirmSettle}
            disabled={isSettleDisabled}
            variant="outline"
          />

          <DrawerClose
            render={
              <Button
                type="button"
                variant="ghost"
                disabled={isSettling}
                className="w-full min-h-[44px]"
                onClick={onClose}
              >
                {DRAWER_TEXTS.BTN_CLOSE}
              </Button>
            }
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
