"use client";

import React, { useMemo } from "react";
import { cn } from "@/utils/utils";

interface MemberAvatarProps {
  name: string;
  fallbackText?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const COLOR_PALETTES = [
  "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "bg-rose-500/15 text-rose-400 border-rose-500/30",
  "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
];

export const MemberAvatar: React.FC<MemberAvatarProps> = ({
  name,
  fallbackText,
  size = "md",
  className,
}) => {
  const displayChar = useMemo(() => {
    if (fallbackText?.trim()) return fallbackText.trim().slice(0, 2);
    const words = name.trim().split(" ");
    return words[words.length - 1]?.[0]?.toUpperCase() || "?";
  }, [name, fallbackText]);

  const colorClass = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % COLOR_PALETTES.length;
    return COLOR_PALETTES[index];
  }, [name]);

  const sizeClasses = {
    xs: "size-6 text-[10px]",
    sm: "size-8 text-xs",
    md: "size-9 text-xs",
    lg: "size-11 text-sm",
  };

  return (
    <div
      className={cn(
        "rounded-full border font-bold flex items-center justify-center shrink-0 select-none",
        sizeClasses[size],
        colorClass,
        className,
      )}
    >
      {displayChar}
    </div>
  );
};
