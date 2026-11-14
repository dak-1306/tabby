"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Users, Plus, Hash, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GROUP_ROUTES, GROUP_TEXTS } from "@/constants";
import { useGroupStore } from "@/stores/useGroupStore";
import { CreateGroupDrawer } from "./CreateGroupDrawer";
import { JoinGroupCodeDrawer } from "./JoinGroupCodeDrawer";

export const HomeGroupSection: React.FC = () => {
  const sessions = useGroupStore((s) => s.sessions);
  const cachedGroups = useGroupStore((s) => s.cachedGroups);
  const syncJoinedGroups = useGroupStore((s) => s.syncJoinedGroups);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  useEffect(() => {
    void syncJoinedGroups();
  }, [syncJoinedGroups]);

  const groups = useMemo(() => {
    return Object.keys(sessions)
      .map((id) => cachedGroups[id])
      .filter(Boolean);
  }, [sessions, cachedGroups]);

  return (
    <section className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Users className="size-3.5 text-primary" />
          {GROUP_TEXTS.SECTION_TITLE}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="min-h-[44px] rounded-xl font-bold text-xs gap-1.5 shadow-xs"
        >
          <Plus className="size-4" />
          {GROUP_TEXTS.BTN_CREATE_GROUP}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => setIsJoinOpen(true)}
          className="min-h-[44px] rounded-xl font-bold text-xs gap-1.5"
        >
          <Hash className="size-4 text-primary" />
          {GROUP_TEXTS.BTN_JOIN_CODE}
        </Button>
      </div>

      {groups.length > 0 ? (
        <div className="space-y-2 pt-0.5">
          {groups.map((g) => (
            <Link
              key={g.id}
              href={GROUP_ROUTES.DETAIL(g.id)}
              className="flex items-center justify-between p-3 rounded-2xl bg-card border border-border/70 hover:border-primary/50 transition-all active:scale-[0.99]"
            >
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-foreground truncate">
                    {g.name}
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-primary/15 text-primary tracking-wider">
                    {g.code}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {g.members.length} thành viên • {g.invoices.length} hóa đơn
                </p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground shrink-0" />
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-muted-foreground bg-muted/30 rounded-xl p-3 border border-border/40">
          {GROUP_TEXTS.EMPTY_GROUPS}
        </p>
      )}

      <CreateGroupDrawer open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <JoinGroupCodeDrawer open={isJoinOpen} onOpenChange={setIsJoinOpen} />
    </section>
  );
};