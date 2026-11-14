"use client";

import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Cloud, CloudCheck, CloudOff, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCloudSyncStatus } from "@/components/providers/CloudSyncProvider";

export const GoogleSyncCard: React.FC = () => {
  const { data: session, status } = useSession();
  const syncStatus = useCloudSyncStatus();

  if (status === "loading") {
    return (
      <div className="p-4 rounded-2xl bg-card border border-border/70 text-xs text-muted-foreground">
        Đang kiểm tra trạng thái đồng bộ...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-3">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <Cloud className="size-5" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-sm font-extrabold">
              Sao lưu & Đồng bộ đám mây
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Đăng nhập Google để lưu vĩnh viễn hóa đơn cá nhân và đồng bộ giữa
              điện thoại với máy tính.
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => signIn("google")}
          className="w-full min-h-[44px] font-bold text-xs gap-2"
        >
          Tiếp tục với Google
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-extrabold truncate">{session.user.name}</p>
          <p className="text-[11px] text-muted-foreground truncate">
            {session.user.email}
          </p>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary shrink-0">
          {syncStatus === "syncing" && (
            <>
              <RefreshCw className="size-3 animate-spin" />
              Đang lưu...
            </>
          )}
          {syncStatus === "synced" && (
            <>
              <CloudCheck className="size-3.5" />
              Đã đồng bộ
            </>
          )}
          {syncStatus === "error" && (
            <>
              <CloudOff className="size-3.5 text-destructive" />
              Lỗi mạng
            </>
          )}
          {syncStatus === "idle" && (
            <>
              <Cloud className="size-3.5" />
              Sẵn sàng
            </>
          )}
        </span>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => signOut()}
        className="w-full min-h-[40px] text-xs font-bold gap-1.5"
      >
        <LogOut className="size-3.5" />
        Đăng xuất tài khoản Google
      </Button>
    </div>
  );
};
