"use client";

import React, { useRef, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { InvoiceFormData } from "@/validations";
import { Member } from "@/types";
import { Input } from "@/components/ui/input";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { Trash2, Users, Check } from "lucide-react";
import { CREATE_TEXTS } from "../constants";
import { parseSmartPrice } from "../utils/priceParser";

interface ItemInputRowProps {
  index: number;
  form: UseFormReturn<InvoiceFormData>;
  members: Member[];
  onRemove: () => void;
  onNextRow?: () => void;
}

const QUICK_DISHES = ["Cà phê", "Trà sữa", "Cơm trưa", "Nước ngọt", "Vé xe"];

export const ItemInputRow: React.FC<ItemInputRowProps> = ({
  index,
  form,
  members,
  onRemove,
  onNextRow,
}) => {
  const priceInputRef = useRef<HTMLInputElement>(null);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [draftPriceText, setDraftPriceText] = useState("");

  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = form;

  const currentItem = useWatch({ control, name: `items.${index}` });
  const assignedIds = currentItem?.assignedMemberIds || [];
  const currentPrice = Number(currentItem?.price) || 0;

  const displayedPriceValue = isEditingPrice
    ? draftPriceText
    : currentPrice === 0
      ? ""
      : String(currentPrice);

  const toggleMemberForArray = (mId: string) => {
    const updated = assignedIds.includes(mId)
      ? assignedIds.filter((id) => id !== mId)
      : [...assignedIds, mId];
    setValue(`items.${index}.assignedMemberIds`, updated, {
      shouldDirty: true,
    });
  };

  const handleToggleSelectAll = () => {
    if (assignedIds.length === members.length) {
      setValue(`items.${index}.assignedMemberIds`, [], { shouldDirty: true });
    } else {
      setValue(
        `items.${index}.assignedMemberIds`,
        members.map((m) => m.id),
        { shouldDirty: true },
      );
    }
  };

  const handlePriceChange = (rawText: string) => {
    setDraftPriceText(rawText);
    const parsed = parseSmartPrice(rawText);
    setValue(`items.${index}.price`, parsed, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const commitPriceOnBlur = (rawText: string) => {
    const parsed = parseSmartPrice(rawText);
    setValue(`items.${index}.price`, parsed, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setIsEditingPrice(false);
  };

  const addQuickPrice = (amount: number) => {
    const nextPrice = currentPrice + amount;
    setIsEditingPrice(false);
    setValue(`items.${index}.price`, nextPrice, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const setQuickDish = (dishName: string) => {
    setValue(`items.${index}.name`, dishName, {
      shouldDirty: true,
      shouldValidate: true,
    });
    priceInputRef.current?.focus();
  };

  const itemError = errors.items?.[index];
  const priceFieldRegistration = register(`items.${index}.price`);

  return (
    <div className="p-3.5 bg-card border border-border/70 rounded-2xl space-y-3 shadow-xs">
      <div className="flex items-center gap-2">
        <Input
          id={`item-name-input-${index}`}
          {...register(`items.${index}.name`)}
          placeholder={CREATE_TEXTS.ITEM_NAME_PLACEHOLDER}
          className="flex-1 font-medium"
          aria-invalid={Boolean(itemError?.name)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              priceInputRef.current?.focus();
            }
          }}
        />

        <div className="relative w-32 shrink-0">
          <Input
            type="text"
            inputMode="decimal"
            placeholder="Giá (10k...)"
            name={priceFieldRegistration.name}
            value={displayedPriceValue}
            onFocus={(e) => {
              setDraftPriceText(currentPrice === 0 ? "" : String(currentPrice));
              setIsEditingPrice(true);
              e.target.select();
            }}
            onChange={(e) => handlePriceChange(e.target.value)}
            onBlur={(e) => {
              commitPriceOnBlur(e.target.value);
            }}
            ref={(e) => {
              priceFieldRegistration.ref(e);
              priceInputRef.current = e;
            }}
            className="text-right font-bold pr-3"
            aria-invalid={Boolean(itemError?.price)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitPriceOnBlur(e.currentTarget.value);
                onNextRow?.();
              }
            }}
          />
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="size-11 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-center shrink-0"
          aria-label="Xóa món"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-muted-foreground font-medium mr-1">Gợi ý:</span>
          {QUICK_DISHES.map((dish) => (
            <button
              key={dish}
              type="button"
              onClick={() => setQuickDish(dish)}
              className="px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-medium min-h-[28px]"
            >
              {dish}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          <button
            type="button"
            onClick={() => addQuickPrice(10000)}
            className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-bold hover:bg-primary/20 min-h-[28px]"
          >
            +10k
          </button>
          <button
            type="button"
            onClick={() => addQuickPrice(50000)}
            className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-bold hover:bg-primary/20 min-h-[28px]"
          >
            +50k
          </button>
        </div>
      </div>

      <div className="space-y-1.5 pt-1 border-t border-border/40">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
          <span>Người chia món này:</span>
          <button
            type="button"
            onClick={handleToggleSelectAll}
            className="text-primary hover:underline flex items-center gap-1 font-semibold"
          >
            <Users className="size-3" />
            {assignedIds.length === members.length
              ? "Bỏ chọn hết"
              : "Chọn tất cả"}
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {members.map((m) => {
            const isSelected = assignedIds.includes(m.id);
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleMemberForArray(m.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all min-h-[44px] active:scale-95 ${
                  isSelected
                    ? "border-primary bg-primary/15 text-primary shadow-xs"
                    : "border-border/60 bg-muted/30 text-muted-foreground opacity-60"
                }`}
              >
                <MemberAvatar name={m.name} fallbackText={m.avatar} size="xs" />
                <span className="max-w-[80px] truncate">{m.name}</span>
                {isSelected && (
                  <Check className="size-3.5 ml-0.5 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {itemError?.name && (
        <p className="text-[11px] text-destructive font-medium">
          {itemError.name.message}
        </p>
      )}
      {itemError?.price && (
        <p className="text-[11px] text-destructive font-medium">
          {itemError.price.message}
        </p>
      )}
      {itemError?.assignedMemberIds && (
        <p className="text-[11px] text-destructive font-medium">
          {itemError.assignedMemberIds.message}
        </p>
      )}
    </div>
  );
};
