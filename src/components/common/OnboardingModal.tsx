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
            Chào mừng bạn đến với Tabby! 👋
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Xem trải nghiệm tự động từ **Tạo bill siêu tốc** đến **Xem phần làm
            tròn tiền** trong 25 giây.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <Button
            size="lg"
            onClick={handleStart}
            className="w-full font-bold text-xs gap-2 min-h-[44px]"
          >
            <Play className="size-4 fill-current" />
            Xem Demo tự động (25s)
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
