"use client";

import React, { useState } from "react";
import { Member } from "@/types";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { Input } from "@/components/ui/input";
import { Plus, Check, Edit2, Users } from "lucide-react";
import { CREATE_TEXTS } from "../constants";
import { cn } from "@/utils/utils";

interface MemberSelectorProps {
  allMembers: Member[];
  selectedMemberIds: string[];
  onToggleMember: (memberId: string) => void;
  onToggleSelectAll?: () => void;
  onAddNewMember: (name: string) => void;
  onUpdateMember: (memberId: string, name: string) => void;
}

export const MemberSelector: React.FC<MemberSelectorProps> = ({
  allMembers,
  selectedMemberIds,
  onToggleMember,
  onToggleSelectAll,
  onAddNewMember,
  onUpdateMember,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editMemberName, setEditMemberName] = useState("");

  const isAllSelected =
    allMembers.length > 0 &&
    allMembers.every((m) => selectedMemberIds.includes(m.id));

  const handleSelectAllClick = () => {
    if (onToggleSelectAll) {
      onToggleSelectAll();
      return;
    }

    if (isAllSelected) {
      allMembers.forEach((m) => {
        if (selectedMemberIds.includes(m.id)) {
          onToggleMember(m.id);
        }
      });
    } else {
      allMembers.forEach((m) => {
        if (!selectedMemberIds.includes(m.id)) {
          onToggleMember(m.id);
        }
      });
    }
  };

  const handleConfirmAdd = () => {
    const clean = newName.trim();
    if (!clean) return;
    onAddNewMember(clean);
    setNewName("");
    setIsAdding(false);
  };

  const handleStartEdit = (member: Member, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMemberId(member.id);
    setEditMemberName(member.name);
  };

  const handleConfirmEdit = () => {
    const clean = editMemberName.trim();
    if (editingMemberId && clean) {
      onUpdateMember(editingMemberId, clean);
    }
    setEditingMemberId(null);
    setEditMemberName("");
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {CREATE_TEXTS.MEMBERS_SECTION_TITLE}
        </label>

        {allMembers.length > 1 && (
          <button
            type="button"
            onClick={handleSelectAllClick}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 px-1.5 py-0.5 rounded-md active:scale-95"
          >
            <Users className="size-3.5" />
            <span>
              {isAllSelected
                ? CREATE_TEXTS.DESELECT_ALL
                : CREATE_TEXTS.SELECT_ALL}
            </span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {allMembers.map((member) => {
          const isSelected = selectedMemberIds.includes(member.id);
          const isEditingThis = editingMemberId === member.id;

          if (isEditingThis) {
            return (
              <div
                key={member.id}
                className="flex items-center gap-1 px-2 py-1 rounded-full border border-primary bg-card min-h-[40px]"
              >
                <input
                  type="text"
                  autoFocus
                  value={editMemberName}
                  onChange={(e) => setEditMemberName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleConfirmEdit();
                    }
                  }}
                  className="text-xs font-semibold bg-transparent focus:outline-none w-24 px-1"
                />
                <button
                  type="button"
                  onClick={handleConfirmEdit}
                  aria-label={CREATE_TEXTS.ARIA_SAVE_MEMBER}
                  className="size-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0"
                >
                  <Check className="size-3.5" />
                </button>
              </div>
            );
          }

          return (
            <div
              key={member.id}
              onClick={() => onToggleMember(member.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggleMember(member.id);
                }
              }}
              className={cn(
                "flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-full border text-xs font-semibold transition-all min-h-[40px] cursor-pointer select-none active:scale-95",
                isSelected
                  ? "border-primary bg-primary/15 text-primary shadow-xs"
                  : "border-border/70 bg-card text-muted-foreground hover:border-primary/40",
              )}
            >
              <MemberAvatar
                name={member.name}
                fallbackText={member.avatar}
                size="xs"
              />
              <span className="max-w-[96px] truncate">{member.name}</span>

              <button
                type="button"
                onClick={(e) => handleStartEdit(member, e)}
                aria-label={CREATE_TEXTS.ARIA_EDIT_MEMBER}
                className="p-1 rounded-full text-muted-foreground/70 hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                <Edit2 className="size-3" />
              </button>

              {isSelected && (
                <Check className="size-3.5 text-primary shrink-0" />
              )}
            </div>
          );
        })}

        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-primary/50 text-primary text-xs font-bold hover:bg-primary/10 transition-colors min-h-[40px]"
          >
            <Plus className="size-3.5" />
            <span>{CREATE_TEXTS.ADD_MEMBER_BTN}</span>
          </button>
        )}
      </div>

      {isAdding && (
        <div className="flex items-center gap-2 pt-1">
          <Input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={CREATE_TEXTS.NEW_MEMBER_NAME_PLACEHOLDER}
            className="flex-1 text-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleConfirmAdd();
              }
            }}
          />
          <button
            type="button"
            onClick={handleConfirmAdd}
            className="px-3.5 min-h-[40px] rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 shrink-0"
          >
            {CREATE_TEXTS.BTN_CONFIRM_ADD_MEMBER}
          </button>
        </div>
      )}
    </div>
  );
};
