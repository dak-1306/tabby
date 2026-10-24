"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, UserCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Trang tạo mới có Header dạng Form hành động
  if (pathname === "/create") {
    return (
      <header className="shrink-0 h-14 px-4 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.back()}
          aria-label="Quay lại"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-sm font-semibold text-foreground tracking-tight">
          Tạo hóa đơn mới
        </h1>
        <div className="size-8" /> {/* Placeholder giữ cân bằng */}
      </header>
    );
  }

  // Trang Sổ nợ
  if (pathname === "/ledger") {
    return (
      <header className="shrink-0 h-14 px-4 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <UserCheck2 className="size-5 text-primary" />
          <h1 className="text-base font-semibold text-foreground tracking-tight">
            Sổ nợ thành viên
          </h1>
        </div>
      </header>
    );
  }

  // Trang Chia sẻ / Xuất
  if (pathname === "/share") {
    return (
      <header className="shrink-0 h-14 px-4 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <h1 className="text-base font-semibold text-foreground tracking-tight">
            Chia sẻ & Xuất nợ
          </h1>
        </div>
      </header>
    );
  }

  // Header Mặc định cho Trang chủ (Đã bỏ nút Tạo bill)
  return (
    <header className="shrink-0 h-16 px-4 border-b border-border/40 bg-background/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-2.5">
        <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-base shadow-xs">
          T
        </div>
        <div>
          <h1 className="text-base font-bold text-foreground leading-none tracking-tight">
            Tabby
          </h1>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
            Chia tiền sòng phẳng
          </p>
        </div>
      </div>
    </header>
  );
};
