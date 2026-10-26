"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Receipt, Plus, Users } from "lucide-react";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  // Không hiển thị BottomNav tại trang Tạo hóa đơn (đã có thanh Submit cố định sát đáy)
  if (pathname === ROUTES.CREATE) return null;

  const isHome = pathname === ROUTES.HOME;
  const isInvoices = pathname === ROUTES.INVOICES;
  const isLedger = pathname === ROUTES.LEDGER;

  // Cấu hình linh động Nút Trái & Nút Phải theo từng tuyến đường
  const leftTab = isHome
    ? { href: ROUTES.INVOICES, label: "Hóa đơn", icon: Receipt }
    : { href: ROUTES.HOME, label: "Trang chủ", icon: Home };

  const rightTab = isLedger
    ? { href: ROUTES.INVOICES, label: "Hóa đơn", icon: Receipt }
    : { href: ROUTES.LEDGER, label: "Sổ nợ", icon: Users };

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-background/95 backdrop-blur-md border-t border-border/60 z-30 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2">
        {/* Nút bên trái: Chuyển thành "Trang chủ" khi ở /invoices hoặc /ledger */}
        <Link
          href={leftTab.href}
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full min-h-[44px] gap-1 transition-colors text-xs font-medium",
            isInvoices && isHome
              ? "text-primary font-bold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <leftTab.icon className="size-5" />
          <span>{leftTab.label}</span>
        </Link>

        {/* Nút Nổi Ở Giữa: Tạo Hóa Đơn */}
        <Link
          href={ROUTES.CREATE}
          className="flex flex-col items-center justify-center px-3 -mt-5"
          aria-label="Tạo hóa đơn"
        >
          <div className="size-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform min-h-[44px] min-w-[44px]">
            <Plus className="size-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-semibold text-primary mt-1">
            Tạo bill
          </span>
        </Link>

        {/* Nút bên phải: Chuyển giữa Sổ nợ & Hóa đơn linh hoạt */}
        <Link
          href={rightTab.href}
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full min-h-[44px] gap-1 transition-colors text-xs font-medium",
            isLedger
              ? "text-primary font-bold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <rightTab.icon className="size-5" />
          <span>{rightTab.label}</span>
        </Link>
      </div>
    </nav>
  );
};