"use client";

import React from "react";
import { UserProfileFormData } from "../types";
import { PROFILE_TEXTS } from "../constants";
import { Button } from "@/components/ui/button";
import { Check, User } from "lucide-react";

interface UserProfileSectionProps {
  formData: UserProfileFormData;
  onChange: (data: UserProfileFormData) => void;
  onSave: () => void;
  isSaved: boolean;
}

export const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  formData,
  onChange,
  onSave,
  isSaved,
}) => {
  return (
    <section className="space-y-3 bg-card border border-border/60 p-4 rounded-2xl">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <User className="size-4 text-primary" />
        <span>{PROFILE_TEXTS.SECTION_USER_TITLE}</span>
      </div>

      <div className="space-y-3 pt-1">
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">
            {PROFILE_TEXTS.NAME_LABEL}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onChange({ ...formData, name: e.target.value })}
            placeholder={PROFILE_TEXTS.NAME_PLACEHOLDER}
            className="w-full min-h-[44px] px-3.5 py-2 bg-muted/30 border border-border/50 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary/60"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">
              {PROFILE_TEXTS.BANK_NAME_LABEL}
            </label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) =>
                onChange({ ...formData, bankName: e.target.value })
              }
              placeholder={PROFILE_TEXTS.BANK_NAME_PLACEHOLDER}
              className="w-full min-h-[44px] px-3.5 py-2 bg-muted/30 border border-border/50 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary/60"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">
              {PROFILE_TEXTS.BANK_ACC_LABEL}
            </label>
            <input
              type="text"
              value={formData.accountNumber}
              onChange={(e) =>
                onChange({ ...formData, accountNumber: e.target.value })
              }
              placeholder={PROFILE_TEXTS.BANK_ACC_PLACEHOLDER}
              className="w-full min-h-[44px] px-3.5 py-2 bg-muted/30 border border-border/50 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary/60"
            />
          </div>
        </div>

        <Button
          size="lg"
          onClick={onSave}
          className="w-full min-h-[44px] gap-2 mt-2 font-bold text-xs"
        >
          {isSaved ? <Check className="size-4" /> : null}
          {isSaved
            ? PROFILE_TEXTS.PROFILE_SAVED_SUCCESS
            : PROFILE_TEXTS.SAVE_PROFILE_BTN}
        </Button>
      </div>
    </section>
  );
};
