"use client";

import React, { useState } from "react";
import { MemberDebtSummary } from "@/types";
import { useAppStore } from "@/stores/useAppStore";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Copy, Check, CheckCircle2 } from "lucide-react";
import { DRAWER_TEXTS, CURRENCY_SYMBOL, LOCALE_VI } from "@/constants";

interface MemberDetailDrawerProps {
  member: MemberDebtSummary | null;
  onClose: () => void;
}

export const MemberDetailDrawer: React.FC<MemberDetailDrawerProps> = ({
  member,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const { invoices, currentUserId, members, clearMemberDebt } = useAppStore();

  if (!member) return null;

  const currentUser = members.find((m) => m.id === currentUserId);

  const unpaidInvoicesWithAmount = invoices
    .filter(
      (inv) =>
        inv.paidByMemberId === currentUserId &&
        inv.items.some((item) =>
          item.assignedMemberIds.includes(member.memberId),
        ),
    )
    .map((inv) => {
      const amountOwedForBill = inv.items.reduce((sum, item) => {
        if (item.assignedMemberIds.includes(member.memberId)) {
          return sum + item.price / item.assignedMemberIds.length;
        }
        return sum;
      }, 0);

      return {
        ...inv,
        amountOwedForBill,
      };
    });

  const handleCopyText = () => {
    const billNames = unpaidInvoicesWithAmount.map((i) => i.title).join(", ");
    const bankInfo = currentUser?.accountNumber
      ? `\nSTK: ${currentUser.accountNumber} - ${currentUser.bankName || ""} (${currentUser.name})`
      : "";
    const text = `Alo ${member.memberName} ơi, chuyển giúp ${currentUser?.name || "mình"} ${member.totalOwed.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL} tiền (${billNames}) nha!${bankInfo}`;

    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearDebt = () => {
    clearMemberDebt(member.memberId);
    onClose();
  };

  return (
    <Drawer open={Boolean(member)} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center gap-3">
            <MemberAvatar
              name={member.memberName}
              fallbackText={member.memberAvatar}
              size="lg"
            />
            <div className="text-left">
              <DrawerTitle className="text-base font-bold">
                {member.memberName}
              </DrawerTitle>
              <DrawerDescription className="text-xs text-muted-foreground mt-0.5">
                {DRAWER_TEXTS.TOTAL_OWED_LABEL}{" "}
                <span className="font-bold text-primary">
                  {member.totalOwed.toLocaleString(LOCALE_VI)} {CURRENCY_SYMBOL}
                </span>
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <div className="px-4 py-2 space-y-2.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {DRAWER_TEXTS.UNPAID_INVOICES_TITLE}
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {unpaidInvoicesWithAmount.map((inv) => (
              <div
                key={inv.id}
                className="p-3 rounded-xl bg-card border border-border/60 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-foreground">{inv.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {new Date(inv.createdAt).toLocaleDateString(LOCALE_VI)}
                  </p>
                </div>
                <span className="font-bold text-primary text-xs shrink-0">
                  {inv.amountOwedForBill.toLocaleString(LOCALE_VI)}{" "}
                  {CURRENCY_SYMBOL}
                </span>
              </div>
            ))}
          </div>
        </div>

        <DrawerFooter className="flex-col gap-2 pt-3">
          <Button
            size="lg"
            className="w-full gap-2 min-h-[44px]"
            onClick={handleCopyText}
          >
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
            {copied ? DRAWER_TEXTS.BTN_COPIED : DRAWER_TEXTS.BTN_COPY_DEMAND}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full gap-2 min-h-[44px]"
            onClick={handleClearDebt}
          >
            <CheckCircle2 className="size-4 text-primary" />
            {DRAWER_TEXTS.BTN_CLEAR_DEBT}
          </Button>

          <DrawerClose
            render={
              <Button
                variant="ghost"
                className="w-full min-h-[44px]"
                onClick={onClose}
              />
            }
          >
            {DRAWER_TEXTS.BTN_CLOSE}
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
