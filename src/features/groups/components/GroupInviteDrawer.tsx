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
import { Share2, Copy, Check, Plus } from "lucide-react";
import { Group } from "@/types/group";
import { GROUP_ROUTES, GROUP_TEXTS } from "@/constants";

interface GroupInviteDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group;
  onAddNewMember: (name: string) => Promise<void>;
}

export const GroupInviteDrawer: React.FC<GroupInviteDrawerProps> = ({
  open,
  onOpenChange,
  group,
  onAddNewMember,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [newMemberName, setNewMemberName] = useState("");

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const generalLink = `${origin}${GROUP_ROUTES.DETAIL(group.id)}`;

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddMember = async () => {
    if (!newMemberName.trim()) return;
    await onAddNewMember(newMemberName.trim());
    setNewMemberName("");
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[88dvh] flex flex-col">
        <DrawerHeader className="text-left pb-2">
          <DrawerTitle className="flex items-center gap-2 text-base font-extrabold">
            <Share2 className="size-5 text-primary" />
            {GROUP_TEXTS.INVITE_TITLE}
          </DrawerTitle>
          <DrawerDescription className="text-xs">
            {GROUP_TEXTS.INVITE_DESC}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 py-2 overflow-y-auto space-y-4">
          {/* Mã 6 ký tự & Link chung */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/30 flex flex-col justify-between gap-2">
              <span className="text-[11px] font-bold text-primary">
                Mã nhóm 6 ký tự
              </span>
              <div className="flex items-center justify-between">
                <span className="text-base font-black tracking-widest text-foreground">
                  {group.code}
                </span>
                <button
                  type="button"
                  onClick={() => copyText(group.code, "code")}
                  className="p-1.5 rounded-lg bg-background/80 text-primary"
                >
                  {copiedKey === "code" ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 flex flex-col justify-between gap-2">
              <span className="text-[11px] font-bold text-muted-foreground">
                Link chung nhóm
              </span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => copyText(generalLink, "general")}
                className="w-full h-8 text-xs font-bold gap-1"
              >
                {copiedKey === "general" ? (
                  <>
                    <Check className="size-3.5 text-primary" />
                    Đã chép
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    Chép link
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Thêm thành viên mới vào nhóm */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Thêm thành viên mới
            </label>
            <div className="flex items-center gap-2">
              <Input
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
                placeholder="Nhập tên bạn mới..."
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddMember}
                className="shrink-0 min-h-[44px] px-3.5 font-bold gap-1"
              >
                <Plus className="size-4" />
                Thêm
              </Button>
            </div>
          </div>

          {/* Danh sách link cá nhân hóa từng người */}
          <div className="space-y-1.5 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Link định danh từng thành viên ({group.members.length})
            </span>
            <div className="space-y-1.5">
              {group.members.map((m) => {
                const personalLink = `${generalLink}?m=${m.id}`;
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/60"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MemberAvatar
                        name={m.name}
                        fallbackText={m.avatar}
                        size="xs"
                      />
                      <span className="text-xs font-bold truncate">
                        {m.name}
                      </span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => copyText(personalLink, m.id)}
                      className="h-8 px-2.5 text-xs font-bold gap-1 shrink-0"
                    >
                      {copiedKey === m.id ? (
                        <>
                          <Check className="size-3.5 text-primary" />
                          Đã chép
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" />
                          Chép link riêng
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
