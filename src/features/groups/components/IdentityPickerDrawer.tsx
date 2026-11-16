"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { UserCheck, UserPlus, Check } from "lucide-react";
import { GroupMember } from "@/types/group";
import { GROUP_DETAIL_TEXTS, GROUP_TEXTS } from "@/constants";

interface IdentityPickerDrawerProps {
  open: boolean;
  groupName: string;
  members: GroupMember[];
  currentMemberId?: string;
  allowDismiss?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelectMember: (member: GroupMember) => void;
  onJoinNewMember: (name: string) => Promise<void>;
}

export const IdentityPickerDrawer: React.FC<IdentityPickerDrawerProps> = ({
  open,
  groupName,
  members,
  currentMemberId,
  allowDismiss = false,
  onOpenChange,
  onSelectMember,
  onJoinNewMember,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState("");

  const handleCreateAndJoin = async () => {
    if (!newName.trim()) return;
    await onJoinNewMember(newName.trim());
    setNewName("");
    setIsAddingNew(false);
  };

  return (
    <Drawer
      open={open}
      showSwipeHandle={allowDismiss}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !allowDismiss) return;
        onOpenChange?.(nextOpen);
      }}
    >
      <DrawerContent className="max-h-[85dvh] flex flex-col">
        <DrawerHeader className="text-left pb-2">
          <DrawerTitle className="flex items-center gap-2 text-base font-extrabold">
            <UserCheck className="size-5 text-primary" />
            {GROUP_TEXTS.IDENTITY_TITLE}
          </DrawerTitle>
          <DrawerDescription className="text-xs">
            {GROUP_DETAIL_TEXTS.GROUP_PREFIX}{" "}
            <strong className="text-foreground">{groupName}</strong> •{" "}
            {GROUP_TEXTS.IDENTITY_DESC}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 py-3 overflow-y-auto space-y-2.5">
          {/* Danh sách chọn 1 chạm */}
          <div className="grid grid-cols-2 gap-2">
            {members.map((m) => {
              const isCurrent = m.id === currentMemberId;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onSelectMember(m)}
                  className={`flex items-center justify-between gap-2 p-3 rounded-2xl border text-left transition-all min-h-[52px] active:scale-95 ${
                    isCurrent
                      ? "border-primary bg-primary/15 text-primary shadow-xs"
                      : "border-border/70 bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MemberAvatar
                      name={m.name}
                      fallbackText={m.avatar}
                      size="xs"
                    />
                    <span className="text-xs font-bold truncate">{m.name}</span>
                  </div>
                  {isCurrent && (
                    <Check className="size-4 text-primary shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tùy chọn tự thêm tên mới nếu chưa có trong danh sách */}
          <div className="pt-2 border-t border-border/50">
            {!isAddingNew ? (
              <button
                type="button"
                onClick={() => setIsAddingNew(true)}
                className="w-full py-3 rounded-xl border border-dashed border-primary/50 text-primary text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-primary/10 min-h-[44px]"
              >
                <UserPlus className="size-4" />
                {GROUP_TEXTS.BTN_NOT_IN_LIST}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateAndJoin()}
                  placeholder={GROUP_TEXTS.YOUR_NAME_PLACEHOLDER}
                  className="font-semibold"
                />
                <Button
                  type="button"
                  onClick={handleCreateAndJoin}
                  className="shrink-0 min-h-[44px] font-bold px-4"
                >
                  {GROUP_TEXTS.BTN_JOIN_AS_NEW}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
