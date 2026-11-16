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
import { Hash, ArrowRight } from "lucide-react";
import { GROUP_ROUTES, GROUP_TEXTS } from "@/constants";
import { useGroupStore } from "@/stores/useGroupStore";

interface JoinGroupCodeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JoinGroupCodeDrawer: React.FC<JoinGroupCodeDrawerProps> = ({
  open,
  onOpenChange,
}) => {
  const router = useRouter();
  const syncGroupByCode = useGroupStore((s) => s.syncGroupByCode);

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleJoin = async () => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned.length < 6) {
      setError(GROUP_TEXTS.ERR_INVALID_CODE_LENGTH);
      return;
    }

    const found = await syncGroupByCode(cleaned);
    if (!found) {
      setError(GROUP_TEXTS.ERR_GROUP_NOT_FOUND);
      return;
    }

    setError("");
    setCode("");
    onOpenChange(false);
    router.push(GROUP_ROUTES.DETAIL(found.id));
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setCode("");
          setError("");
        }
        onOpenChange(nextOpen);
      }}
    >
      <DrawerContent>
        <DrawerHeader className="text-left pb-2">
          <DrawerTitle className="flex items-center gap-2 text-base font-extrabold">
            <Hash className="size-5 text-primary" />
            {GROUP_TEXTS.JOIN_CODE_TITLE}
          </DrawerTitle>
          <DrawerDescription className="text-xs">
            {GROUP_TEXTS.JOIN_CODE_DESC}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 py-3 space-y-3">
          <Input
            value={code}
            maxLength={6}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              if (error) setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            placeholder={GROUP_TEXTS.JOIN_CODE_PLACEHOLDER}
            className="text-center text-xl font-black tracking-[0.25em] uppercase h-12"
          />

          {error && (
            <p className="text-xs text-destructive font-semibold text-center">
              {error}
            </p>
          )}
        </div>

        <div className="p-4 pt-2 border-t border-border/60">
          <Button
            type="button"
            size="lg"
            onClick={handleJoin}
            className="w-full min-h-[48px] font-bold text-sm gap-2"
          >
            {GROUP_TEXTS.BTN_SUBMIT_JOIN_CODE}
            <ArrowRight className="size-5" />
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
