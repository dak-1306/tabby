"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { GroupMember } from "@/types/group";
import { useGroupStore } from "@/stores/useGroupStore";
import { useAppStore } from "@/stores/useAppStore";
import { groupService } from "../services/groupService";

const emptySubscribe = () => () => {};
const getIsInAppBrowser = () =>
  typeof navigator !== "undefined" &&
  /Zalo|FBAN|FBAV|Instagram|Line/i.test(navigator.userAgent || "");
const getServerSnapshot = () => false;

export const useGroupSession = (groupId: string) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const group = useGroupStore((s) => s.cachedGroups[groupId] ?? null);
  const savedMemberId = useGroupStore((s) => s.sessions[groupId] ?? null);
  const syncGroupById = useGroupStore((s) => s.syncGroupById);
  const setSessionMember = useGroupStore((s) => s.setSessionMember);
  const addAndSelectMember = useGroupStore((s) => s.addAndSelectMember);
  const currentUserId = useAppStore((s) => s.currentUserId);

  const isInAppBrowser = useSyncExternalStore(
    emptySubscribe,
    getIsInAppBrowser,
    getServerSnapshot,
  );

  const [isFetched, setIsFetched] = useState(false);
  const [identityDismissed, setIdentityDismissed] = useState(false);

  const urlMemberId = searchParams.get("m");

  useEffect(() => {
    let isCancelled = false;

    syncGroupById(groupId).then((freshGroup) => {
      if (isCancelled) return;

      if (freshGroup && urlMemberId) {
        const matched = freshGroup.members.find((m) => m.id === urlMemberId);
        if (matched) {
          setSessionMember(groupId, matched.id);
          void groupService.linkMemberToCurrentUser(groupId, matched.id);
          router.replace(pathname);
        }
      } else if (freshGroup && !savedMemberId && currentUserId) {
        const linked = freshGroup.members.find(
          (m) => m.linkedUserId === currentUserId,
        );
        if (linked) {
          setSessionMember(groupId, linked.id);
        }
      }

      setIsFetched(true);
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void syncGroupById(groupId);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isCancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    currentUserId,
    groupId,
    pathname,
    router,
    savedMemberId,
    setSessionMember,
    syncGroupById,
    urlMemberId,
  ]);

  const currentMember: GroupMember | null =
    group?.members.find((m) => m.id === (urlMemberId || savedMemberId)) ?? null;

  const isLoading = !group && !isFetched;
  const needsIdentity = Boolean(group && !currentMember && !identityDismissed);

  const selectIdentity = useCallback(
    (member: GroupMember) => {
      setSessionMember(groupId, member.id);
      setIdentityDismissed(true);
      void groupService.linkMemberToCurrentUser(groupId, member.id);
    },
    [groupId, setSessionMember],
  );

  const joinAsNewMember = useCallback(
    async (name: string) => {
      const created = await addAndSelectMember(groupId, name, true);
      if (created) {
        setIdentityDismissed(true);
      }
    },
    [addAndSelectMember, groupId],
  );

  const refreshGroup = useCallback(async () => {
    await syncGroupById(groupId);
  }, [groupId, syncGroupById]);

  return {
    group,
    currentMember,
    isLoading,
    needsIdentity,
    isInAppBrowser,
    selectIdentity,
    joinAsNewMember,
    refreshGroup,
  };
};