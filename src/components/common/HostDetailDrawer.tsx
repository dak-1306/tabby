"use client";

import React from "react";
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
import { Copy, ChevronDown, ChevronUp } from "lucide-react";
import { CURRENCY_SYMBOL, LOCALE_VI } from "@/constants";
import { useHostDetailDrawer } from "@/hooks/useHostDetailDrawer";

interface HostDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HostDetailDrawer: React.FC<HostDetailDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    hostName,
    currentUser,
    hostUnpaidBills,
    totalHostExpense,
    expandedBillIds,
    toggleExpand,
    handleCopySummary,
  } = useHostDetailDrawer();

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center gap-3">
            <MemberAvatar
              name={hostName}
              fallbackText={currentUser?.avatar || "H"}
              size="lg"
            />
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <DrawerTitle className="text-base font-bold truncate">
                  {hostName}
                </DrawerTitle>
                <span className="text-[10px] bg-primary/15 text-primary font-bold px-2 py-0.5 rounded-full">
                  Host
                </span>
              </div>
              <DrawerDescription className="text-xs text-muted-foreground mt-0.5">
                Chi tiêu cá nhân:{" "}
                <span className="font-bold text-primary">
                  {totalHostExpense.toLocaleString(LOCALE_VI)} {CURRENCY_SYMBOL}
                </span>
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <div className="px-4 py-2 space-y-2.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Các bill bạn có phần tham gia ({hostUnpaidBills.length})
          </p>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-none">
            {hostUnpaidBills.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                Bạn chưa tham gia món nào trong các hóa đơn hiện tại.
              </p>
            ) : (
              hostUnpaidBills.map((inv) => {
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
                        <p className="font-semibold text-foreground">
                          {inv.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(inv.createdAt).toLocaleDateString(LOCALE_VI)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
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
                              {item.totalPrice.toLocaleString(LOCALE_VI)}{" "}
                              {CURRENCY_SYMBOL}{" "}
                              <span className="text-[10px] text-muted-foreground/80">
                                (chia {item.splitCount} →{" "}
                                <strong className="text-primary">
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
              })
            )}
          </div>
        </div>

        <DrawerFooter className="flex-col gap-2 pt-3">
          {hostUnpaidBills.length > 0 && (
            <Button
              size="lg"
              className="w-full gap-2 min-h-[44px] text-xs font-semibold"
              onClick={handleCopySummary}
            >
              <Copy className="size-4" />
              Sao Chép Chi Tiêu Cá Nhân
            </Button>
          )}

          <DrawerClose
            render={
              <Button
                variant="ghost"
                className="w-full min-h-[44px]"
                onClick={onClose}
              >
                Đóng
              </Button>
            }
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};