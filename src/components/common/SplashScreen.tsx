"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import logoSvg from "@/assets/icons/logo.svg";

interface SplashScreenProps {
  onFinish: () => void;
  forceVisible?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  forceVisible = false,
}) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (forceVisible) return;

    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1000);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 1400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish, forceVisible]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background flex flex-col items-center justify-between py-12 px-6 transition-opacity duration-400 ease-out select-none ${
        isFading && !forceVisible
          ? "opacity-0 pointer-events-none"
          : "opacity-100"
      }`}
    >
      {/* Vùng hiệu ứng ánh sáng nền phía sau Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 space-y-4">
        {/* Khung chứa Logo */}
        <div className="relative flex items-center justify-center p-4 bg-card/80 border border-border/80 rounded-3xl shadow-xl backdrop-blur-md animate-in zoom-in-95 duration-500">
          <Image
            src={logoSvg}
            alt="Tabby Logo"
            width={64}
            height={64}
            priority
            className="w-16 h-16 object-contain"
          />
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Tabby
          </h1>
          <p className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
            Chia tiền sòng phẳng & Tinh tế
          </p>
        </div>
      </div>

      {/* Thanh Loading nhỏ ở góc dưới */}
      <div className="relative z-10 w-24 h-1 bg-muted/60 rounded-full overflow-hidden">
        <div className="w-full h-full bg-primary rounded-full animate-in slide-in-from-left duration-1000" />
      </div>
    </div>
  );
};