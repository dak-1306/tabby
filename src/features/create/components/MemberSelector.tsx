"use client";

import React, { useState } from "react";
import { Member } from "@/types";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { CREATE_TEXTS } from "../constants";
import { Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemberSelectorProps {
  allMembers: Member[];
  selectedMemberIds: string[];
  onToggleMember: (memberId: string) => void;
  onAddNewMember: (name: string) => void;
}

export const MemberSelector: React.FC<MemberSelectorProps> = ({
  allMembers,
  selectedMemberIds,
  onToggleMember,
  onAddNewMember,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddNewMember(newName.trim());
    setNewName("");
    setIsAdding(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {CREATE_TEXTS.MEMBERS_SECTION_TITLE}
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        {allMembers.map((m) => {
          const isSelected = selectedMemberIds.includes(m.id);
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onToggleMember(m.id)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-medium transition-all active:scale-95 min-h-[38px]",
                isSelected
                  ? "bg-primary/15 border-primary text-primary"
                  : "bg-card border-border/60 text-muted-foreground hover:text-foreground",
              )}
            >
              <MemberAvatar name={m.name} fallbackText={m.avatar} size="xs" />
              <span>{m.name}</span>
              {isSelected && <Check className="size-3 ml-0.5" />}
            </button>
          );
        })}

        {isAdding ? (
          <div className="flex items-center gap-1 bg-card border border-primary/50 rounded-full px-2 py-1 min-h-[38px]">
            <input
              type="text"
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={CREATE_TEXTS.NEW_MEMBER_NAME_PLACEHOLDER}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="text-xs bg-transparent border-none focus:outline-none px-1 w-28 text-foreground"
            />
            <button
              type="button"
              onClick={handleAdd}
              className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full font-bold"
            >
              Lưu
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-primary/60 text-primary text-xs font-semibold hover:bg-primary/10 transition-colors min-h-[38px]"
          >
            <Plus className="size-3.5" />
            <span>{CREATE_TEXTS.ADD_MEMBER_BTN}</span>
          </button>
        )}
      </div>
    </div>
  );
};
