"use client";

import React from "react";
import { DraftItem } from "../types";
import { Member } from "@/types";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { Trash2 } from "lucide-react";
import { CREATE_TEXTS } from "../constants";
import { cn } from "@/lib/utils";

interface ItemInputRowProps {
  item: DraftItem;
  members: Member[];
  onUpdate: (updated: DraftItem) => void;
  onRemove: () => void;
}

export const ItemInputRow: React.FC<ItemInputRowProps> = ({
  item,
  members,
  onUpdate,
  onRemove,
}) => {
  const toggleMemberForItem = (mId: string) => {
    const ids = item.assignedMemberIds.includes(mId)
      ? item.assignedMemberIds.filter((id) => id !== mId)
      : [...item.assignedMemberIds, mId];
    onUpdate({ ...item, assignedMemberIds: ids });
  };

  return (
    <div className="p-3 rounded-2xl bg-card border border-border/60 space-y-2.5">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={item.name}
          onChange={(e) => onUpdate({ ...item, name: e.target.value })}
          placeholder={CREATE_TEXTS.ITEM_NAME_PLACEHOLDER}
          className="flex-1 bg-muted/40 border border-border/50 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary/60 min-h-[40px]"
        />
        <input
          type="number"
          value={item.price || ""}
          onChange={(e) =>
            onUpdate({ ...item, price: parseFloat(e.target.value) || 0 })
          }
          placeholder={CREATE_TEXTS.ITEM_PRICE_PLACEHOLDER}
          className="w-28 bg-muted/40 border border-border/50 rounded-xl px-3 py-2 text-xs font-bold text-primary focus:outline-none focus:border-primary/60 min-h-[40px]"
        />
        <button
          type="button"
          onClick={onRemove}
          className="p-2 text-muted-foreground hover:text-destructive min-h-[40px] min-w-[40px] flex items-center justify-center"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      {/* Chip chọn nhanh ai ăn món này */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {members.map((m) => {
          const isAssigned = item.assignedMemberIds.includes(m.id);
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => toggleMemberForItem(m.id)}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium border transition-all min-h-[32px]",
                isAssigned
                  ? "bg-primary/20 border-primary/50 text-primary"
                  : "bg-muted/30 border-border/40 text-muted-foreground opacity-60",
              )}
            >
              <MemberAvatar name={m.name} fallbackText={m.avatar} size="xs" />
              <span>{m.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
