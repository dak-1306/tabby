"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { InvoiceFormData } from "@/lib/validations";
import { Member } from "@/types";
import { Input } from "@/components/ui/input";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { Trash2 } from "lucide-react";
import { CREATE_TEXTS } from "../constants";

interface ItemInputRowProps {
  index: number;
  form: UseFormReturn<InvoiceFormData>;
  members: Member[];
  onRemove: () => void;
}

export const ItemInputRow: React.FC<ItemInputRowProps> = ({
  index,
  form,
  members,
  onRemove,
}) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentItem = watch(`items.${index}`);
  const assignedIds = currentItem?.assignedMemberIds || [];

  const toggleMemberForArray = (mId: string) => {
    const updated = assignedIds.includes(mId)
      ? assignedIds.filter((id) => id !== mId)
      : [...assignedIds, mId];
    setValue(`items.${index}.assignedMemberIds`, updated);
  };

  const itemError = errors.items?.[index];

  return (
    <div className="p-3 bg-card border border-border/60 rounded-xl space-y-2.5">
      <div className="flex items-center gap-2">
        <Input
          {...register(`items.${index}.name`)}
          placeholder={CREATE_TEXTS.ITEM_NAME_PLACEHOLDER}
          className="flex-1"
          aria-invalid={Boolean(itemError?.name)}
        />

        <Input
          type="number"
          {...register(`items.${index}.price`, { valueAsNumber: true })}
          placeholder={CREATE_TEXTS.ITEM_PRICE_PLACEHOLDER}
          className="w-28 text-right font-bold"
          aria-invalid={Boolean(itemError?.price)}
        />

        <button
          type="button"
          onClick={onRemove}
          className="p-2 text-muted-foreground hover:text-destructive transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {members.map((m) => {
          const isSelected = assignedIds.includes(m.id);
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => toggleMemberForArray(m.id)}
              className={`p-1 rounded-full border transition-colors ${
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border/40 opacity-50"
              }`}
            >
              <MemberAvatar name={m.name} fallbackText={m.avatar} size="xs" />
            </button>
          );
        })}
      </div>

      {itemError?.name && (
        <p className="text-[11px] text-destructive">{itemError.name.message}</p>
      )}
      {itemError?.price && (
        <p className="text-[11px] text-destructive">
          {itemError.price.message}
        </p>
      )}
      {itemError?.assignedMemberIds && (
        <p className="text-[11px] text-destructive">
          {itemError.assignedMemberIds.message}
        </p>
      )}
    </div>
  );
};
