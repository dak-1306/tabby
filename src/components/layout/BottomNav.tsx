"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, Users, Plus, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  if (pathname === ROUTES.CREATE) {
    return null;
  }

  const isInvoicePage = pathname === ROUTES.INVOICES;
  const leftNavItem = isInvoicePage
    ? {
        href: ROUTES.HOME,
        label: "Trang chủ",
        icon: Home,
        active: pathname === ROUTES.HOME,
      }
    : {
        href: ROUTES.INVOICES,
        label: "Hóa đơn",
        icon: History,
        active: pathname === ROUTES.INVOICES,
      };

  const isLedger = pathname === ROUTES.LEDGER;

  return (
    <nav className="absolute bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-md border-t border-border/60 px-6 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between relative max-w-xs mx-auto">
        {/* Tab Trái (Hóa đơn <-> Trang chủ) */}
        <Link
          href={leftNavItem.href}
          className={cn(
            "flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] rounded-xl transition-all duration-150 active:scale-95",
            leftNavItem.active
              ? "text-primary font-semibold"
              : "text-muted-foreground hover:text-foreground font-medium",
          )}
        >
          <leftNavItem.icon
            className={cn(
              "size-5 transition-transform",
              leftNavItem.active && "scale-110",
            )}
          />
          <span className="text-[10px] tracking-tight">
            {leftNavItem.label}
          </span>
        </Link>

        {/* Nút Giữa Nổi Bật - Tạo Hóa Đơn */}
        <div className="relative flex items-center justify-center -translate-y-4">
          <Link
            href={ROUTES.CREATE}
            className="flex items-center justify-center size-12 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-all duration-150 active:scale-90 border-4 border-background"
            aria-label="Tạo hóa đơn mới"
          >
            <Plus className="size-6 stroke-[2.5]" />
          </Link>
        </div>

        {/* Tab Phải - Sổ nợ */}
        <Link
          href={ROUTES.LEDGER}
          className={cn(
            "flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] rounded-xl transition-all duration-150 active:scale-95",
            isLedger
              ? "text-primary font-semibold"
              : "text-muted-foreground hover:text-foreground font-medium",
          )}
        >
          <Users
            className={cn(
              "size-5 transition-transform",
              isLedger && "scale-110",
            )}
          />
          <span className="text-[10px] tracking-tight">Sổ nợ</span>
        </Link>
      </div>
    </nav>
  );
};
