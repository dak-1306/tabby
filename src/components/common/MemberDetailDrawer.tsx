"use client";

import React from "react";
import { MemberDebtSummary } from "@/types";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { InlineConfirmButton } from "@/components/common/InlineConfirmButton";
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
import {
  Copy,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Edit2,
  Check,
} from "lucide-react";
import { DRAWER_TEXTS, CURRENCY_SYMBOL, LOCALE_VI } from "@/constants";
import { useMemberDetailDrawer } from "@/hooks/useMemberDetailDrawer";
import { cn } from "@/utils/utils";

interface MemberDetailDrawerProps {
  member: MemberDebtSummary | null;
  onClose: () => void;
}

export const MemberDetailDrawer: React.FC<MemberDetailDrawerProps> = ({
  member,
  onClose,
}) => {
  const {
    unpaidInvoicesWithDetails,
    expandedBillIds,
    validSelectedBillIds,
    isPartialSelection,
    targetBillsCount,
    targetAmount,
    isEditingName,
    editName,
    setEditName,
    toggleExpand,
    toggleSelectBill,
    toggleSelectAllBills,
    handleStartEdit,
    handleSaveName,
    handleCopyText,
    handleClearDebt,
    handleDeleteMember,
  } = useMemberDetailDrawer(member, onClose);

  if (!member) return null;
  const hasDebt = member.totalOwed > 0 && unpaidInvoicesWithDetails.length > 0;
  const isAllSelected =
    unpaidInvoicesWithDetails.length > 0 &&
    validSelectedBillIds.length === unpaidInvoicesWithDetails.length;

  const clearButtonLabel = !hasDebt
    ? DRAWER_TEXTS.BTN_DEBT_CLEARED
    : isPartialSelection
      ? `${DRAWER_TEXTS.BTN_CLEAR_SELECTED_PREFIX} ${targetBillsCount} ${DRAWER_TEXTS.BTN_CLEAR_SELECTED_UNIT} (${targetAmount.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL})`
      : DRAWER_TEXTS.BTN_CLEAR_DEBT;

  return (
    <Drawer open={Boolean(member)} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center gap-3">
            <MemberAvatar
              name={
                isEditingName
                  ? editName || member.memberName
                  : member.memberName
              }
              fallbackText={member.memberAvatar}
              size="lg"
            />
            <div className="text-left flex-1 min-w-0">
              {isEditingName ? (
                <div className="flex items-center gap-1.5 my-0.5">
                  <input
                    type="text"
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                    className="text-sm font-bold bg-muted/60 border border-primary/50 rounded-lg px-2 py-1 text-foreground focus:outline-none w-full"
                  />
                  <button
                    type="button"
                    onClick={handleSaveName}
                    className="p-1.5 bg-primary text-primary-foreground rounded-lg font-bold shrink-0 hover:opacity-90 min-h-[36px] min-w-[36px] flex items-center justify-center"
                    aria-label={DRAWER_TEXTS.ARIA_SAVE_NAME}
                  >
                    <Check className="size-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <DrawerTitle className="text-base font-bold truncate">
                    {member.memberName}
                  </DrawerTitle>
                  <button
                    type="button"
                    onClick={handleStartEdit}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-md min-h-[32px] min-w-[32px] flex items-center justify-center"
                    aria-label={DRAWER_TEXTS.ARIA_EDIT_MEMBER_NAME}
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                </div>
              )}

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
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {DRAWER_TEXTS.UNPAID_INVOICES_TITLE}
            </p>
            {unpaidInvoicesWithDetails.length > 1 && (
              <button
                type="button"
                onClick={toggleSelectAllBills}
                className="text-[11px] font-bold text-primary hover:underline px-1.5 py-0.5 rounded-md"
              >
                {isAllSelected
                  ? DRAWER_TEXTS.DESELECT_ALL_BILLS
                  : DRAWER_TEXTS.SELECT_ALL_BILLS}
              </button>
            )}
          </div>

          {hasDebt ? (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-none">
              {unpaidInvoicesWithDetails.map((inv) => {
                const isExpanded = expandedBillIds.includes(inv.id);
                const isSelected = validSelectedBillIds.includes(inv.id);

                return (
                  <div
                    key={inv.id}
                    className={cn(
                      "rounded-xl bg-card border overflow-hidden text-xs transition-colors",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border/60",
                    )}
                  >
                    <div className="flex items-stretch">
                      {/* Vùng chạm Checkbox chọn bill gạch nợ từng phần */}
                      <button
                        type="button"
                        onClick={() => toggleSelectBill(inv.id)}
                        aria-label={`${DRAWER_TEXTS.ARIA_SELECT_BILL_PREFIX} ${inv.title}`}
                        className="pl-3 pr-2 flex items-center justify-center min-h-[48px] shrink-0 active:scale-95"
                      >
                        <span
                          className={cn(
                            "size-5 rounded-md border flex items-center justify-center transition-colors",
                            isSelected
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-muted-foreground/50 bg-background",
                          )}
                        >
                          {isSelected && (
                            <Check className="size-3.5 stroke-[3]" />
                          )}
                        </span>
                      </button>

                      {/* Vùng chạm mở rộng xem chi tiết món trong bill */}
                      <button
                        type="button"
                        onClick={() => toggleExpand(inv.id)}
                        className="flex-1 min-w-0 py-3 pr-3 pl-1 flex items-center justify-between text-left hover:bg-muted/20 transition-colors min-h-[48px]"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-foreground truncate">
                            {inv.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {new Date(inv.createdAt).toLocaleDateString(
                              LOCALE_VI,
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="font-bold text-primary text-xs">
                            {inv.amountOwedForBill.toLocaleString(LOCALE_VI)}{" "}
                            {CURRENCY_SYMBOL}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="size-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="size-4 text-muted-foreground" />
                          )}
                        </div>
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="px-3 pb-3 pt-1.5 border-t border-border/40 bg-muted/20 space-y-1.5">
                        {inv.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-[11px] text-muted-foreground gap-2"
                          >
                            <span className="font-medium text-foreground truncate">
                              • {item.name}
                            </span>
                            <span className="shrink-0 font-medium">
                              {item.totalPrice.toLocaleString(LOCALE_VI)}{" "}
                              {CURRENCY_SYMBOL}{" "}
                              <span className="text-[10px] text-muted-foreground/80">
                                (chia {item.splitCount} →{" "}
                                <strong className="text-foreground">
                                  {item.memberShare.toLocaleString(LOCALE_VI)}{" "}
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
          ) : (
            <div className="flex items-center justify-center gap-2 py-4 px-3 rounded-xl bg-muted/30 border border-border/50 text-xs font-semibold text-muted-foreground">
              <CheckCircle2 className="size-4 text-primary shrink-0" />
              <span>{DRAWER_TEXTS.NO_UNPAID_INVOICES}</span>
            </div>
          )}
        </div>

        <DrawerFooter className="flex-col gap-2 pt-3">
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button
              type="button"
              size="lg"
              disabled={!hasDebt}
              className="w-full gap-1.5 min-h-[44px] text-xs font-semibold"
              onClick={() => handleCopyText(true)}
            >
              <FileText className="size-4 shrink-0" />
              <span className="truncate">
                {DRAWER_TEXTS.BTN_COPY_DETAILED}
                {isPartialSelection ? ` (${targetBillsCount})` : ""}
              </span>
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              disabled={!hasDebt}
              className="w-full gap-1.5 min-h-[44px] text-xs font-semibold"
              onClick={() => handleCopyText(false)}
            >
              <Copy className="size-4 shrink-0" />
              <span className="truncate">
                {DRAWER_TEXTS.BTN_COPY_COMPACT}
                {isPartialSelection ? ` (${targetBillsCount})` : ""}
              </span>
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={!hasDebt}
            className="w-full gap-2 min-h-[44px] font-semibold"
            onClick={handleClearDebt}
          >
            <CheckCircle2 className="size-4 text-primary shrink-0" />
            <span className="truncate">{clearButtonLabel}</span>
          </Button>

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

          <DrawerClose
            render={
              <Button
                type="button"
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
