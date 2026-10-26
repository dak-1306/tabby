"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  variant?: "default" | "success" | "warning" | "primary";
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  variant = "default",
}) => {
  const variantStyles = {
    default: "bg-card/80 border-border/50 text-foreground",
    success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    warning: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    primary: "bg-primary/10 border-primary/20 text-primary",
  };

  return (
    <div
      className={cn(
        "p-2.5 rounded-xl border min-h-[44px] flex flex-col justify-center text-center",
        variantStyles[variant],
      )}
    >
      <span className="text-[10px] text-muted-foreground tracking-tight block truncate">
        {label}
      </span>
      <span className="font-bold text-xs mt-0.5 block truncate">{value}</span>
    </div>
  );
};
