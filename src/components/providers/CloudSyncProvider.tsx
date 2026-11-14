"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useAppStore } from "@/stores/useAppStore";
import { Invoice, Member } from "@/types";

export type SyncStatus = "idle" | "syncing" | "synced" | "error";

const SyncStatusContext = createContext<SyncStatus>("idle");
export const useCloudSyncStatus = () => useContext(SyncStatusContext);

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const DEFAULT_HOST_NAMES = ["bạn (host)", "tôi", "bạn", "host", ""];

const isDefaultName = (name?: string): boolean =>
  !name || DEFAULT_HOST_NAMES.includes(name.trim().toLowerCase());

const waitForStoreHydration = (): Promise<void> => {
  if (useAppStore.persist.hasHydrated()) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const unsub = useAppStore.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });
};

const PersonalCloudSyncManager: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");

  const isHydratingRef = useRef(false);
  const initializedEmailRef = useRef<string | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const userEmail = session?.user?.email ?? null;
  const stableUserId = userEmail
    ? `usr_${userEmail.toLowerCase().trim()}`
    : null;

  useEffect(() => {
    if (status !== "authenticated" || !userEmail || !stableUserId) {
      initializedEmailRef.current = null;
      return;
    }
    if (initializedEmailRef.current === userEmail) return;
    initializedEmailRef.current = userEmail;

    let cancelled = false;

    const hydrateAndMergeFromCloud = async () => {
      isHydratingRef.current = true;
      await waitForStoreHydration();
      if (cancelled) return;

      setSyncStatus("syncing");

      try {
        // 1. Chuyển ngay tài khoản cục bộ ("m1") sang stableUserId & cập nhật tên Google để UI hiển thị đúng tức thì
        useAppStore.getState().migrateCurrentUserId(stableUserId, {
          name: session?.user?.name || undefined,
          avatar: session?.user?.name?.charAt(0).toUpperCase(),
        });

        const localState = useAppStore.getState();

        const res = await fetch("/api/personal");
        if (!res.ok) throw new Error("Failed to fetch cloud data");
        const json = await res.json();
        if (cancelled) return;

        if (json.data) {
          const cloudMembers = (json.data.members || []) as Member[];
          const cloudInvoices = (json.data.invoices || []) as Invoice[];
          const cloudHostId = json.data.currentUserId as string | undefined;

          // Tập hợp tất cả ID cũ từng đại diện cho chủ tài khoản ("m1", UUID ngẫu nhiên trước đây, stableUserId)
          const legacyHostIds = new Set<string>(["m1", stableUserId]);
          if (cloudHostId) legacyHostIds.add(cloudHostId);
          for (const m of cloudMembers) {
            if (UUID_V4_REGEX.test(m.id)) {
              legacyHostIds.add(m.id);
            }
          }

          // Gom thông tin của chủ tài khoản từ các bản ghi trùng thành 1 bản ghi duy nhất
          const allHostCandidates = [
            ...cloudMembers.filter((m) => legacyHostIds.has(m.id)),
            ...localState.members.filter((m) => legacyHostIds.has(m.id)),
          ];

          const customNamedHost = allHostCandidates.find(
            (m) => !isDefaultName(m.name)
          );
          const hostWithBank = allHostCandidates.find(
            (m) => m.accountNumber || m.bankName
          );

          const resolvedName =
            customNamedHost?.name ||
            session?.user?.name ||
            "Bạn (Host)";

          const unifiedHostMember: Member = {
            id: stableUserId,
            name: resolvedName,
            avatar: resolvedName.charAt(0).toUpperCase() || "H",
            ...(hostWithBank?.accountNumber
              ? { accountNumber: hostWithBank.accountNumber }
              : {}),
            ...(hostWithBank?.bankName
              ? { bankName: hostWithBank.bankName }
              : {}),
          };

          // Giữ lại các thành viên khác (bạn bè) không bị trùng
          const otherMembersMap = new Map<string, Member>();
          for (const m of [...cloudMembers, ...localState.members]) {
            if (!legacyHostIds.has(m.id) && !otherMembersMap.has(m.id)) {
              otherMembersMap.set(m.id, m);
            }
          }

          const cleanMembers: Member[] = [
            unifiedHostMember,
            ...Array.from(otherMembersMap.values()),
          ];

          // Chuẩn hóa lại ID chủ tài khoản trong toàn bộ hóa đơn (Cloud + Local)
          const normalizeInvoice = (inv: Invoice): Invoice => ({
            ...inv,
            paidByMemberId: legacyHostIds.has(inv.paidByMemberId)
              ? stableUserId
              : inv.paidByMemberId,
            items: inv.items.map((item) => ({
              ...item,
              assignedMemberIds: Array.from(
                new Set(
                  item.assignedMemberIds.map((id) =>
                    legacyHostIds.has(id) ? stableUserId : id
                  )
                )
              ),
            })),
          });

          const mergedInvoicesMap = new Map<string, Invoice>();
          for (const inv of cloudInvoices) {
            mergedInvoicesMap.set(inv.id, normalizeInvoice(inv));
          }
          for (const inv of localState.invoices) {
            if (!mergedInvoicesMap.has(inv.id)) {
              mergedInvoicesMap.set(inv.id, normalizeInvoice(inv));
            }
          }

          const cleanInvoices = Array.from(mergedInvoicesMap.values()).sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          useAppStore.getState().importData({
            currentUserId: stableUserId,
            members: cleanMembers,
            invoices: cleanInvoices,
          });

          // Ghi đè bản đã dọn sạch trùng lặp lên MongoDB
          await fetch("/api/personal", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              currentUserId: stableUserId,
              members: cleanMembers,
              invoices: cleanInvoices,
            }),
          });
        } else {
          await fetch("/api/personal", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              currentUserId: localState.currentUserId,
              members: localState.members,
              invoices: localState.invoices,
            }),
          });
        }

        if (!cancelled) setSyncStatus("synced");
      } catch {
        if (!cancelled) setSyncStatus("error");
      } finally {
        isHydratingRef.current = false;
      }
    };

    void hydrateAndMergeFromCloud();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.name, status, stableUserId, userEmail]);

  // Lắng nghe thay đổi ở máy và lưu ngầm lên MongoDB sau 800ms
  useEffect(() => {
    if (status !== "authenticated" || !userEmail) return;

    const unsubscribe = useAppStore.subscribe((state, prevState) => {
      if (isHydratingRef.current) return;

      const hasChanged =
        state.invoices !== prevState.invoices ||
        state.members !== prevState.members ||
        state.currentUserId !== prevState.currentUserId;

      if (!hasChanged) return;

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      setSyncStatus("syncing");
      debounceTimerRef.current = setTimeout(async () => {
        try {
          const res = await fetch("/api/personal", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              currentUserId: state.currentUserId,
              members: state.members,
              invoices: state.invoices,
            }),
          });
          setSyncStatus(res.ok ? "synced" : "error");
        } catch {
          setSyncStatus("error");
        }
      }, 800);
    });

    return () => {
      unsubscribe();
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [status, userEmail]);

  return (
    <SyncStatusContext.Provider value={syncStatus}>
      {children}
    </SyncStatusContext.Provider>
  );
};

export const CloudSyncProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SessionProvider>
      <PersonalCloudSyncManager>{children}</PersonalCloudSyncManager>
    </SessionProvider>
  );
};