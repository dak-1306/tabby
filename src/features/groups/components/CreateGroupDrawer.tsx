"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, Check, Copy, ArrowRight, Users } from "lucide-react";
import { GROUP_ROUTES, GROUP_TEXTS } from "@/constants";
import { useGroupStore } from "@/stores/useGroupStore";
import { Group } from "@/types/group";

interface CreateGroupDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupCreated?: () => void;
}

export const CreateGroupDrawer: React.FC<CreateGroupDrawerProps> = ({
  open,
  onOpenChange,
  onGroupCreated,
}) => {
  const router = useRouter();
  const createGroup = useGroupStore((s) => s.createGroup);

  const [groupName, setGroupName] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [memberNames, setMemberNames] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [createdGroup, setCreatedGroup] = useState<Group | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleAddMemberTag = () => {
    const trimmed = memberInput.trim();
    if (!trimmed) return;
    if (
      memberNames.some((n) => n.toLowerCase() === trimmed.toLowerCase()) ||
      creatorName.trim().toLowerCase() === trimmed.toLowerCase()
    ) {
      setMemberInput("");
      return;
    }
    setMemberNames([...memberNames, trimmed]);
    setMemberInput("");
  };

  const handleRemoveMemberTag = (nameToRemove: string) => {
    setMemberNames(memberNames.filter((n) => n !== nameToRemove));
  };

  const handleSubmit = async () => {
    if (!groupName.trim()) {
      setError("Vui lòng nhập tên nhóm.");
      return;
    }
    if (!creatorName.trim()) {
      setError("Vui lòng nhập tên của bạn.");
      return;
    }

    const finalMembers = [...memberNames];
    if (memberInput.trim()) {
      finalMembers.push(memberInput.trim());
    }

    setError("");
    const { group } = await createGroup({
      name: groupName,
      creatorName,
      memberNames: finalMembers,
    });

    setCreatedGroup(group);
    onGroupCreated?.();
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setGroupName("");
      setCreatorName("");
      setMemberInput("");
      setMemberNames([]);
      setError("");
      setCreatedGroup(null);
    }
    onOpenChange(nextOpen);
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <Drawer open={open} onOpenChange={handleClose}>
      <DrawerContent className="max-h-[90dvh] flex flex-col">
        {!createdGroup ? (
          <>
            <DrawerHeader className="text-left pb-2">
              <DrawerTitle className="flex items-center gap-2 text-base font-extrabold">
                <Users className="size-5 text-primary" />
                {GROUP_TEXTS.CREATE_DRAWER_TITLE}
              </DrawerTitle>
              <DrawerDescription className="text-xs">
                {GROUP_TEXTS.CREATE_DRAWER_DESC}
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-4 py-2 overflow-y-auto space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {GROUP_TEXTS.GROUP_NAME_LABEL}
                </label>
                <Input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder={GROUP_TEXTS.GROUP_NAME_PLACEHOLDER}
                  className="font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {GROUP_TEXTS.YOUR_NAME_LABEL}
                </label>
                <Input
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder={GROUP_TEXTS.YOUR_NAME_PLACEHOLDER}
                  className="font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {GROUP_TEXTS.OTHER_MEMBERS_LABEL}
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={memberInput}
                    onChange={(e) => setMemberInput(e.target.value)}
                    placeholder={GROUP_TEXTS.OTHER_MEMBER_PLACEHOLDER}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddMemberTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddMemberTag}
                    className="shrink-0 min-h-[44px] px-3.5 font-bold gap-1"
                  >
                    <Plus className="size-4" />
                    Thêm
                  </Button>
                </div>

                {memberNames.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {memberNames.map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold"
                      >
                        {name}
                        <button
                          type="button"
                          onClick={() => handleRemoveMemberTag(name)}
                          className="hover:text-destructive"
                          aria-label={`Xóa ${name}`}
                        >
                          <X className="size-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <p className="text-xs text-destructive font-semibold">
                  {error}
                </p>
              )}
            </div>

            <div className="p-4 pt-2 border-t border-border/60">
              <Button
                type="button"
                size="lg"
                onClick={handleSubmit}
                className="w-full min-h-[48px] font-bold text-sm gap-2"
              >
                <Check className="size-5" />
                Tạo nhóm & Lấy link mời
              </Button>
            </div>
          </>
        ) : (
          <>
            <DrawerHeader className="text-left pb-2">
              <DrawerTitle className="text-base font-extrabold text-primary">
                Tạo nhóm &ldquo;{createdGroup.name}&rdquo; thành công!
              </DrawerTitle>
              <DrawerDescription className="text-xs">
                Mã nhóm:{" "}
                <strong className="text-foreground">{createdGroup.code}</strong>{" "}
                • Gửi link bên dưới vào Zalo/Messenger để mọi người cùng vào.
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-4 py-2 overflow-y-auto space-y-3">
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    Link mời chung (Gửi vào group chat)
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      copyText(
                        `${origin}${GROUP_ROUTES.DETAIL(createdGroup.id)}`,
                        "general",
                      )
                    }
                    className="h-8 px-2.5 text-xs font-bold gap-1"
                  >
                    {copiedKey === "general" ? (
                      <>
                        <Check className="size-3.5 text-primary" />
                        Đã chép
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        Sao chép
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  {`${origin}${GROUP_ROUTES.DETAIL(createdGroup.id)}`}
                </p>
              </div>

              {createdGroup.members.length > 1 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Hoặc gửi link định danh riêng (Tự nhận tên)
                  </span>
                  <div className="space-y-1.5">
                    {createdGroup.members
                      .filter((m) => !m.isCreator)
                      .map((m) => {
                        const personalLink = `${origin}${GROUP_ROUTES.DETAIL(
                          createdGroup.id,
                        )}?m=${m.id}`;
                        return (
                          <div
                            key={m.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/60"
                          >
                            <span className="text-xs font-bold text-foreground">
                              Link cho {m.name}
                            </span>
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={() => copyText(personalLink, m.id)}
                              className="h-8 px-2.5 text-xs font-bold gap-1"
                            >
                              {copiedKey === m.id ? (
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
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 pt-2 border-t border-border/60">
              <Button
                type="button"
                size="lg"
                onClick={() => {
                  const targetUrl = GROUP_ROUTES.DETAIL(createdGroup.id);
                  handleClose(false);
                  router.push(targetUrl);
                }}
                className="w-full min-h-[48px] font-bold text-sm gap-2"
              >
                Vào nhóm ngay
                <ArrowRight className="size-5" />
              </Button>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};
