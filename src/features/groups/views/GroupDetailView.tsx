"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Share2, UserCheck, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { GROUP_DETAIL_TEXTS, GROUP_ROUTES, ROUTES } from "@/constants";
import { Invoice } from "@/types";
import { useGroupStore } from "@/stores/useGroupStore";
import { useGroupSession } from "../hooks/useGroupSession";
import {
  calculateGroupPairwiseDebts,
  PairwiseDebt,
} from "../utils/groupSettlement";
import { IdentityPickerDrawer } from "../components/IdentityPickerDrawer";
import { GroupInviteDrawer } from "../components/GroupInviteDrawer";
import { GroupSettlementCard } from "../components/GroupSettlementCard";
import { GroupSettlementDetailDrawer } from "../components/GroupSettlementDetailDrawer";
import { GroupInvoiceList } from "../components/GroupInvoiceList";
import { GroupInvoiceDetailDrawer } from "../components/GroupInvoiceDetailDrawer";

const GroupDetailContent: React.FC = () => {
  const params = useParams<{ groupId: string }>();
  const router = useRouter();
  const groupId = params.groupId;

  const {
    group,
    currentMember,
    isLoading,
    needsIdentity,
    isInAppBrowser,
    selectIdentity,
    joinAsNewMember,
    refreshGroup,
  } = useGroupSession(groupId);

  const settlePairDebt = useGroupStore((s) => s.settlePairDebt);
  const deleteGroupInvoice = useGroupStore((s) => s.deleteGroupInvoice);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isSwitchMemberOpen, setIsSwitchMemberOpen] = useState(false);
  const [selectedPairKey, setSelectedPairKey] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const pairwiseDebts = useMemo(
    () => (group ? calculateGroupPairwiseDebts(group) : []),
    [group],
  );

  const activePair: PairwiseDebt | null = useMemo(
    () =>
      selectedPairKey
        ? (pairwiseDebts.find((p) => p.pairKey === selectedPairKey) ?? null)
        : null,
    [pairwiseDebts, selectedPairKey],
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
        Đang tải dữ liệu nhóm...
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
        <AlertCircle className="size-10 text-destructive" />
        <h2 className="text-base font-extrabold">Không tìm thấy nhóm</h2>
        <p className="text-xs text-muted-foreground">
          Đường link có thể không chính xác hoặc nhóm chưa được đồng bộ trên
          thiết bị này.
        </p>
        <Button onClick={() => router.push(ROUTES.HOME)} className="font-bold">
          Về Trang chủ
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col w-full overflow-hidden">
      {/* Header Nhóm */}
      <header className="shrink-0 px-4 py-3 bg-background/95 backdrop-blur-md border-b border-border/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => router.push(ROUTES.HOME)}
            className="size-9 rounded-xl border border-border/60 flex items-center justify-center hover:bg-muted shrink-0"
            aria-label="Quay lại"
          >
            <ArrowLeft className="size-4" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-extrabold truncate">{group.name}</h1>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-primary/15 text-primary shrink-0">
                {group.code}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {group.members.length} thành viên • {group.invoices.length} hóa
              đơn
            </p>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setIsInviteOpen(true)}
          className="h-9 px-3 rounded-xl text-xs font-bold gap-1.5 shrink-0"
        >
          <Share2 className="size-3.5 text-primary" />
          Mời bạn
        </Button>
      </header>

      {/* Cảnh báo nhẹ nếu mở trong Zalo / Messenger WebView */}
      {isInAppBrowser && (
        <div className="shrink-0 px-4 py-2 bg-amber-500/15 border-b border-amber-500/30 text-[11px] text-amber-700 dark:text-amber-300 font-medium">
          Đang mở trong trình duyệt ứng dụng (Zalo/Messenger). Bấm dấu{" "}
          <strong>•••</strong> chọn <strong>Mở bằng trình duyệt</strong> để lưu
          nhóm lâu dài.
        </div>
      )}

      {/* Nội dung chính */}
      <main className="flex-1 overflow-y-auto px-4 py-4 scrollbar-none space-y-4">
        {/* Thanh xác nhận danh tính hiện tại */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-card border border-border/70">
          <div className="flex items-center gap-2.5 min-w-0">
            {currentMember ? (
              <>
                <MemberAvatar
                  name={currentMember.name}
                  fallbackText={currentMember.avatar}
                  size="xs"
                />
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">
                    Bạn đang tham gia với tên:
                  </p>
                  <p className="text-xs font-extrabold text-foreground truncate">
                    {currentMember.name}
                  </p>
                </div>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">
                Chưa chọn danh tính
              </span>
            )}
          </div>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setIsSwitchMemberOpen(true)}
            className="h-8 px-2.5 text-xs font-bold text-primary gap-1"
          >
            <UserCheck className="size-3.5" />
            Đổi tên
          </Button>
        </div>

        {/* Card Đối Soát Bù Trừ Chéo */}
        <GroupSettlementCard
          pairwiseDebts={pairwiseDebts}
          currentMemberId={currentMember?.id}
          onSelectPair={(pair) => setSelectedPairKey(pair.pairKey)}
        />

        {/* Danh sách Bill Nhóm */}
        <GroupInvoiceList
          invoices={group.invoices}
          members={group.members}
          currentMemberId={currentMember?.id}
          onSelectInvoice={(inv) => setSelectedInvoice(inv)}
        />
      </main>

      {/* Footer nút Thêm bill nhóm */}
      <footer className="shrink-0 w-full p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] bg-background/95 backdrop-blur-md border-t border-border/60">
        <Button
          type="button"
          size="lg"
          onClick={() => router.push(GROUP_ROUTES.CREATE_BILL(group.id))}
          className="w-full min-h-[48px] font-bold text-sm gap-2 shadow-md"
        >
          <Plus className="size-5" />
          {GROUP_DETAIL_TEXTS.BTN_ADD_BILL}
        </Button>
      </footer>

      {/* Các Drawer tương tác */}
      <IdentityPickerDrawer
        open={needsIdentity}
        groupName={group.name}
        members={group.members}
        allowDismiss={false}
        onSelectMember={selectIdentity}
        onJoinNewMember={joinAsNewMember}
      />

      <IdentityPickerDrawer
        open={isSwitchMemberOpen}
        groupName={group.name}
        members={group.members}
        currentMemberId={currentMember?.id}
        allowDismiss={true}
        onOpenChange={setIsSwitchMemberOpen}
        onSelectMember={(m) => {
          selectIdentity(m);
          setIsSwitchMemberOpen(false);
        }}
        onJoinNewMember={async (name) => {
          await joinAsNewMember(name);
          setIsSwitchMemberOpen(false);
        }}
      />

      <GroupInviteDrawer
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        group={group}
        onAddNewMember={async (name) => {
          await joinAsNewMember(name);
          await refreshGroup();
        }}
      />

      <GroupSettlementDetailDrawer
        groupName={group.name}
        pair={activePair}
        onClose={() => setSelectedPairKey(null)}
        onSettlePair={async (fromId, toId, amount) => {
          await settlePairDebt(group.id, fromId, toId, amount);
        }}
      />

      <GroupInvoiceDetailDrawer
        groupId={group.id}
        invoice={selectedInvoice}
        members={group.members}
        onClose={() => setSelectedInvoice(null)}
        onDeleteInvoice={async (invId) => {
          await deleteGroupInvoice(group.id, invId);
        }}
      />
    </div>
  );
};

export const GroupDetailView: React.FC = () => {
  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground relative overflow-hidden">
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
            Đang tải...
          </div>
        }
      >
        <GroupDetailContent />
      </Suspense>
    </div>
  );
};
