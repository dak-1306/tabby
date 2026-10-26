"use client";

import React, { useState } from "react";
import { PROFILE_TEXTS } from "../constants";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DangerZoneSectionProps {
  onReset: () => void;
}

export const DangerZoneSection: React.FC<DangerZoneSectionProps> = ({
  onReset,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmReset = () => {
    onReset();
    setShowConfirm(false);
  };

  return (
    <section className="space-y-3 bg-destructive/10 border border-destructive/20 p-4 rounded-2xl">
      <div className="flex items-center gap-2 text-xs font-semibold text-destructive uppercase tracking-wider">
        <AlertTriangle className="size-4" />
        <span>{PROFILE_TEXTS.SECTION_DANGER_TITLE}</span>
      </div>

      {!showConfirm ? (
        <Button
          variant="destructive"
          size="lg"
          onClick={() => setShowConfirm(true)}
          className="w-full min-h-[44px] font-semibold text-xs mt-1"
        >
          {PROFILE_TEXTS.RESET_APP_BTN}
        </Button>
      ) : (
        <div className="p-3 bg-card border border-destructive/30 rounded-xl space-y-3">
          <div className="space-y-1">
            <p className="text-xs font-bold text-foreground">
              {PROFILE_TEXTS.RESET_CONFIRM_TITLE}
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {PROFILE_TEXTS.RESET_CONFIRM_DESC}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirm(false)}
              className="flex-1 min-h-[40px] text-xs"
            >
              {PROFILE_TEXTS.RESET_CONFIRM_CANCEL}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmReset}
              className="flex-1 min-h-[40px] text-xs font-bold"
            >
              {PROFILE_TEXTS.RESET_CONFIRM_OK}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};
