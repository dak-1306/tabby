"use client";

import React, { useEffect, useState } from "react";
import { Receipt } from "lucide-react";

export const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(onFinish, 300);
    }, 1100);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center transition-opacity duration-300 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-sm animate-pulse mb-3">
        <Receipt className="size-8" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Tabby
      </h1>
      <p className="text-xs text-muted-foreground mt-1 font-medium tracking-wide">
        Chia tiền sòng phẳng & Tinh tế
      </p>
    </div>
  );
};
