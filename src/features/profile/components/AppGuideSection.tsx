"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Play } from "lucide-react";
import { useDemo } from "@/contexts/DemoContext";

export const AppGuideSection: React.FC = () => {
  const { startDemo } = useDemo();

  return (
    <Card className="p-4 bg-card border border-border/70 space-y-3 shadow-xs rounded-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground">
              Hướng dẫn sử dụng
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Xem lại các bước hướng dẫn sử dụng ứng dụng.
            </p>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={startDemo}
        className="w-full text-xs font-bold gap-2 min-h-[40px] border-primary/40 text-primary hover:bg-primary/10 transition-colors"
      >
        <Play className="size-3.5 fill-current" />
        Xem lại hướng dẫn
      </Button>
    </Card>
  );
};
