"use client";

import React, { useState } from "react";
import { Member } from "@/types";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { CREATE_TEXTS } from "../constants";
import { Plus, Check, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemberSelectorProps {
  allMembers: Member[];
  selectedMemberIds: string[];
  onToggleMember: (memberId: string) => void;
  onAddNewMember: (name: string) => void;
  onUpdateMember: (memberId: string, name: string) => void;
}

export const MemberSelector: React.FC<MemberSelectorProps> = ({
  allMembers,
  selectedMemberIds,
  onToggleMember,
  onAddNewMember,
  onUpdateMember,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddNewMember(newName.trim());
    setNewName("");
    setIsAdding(false);
  };

  const startEdit = (m: Member, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(m.id);
    setEditName(m.name);
  };

  const saveEdit = (mId: string) => {
    if (editName.trim()) {
      onUpdateMember(mId, editName.trim());
    }
    setEditingId(null);
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
          const isEditing = editingId === m.id;

          if (isEditing) {
            return (
              <div
                key={m.id}
                className="flex items-center gap-1 bg-card border border-primary rounded-full px-2 py-1 min-h-[44px]"
              >
                <input
                  type="text"
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(m.id)}
                  className="text-xs bg-transparent focus:outline-none px-2 w-28 text-foreground font-semibold"
                />
                <button
                  type="button"
                  onClick={() => saveEdit(m.id)}
                  className="text-xs bg-primary text-primary-foreground px-2.5 py-1 rounded-full font-bold"
                >
                  Đổi
                </button>
              </div>
            );
          }

          return (
            <div
              key={m.id}
              onClick={() => onToggleMember(m.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-semibold transition-all active:scale-95 min-h-[44px] cursor-pointer select-none",
                isSelected
                  ? "bg-primary/15 border-primary text-primary shadow-xs"
                  : "bg-card border-border/60 text-muted-foreground hover:text-foreground",
              )}
            >
              <MemberAvatar name={m.name} fallbackText={m.avatar} size="xs" />
              <span>{m.name}</span>
              {isSelected && <Check className="size-3.5 ml-0.5 text-primary" />}

              <button
                type="button"
                onClick={(e) => startEdit(m, e)}
                className="p-1 hover:bg-background/80 rounded-full text-muted-foreground hover:text-foreground transition-colors ml-1"
                aria-label="Đổi tên"
              >
                <Edit2 className="size-3" />
              </button>
            </div>
          );
        })}

        {isAdding ? (
          <div className="flex items-center gap-1 bg-card border border-primary/50 rounded-full px-2 py-1 min-h-[44px]">
            <input
              type="text"
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={CREATE_TEXTS.NEW_MEMBER_NAME_PLACEHOLDER}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="text-xs bg-transparent border-none focus:outline-none px-2 w-28 text-foreground"
            />
            <button
              type="button"
              onClick={handleAdd}
              className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-bold min-h-[32px]"
            >
              Lưu
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-dashed border-primary/60 text-primary text-xs font-semibold hover:bg-primary/10 transition-colors min-h-[44px]"
          >
            <Plus className="size-4" />
            <span>{CREATE_TEXTS.ADD_MEMBER_BTN}</span>
          </button>
        )}
      </div>
    </div>
  );
};
