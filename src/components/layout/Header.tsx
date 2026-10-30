"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { HEADER_TITLES, ROUTES } from "@/constants";
import { ArrowLeft, Settings } from "lucide-react";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const currentHeader = HEADER_TITLES[pathname] || HEADER_TITLES[ROUTES.HOME];

  const hasBackButton =
    pathname === ROUTES.CREATE || pathname === ROUTES.PROFILE;

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/60 px-4 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        {hasBackButton ? (
          <button
            type="button"
            onClick={() => router.back()}
            className="size-9 rounded-full flex items-center justify-center hover:bg-muted/80 text-foreground transition-colors shrink-0 -ml-1.5 min-h-[44px] min-w-[44px]"
            aria-label="Quay lại"
          >
            <ArrowLeft className="size-5" />
          </button>
        ) : (
          <div className="size-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 p-1.5">
            <Image
              src="/icons/logo.svg"
              alt="Tabby Logo"
              width={24}
              height={24}
              className="size-6 object-contain"
              priority
            />
          </div>
        )}

        <div className="flex flex-col">
          <h1 className="text-base font-bold tracking-tight text-foreground leading-tight">
            {currentHeader.title}
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium">
            {currentHeader.subtitle}
          </p>
        </div>
      </div>

      {/* Lối vào trang Cài đặt từ Trang chủ / Hóa đơn / Sổ nợ */}
      {!hasBackButton && (
        <Link
          href={ROUTES.PROFILE}
          className="size-9 rounded-full flex items-center justify-center bg-card border border-border/60 text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px]"
          aria-label="Cài đặt"
        >
          <Settings className="size-4" />
        </Link>
      )}
    </header>
  );
};
