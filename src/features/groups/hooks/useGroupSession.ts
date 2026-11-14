"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { GroupMember } from "@/types/group";
import { useGroupStore } from "@/stores/useGroupStore";

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

  // Kiểm tra Zalo/Messenger WebView chuẩn React 19 (không gây cascading render)
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

      // Nếu URL có ?m=memberId hợp lệ -> Tự động lưu danh tính và làm sạch URL
      if (freshGroup && urlMemberId) {
        const matched = freshGroup.members.find((m) => m.id === urlMemberId);
        if (matched) {
          setSessionMember(groupId, matched.id);
          router.replace(pathname);
        }
      }

      setIsFetched(true);
    });

    return () => {
      isCancelled = true;
    };
  }, [groupId, pathname, router, setSessionMember, syncGroupById, urlMemberId]);

  // Suy xuất (derive) trực tiếp danh tính hiện tại từ store, không cần state trung gian
  const currentMember: GroupMember | null =
    group?.members.find((m) => m.id === (urlMemberId || savedMemberId)) ?? null;

  const isLoading = !group && !isFetched;
  const needsIdentity = Boolean(group && !currentMember && !identityDismissed);

  const selectIdentity = useCallback(
    (member: GroupMember) => {
      setSessionMember(groupId, member.id);
      setIdentityDismissed(true);
    },
    [groupId, setSessionMember],
  );

  const joinAsNewMember = useCallback(
    async (name: string) => {
      const created = await addAndSelectMember(groupId, name);
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
