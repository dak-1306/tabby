"use client";

import React from "react";
import { cn } from "@/utils/utils";

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
    default:
      "bg-card border-border/60 text-foreground dark:bg-card-dark dark:border-border/50 dark:text-foreground",
    success:
      "bg-green-500/10 border-green-500/20 text-green-400 dark:bg-green-500/20 dark:border-green-500/30 dark:text-green-400",
    warning:
      "bg-yellow-500/10 border-yellow-500/20 text-yellow-500 dark:bg-yellow-500/20 dark:border-yellow-500/30 dark:text-yellow-400",
    primary:
      "bg-primary/10 border-primary/20 text-primary dark:bg-primary/20 dark:border-primary/30 dark:text-primary",
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
