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
  ChevronDown,
  ChevronUp,
  CheckCircle2,
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

  if (!pair) return null;

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleCopy = () => {
    const text = formatPairSettlementShareText(groupName, pair);
    navigator.clipboard.writeText(text);
    toast.success(GROUP_DETAIL_TEXTS.COPY_PAIR_SUCCESS);
  };

  const handleConfirmSettle = async () => {
    await onSettlePair(pair.fromMember.id, pair.toMember.id, pair.netAmount);
    toast.success(GROUP_DETAIL_TEXTS.SETTLE_SUCCESS);
    onClose();
  };

  return (
    <Drawer open={Boolean(pair)} onOpenChange={(open) => !open && onClose()}>
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
                Cần gửi cho
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
            Chi tiết bù trừ các hóa đơn giữa {pair.fromMember.name} và{" "}
            {pair.toMember.name}
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
                        ? "Giao dịch chốt nợ"
                        : isPositive
                          ? `${pair.toMember.name} trả hộ`
                          : `${pair.fromMember.name} trả hộ`}
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
                          {CURRENCY_SYMBOL} (chia {it.splitCount} →{" "}
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
          <Button
            type="button"
            size="lg"
            className="w-full gap-2 min-h-[44px] font-bold text-xs"
            onClick={handleCopy}
          >
            <Copy className="size-4" />
            Sao chép đối soát gửi Zalo
          </Button>

          <InlineConfirmButton
            buttonText={GROUP_DETAIL_TEXTS.BTN_SETTLE_PAIR}
            confirmTitle={GROUP_DETAIL_TEXTS.SETTLE_CONFIRM_TITLE}
            confirmDesc={GROUP_DETAIL_TEXTS.SETTLE_CONFIRM_DESC}
            onConfirm={handleConfirmSettle}
            variant="outline"
          />

          <DrawerClose
            render={
              <Button
                variant="ghost"
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
