"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { MemberDebtSummary } from "@/types";
import { useAppStore } from "@/stores/useAppStore";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { InlineConfirmButton } from "@/components/common/InlineConfirmButton";
import {
  formatMemberDemandShareText,
  DetailedUnpaidBill,
} from "@/lib/shareFormatters";
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
import { Copy, CheckCircle2, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { DRAWER_TEXTS, TOAST_TEXTS, CURRENCY_SYMBOL, LOCALE_VI } from "@/constants";

interface MemberDetailDrawerProps {
  member: MemberDebtSummary | null;
  onClose: () => void;
}

export const MemberDetailDrawer: React.FC<MemberDetailDrawerProps> = ({
  member,
  onClose,
}) => {
  const [expandedBillIds, setExpandedBillIds] = useState<string[]>([]);
  const { invoices, currentUserId, members, clearMemberDebt, deleteMember } =
    useAppStore();

  if (!member) return null;

  const currentUser = members.find((m) => m.id === currentUserId);

  const unpaidInvoicesWithDetails: DetailedUnpaidBill[] = invoices
    .filter(
      (inv) =>
        inv.paidByMemberId === currentUserId &&
        inv.items.some((item) => item.assignedMemberIds.includes(member.memberId))
    )
    .map((inv) => {
      const memberItems = inv.items
        .filter((item) => item.assignedMemberIds.includes(member.memberId))
        .map((item) => ({
          name: item.name,
          totalPrice: item.price,
          splitCount: item.assignedMemberIds.length,
          memberShare: item.price / item.assignedMemberIds.length,
        }));

      const amountOwedForBill = memberItems.reduce(
        (sum, item) => sum + item.memberShare,
        0
      );

      return {
        id: inv.id,
        title: inv.title,
        createdAt: inv.createdAt,
        amountOwedForBill,
        items: memberItems,
      };
    });

  const toggleExpand = (billId: string) => {
    setExpandedBillIds((prev) =>
      prev.includes(billId)
        ? prev.filter((id) => id !== billId)
        : [...prev, billId]
    );
  };

  const handleCopyText = (isDetailed: boolean) => {
    const text = formatMemberDemandShareText(
      member,
      unpaidInvoicesWithDetails,
      currentUser,
      isDetailed
    );
    navigator.clipboard?.writeText(text);
    toast.success(TOAST_TEXTS.COPY_DEMAND_SUCCESS);
  };

  const handleClearDebt = () => {
    clearMemberDebt(member.memberId);
    toast.success(TOAST_TEXTS.CLEAR_DEBT_SUCCESS);
    onClose();
  };

  const handleDeleteMember = () => {
    deleteMember(member.memberId);
    toast.success(TOAST_TEXTS.DELETE_MEMBER_SUCCESS);
    onClose();
  };

  const hasDebt = member.totalOwed > 0;

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
              <DrawerTitle className="text-base font-bold">{member.memberName}</DrawerTitle>
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

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-none">
            {unpaidInvoicesWithDetails.map((inv) => {
              const isExpanded = expandedBillIds.includes(inv.id);
              return (
                <div
                  key={inv.id}
                  className="rounded-xl bg-card border border-border/60 overflow-hidden text-xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleExpand(inv.id)}
                    className="w-full p-3 flex items-center justify-between text-left hover:bg-muted/30 transition-colors min-h-[44px]"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{inv.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(inv.createdAt).toLocaleDateString(LOCALE_VI)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary text-xs">
                        {Math.round(inv.amountOwedForBill).toLocaleString(LOCALE_VI)}{" "}
                        {CURRENCY_SYMBOL}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="size-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="size-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Chi tiết từng món khi bấm mở rộng */}
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-1 border-t border-border/40 bg-muted/20 space-y-1.5">
                      {inv.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-[11px] text-muted-foreground"
                        >
                          <span className="font-medium text-foreground">
                            • {item.name}
                          </span>
                          <span className="shrink-0 font-medium">
                            {item.totalPrice.toLocaleString(LOCALE_VI)} {CURRENCY_SYMBOL}{" "}
                            <span className="text-[10px] text-muted-foreground/80">
                              (chia {item.splitCount} →{" "}
                              <strong className="text-foreground">
                                {Math.round(item.memberShare).toLocaleString(LOCALE_VI)}{" "}
                                {CURRENCY_SYMBOL}
                              </strong>
                              )
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <DrawerFooter className="flex-col gap-2 pt-3">
          {hasDebt && (
            <>
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button
                  size="lg"
                  className="w-full gap-1.5 min-h-[44px] text-xs font-semibold"
                  onClick={() => handleCopyText(true)}
                >
                  <FileText className="size-4" />
                  Copy Chi Tiết
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full gap-1.5 min-h-[44px] text-xs font-semibold"
                  onClick={() => handleCopyText(false)}
                >
                  <Copy className="size-4" />
                  Copy Tóm Tắt
                </Button>
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 min-h-[44px]"
                onClick={handleClearDebt}
              >
                <CheckCircle2 className="size-4 text-primary" />
                {DRAWER_TEXTS.BTN_CLEAR_DEBT}
              </Button>
            </>
          )}

          <InlineConfirmButton
            buttonText={DRAWER_TEXTS.BTN_DELETE_MEMBER}
            confirmTitle={DRAWER_TEXTS.DELETE_MEMBER_TITLE}
            confirmDesc={
              hasDebt
                ? DRAWER_TEXTS.MEMBER_HAS_DEBT_WARNING
                : DRAWER_TEXTS.DELETE_MEMBER_DESC
            }
            onConfirm={handleDeleteMember}
            disabled={hasDebt}
            variant="destructive"
          />

          <DrawerClose render={<Button variant="ghost" className="w-full min-h-[44px]" onClick={onClose} />}>
            {DRAWER_TEXTS.BTN_CLOSE}
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};