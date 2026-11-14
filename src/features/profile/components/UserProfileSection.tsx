"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormData } from "@/validations";
import { PROFILE_TEXTS } from "../constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BankSelectDrawer } from "./BankSelectDrawer";
import { Check, User, Building2 } from "lucide-react";

interface UserProfileSectionProps {
  form: UseFormReturn<ProfileFormData>;
  onSave: () => void;
  isSaved: boolean;
  isBankDrawerOpen: boolean;
  setIsBankDrawerOpen: (open: boolean) => void;
}

export const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  form,
  onSave,
  isSaved,
  isBankDrawerOpen,
  setIsBankDrawerOpen,
}) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const currentBankName = watch("bankName");

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
          <Input
            {...register("name")}
            placeholder={PROFILE_TEXTS.NAME_PLACEHOLDER}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && (
            <p className="text-[11px] text-destructive font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">
              {PROFILE_TEXTS.BANK_NAME_LABEL}
            </label>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsBankDrawerOpen(true)}
              className="w-full justify-between min-h-[36px] px-2.5 text-xs font-medium border-input"
            >
              <span className="truncate">
                {currentBankName || PROFILE_TEXTS.BANK_NAME_PLACEHOLDER}
              </span>
              <Building2 className="size-3.5 shrink-0 text-muted-foreground" />
            </Button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">
              {PROFILE_TEXTS.BANK_ACC_LABEL}
            </label>
            <Input
              {...register("accountNumber")}
              placeholder={PROFILE_TEXTS.BANK_ACC_PLACEHOLDER}
              aria-invalid={Boolean(errors.accountNumber)}
            />
            {errors.accountNumber && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.accountNumber.message}
              </p>
            )}
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

        <BankSelectDrawer
          open={isBankDrawerOpen}
          selectedBank={currentBankName}
          onSelect={(bankName) => setValue("bankName", bankName)}
          onClose={() => setIsBankDrawerOpen(false)}
        />
      </div>
    </section>
  );
};
