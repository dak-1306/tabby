"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/contexts/DemoContext";

export const OnboardingModal: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const { startDemo } = useDemo();

  useEffect(() => {
    const hasSeen = localStorage.getItem("tabby_has_seen_onboarding");
    if (!hasSeen) {
      queueMicrotask(() => {
        setShowWelcome(true);
      });
    }
  }, []);

  const handleStart = () => {
    localStorage.setItem("tabby_has_seen_onboarding", "true");
    setShowWelcome(false);
    startDemo();
  };

  const handleSkip = () => {
    localStorage.setItem("tabby_has_seen_onboarding", "true");
    setShowWelcome(false);
  };

  if (!showWelcome) return null;

  return (
    <div className="fixed inset-0 z-[998] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-card border border-border/80 rounded-2xl p-5 shadow-2xl space-y-4 text-center relative overflow-hidden">
        <div className="size-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mx-auto">
          <Sparkles className="size-6 animate-pulse" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-foreground">
            Chào mừng bạn đến với Tabby!
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Tabby là một ứng dụng quản lý công nợ, giúp bạn theo dõi các khoản
            nợ và hóa đơn một cách dễ dàng. Bạn có thể bắt đầu bằng cách xem
            demo tự động hoặc bỏ qua và tự trải nghiệm.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Nếu bạn muốn đồng bộ dữ liệu với tài khoản Google của mình, hãy đăng
            nhập để lưu trữ dữ liệu trên đám mây.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Bạn cần lưu ý rằng nếu bạn không đăng nhập thì cần sử dụng app trên
            cùng 1 trình duyệt để dữ liệu được lưu trữ cục bộ. Nếu bạn xóa cache
            trình duyệt hoặc sử dụng trình duyệt khác, dữ liệu sẽ bị mất.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <Button
            size="lg"
            onClick={handleStart}
            className="w-full font-bold text-xs gap-2 min-h-[44px]"
          >
            <Play className="size-4 fill-current" />
            Xem hướng dẫn
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="w-full text-xs text-muted-foreground min-h-[40px]"
          >
            Bỏ qua, tôi tự trải nghiệm
          </Button>
        </div>
      </div>
    </div>
  );
};
