"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InlineConfirmButtonProps {
  buttonText: string;
  confirmTitle: string;
  confirmDesc?: string;
  onConfirm: () => void;
  variant?: "destructive" | "outline" | "ghost";
  className?: string;
  disabled?: boolean;
}

export const InlineConfirmButton: React.FC<InlineConfirmButtonProps> = ({
  buttonText,
  confirmTitle,
  confirmDesc,
  onConfirm,
  variant = "destructive",
  className,
  disabled = false,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setShowConfirm(false);
  };

  if (!showConfirm) {
    return (
      <Button
        variant={variant}
        size="lg"
        disabled={disabled}
        onClick={() => setShowConfirm(true)}
        className={cn(
          "w-full min-h-[44px] gap-2 font-semibold text-xs",
          className,
        )}
      >
        <Trash2 className="size-4" />
        {buttonText}
      </Button>
    );
  }

  return (
    <div className="p-3 bg-card border border-destructive/30 rounded-xl space-y-2.5 animate-in fade-in-50 duration-200">
      <div className="space-y-0.5 text-left">
        <p className="text-xs font-bold text-foreground">{confirmTitle}</p>
        {confirmDesc && (
          <p className="text-[11px] text-muted-foreground leading-snug">
            {confirmDesc}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConfirm(false)}
          className="flex-1 min-h-[38px] text-xs font-medium"
        >
          Hủy
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleConfirm}
          className="flex-1 min-h-[38px] text-xs font-bold"
        >
          Xác nhận xóa
        </Button>
      </div>
    </div>
  );
};
