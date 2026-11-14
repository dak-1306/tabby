"use client";

import React, { Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Check, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { MemberSelector } from "@/features/create/components/MemberSelector";
import { ItemInputRow } from "@/features/create/components/ItemInputRow";
import { LiveReceiptPreview } from "@/features/create/components/LiveReceiptPreview";
import { CREATE_TEXTS, GROUP_DETAIL_TEXTS, GROUP_ROUTES } from "@/constants";
import { Group } from "@/types/group";
import { useGroupSession } from "../hooks/useGroupSession";
import { useGroupCreateInvoice } from "../hooks/useGroupCreateInvoice";
import { cn } from "@/utils/utils";

interface InnerFormProps {
  group: Group;
  defaultPayerId: string;
  editBillId: string | null;
}

const GroupInvoiceFormInner: React.FC<InnerFormProps> = ({
  group,
  defaultPayerId,
  editBillId,
}) => {
  const router = useRouter();
  const {
    form,
    isEditMode,
    fields,
    paidByMemberId,
    setPaidByMemberId,
    allMembers,
    selectedMemberIds,
    selectedMembers,
    breakdowns,
    handleToggleMember,
    handleAddNewMember,
    handleUpdateMember,
    handleAddItem,
    handleRemoveItem,
    handleNextRow,
    handleSubmit,
  } = useGroupCreateInvoice({
    group,
    defaultPayerId,
    editBillId,
  });

  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const title = watch("title");
  const items = watch("items");

  return (
    <div className="flex-1 min-h-0 flex flex-col w-full overflow-hidden">
      {/* Header */}
      <header className="shrink-0 px-4 py-3 bg-background/95 backdrop-blur-md border-b border-border/60 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => router.push(GROUP_ROUTES.DETAIL(group.id))}
          className="size-9 rounded-xl border border-border/60 flex items-center justify-center hover:bg-muted shrink-0"
          aria-label="Quay lại nhóm"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div className="min-w-0">
          <h1 className="text-sm font-extrabold truncate">
            {isEditMode ? "Sửa bill nhóm" : "Thêm bill nhóm mới"}
          </h1>
          <p className="text-[11px] text-muted-foreground truncate">
            Nhóm: {group.name}
          </p>
        </div>
      </header>

      {/* Nội dung Form */}
      <main className="flex-1 min-h-0 overflow-y-auto px-4 py-4 scrollbar-none space-y-5">
        {/* Bộ chọn Người thanh toán (Điểm khác biệt cốt lõi của Bill Nhóm) */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-primary/5 border border-primary/25">
          <label className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Wallet className="size-3.5" />
            {GROUP_DETAIL_TEXTS.PAYER_LABEL}
          </label>
          <div className="flex flex-wrap gap-2">
            {allMembers.map((m) => {
              const isPayer = m.id === paidByMemberId;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaidByMemberId(m.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-bold transition-all min-h-[40px] active:scale-95",
                    isPayer
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-card border-border/70 text-foreground hover:border-primary/50",
                  )}
                >
                  <MemberAvatar
                    name={m.name}
                    fallbackText={m.avatar}
                    size="xs"
                  />
                  <span>{m.name}</span>
                  {isPayer && <Check className="size-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tiêu đề hóa đơn */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {CREATE_TEXTS.TITLE_LABEL}
          </label>
          <Input
            {...register("title")}
            placeholder={CREATE_TEXTS.TITLE_PLACEHOLDER}
            className="font-bold"
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title && (
            <p className="text-[11px] text-destructive font-medium">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Thành viên tham gia */}
        <MemberSelector
          allMembers={allMembers}
          selectedMemberIds={selectedMemberIds}
          onToggleMember={handleToggleMember}
          onAddNewMember={handleAddNewMember}
          onUpdateMember={handleUpdateMember}
        />

        {/* Danh sách món */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            {CREATE_TEXTS.ITEMS_SECTION_TITLE}
          </label>
          {fields.map((field, index) => (
            <ItemInputRow
              key={field.id}
              index={index}
              form={form}
              members={selectedMembers}
              onRemove={() => handleRemoveItem(index)}
              onNextRow={() => handleNextRow(index)}
            />
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="w-full py-3 border border-dashed border-primary/50 text-primary text-xs font-bold rounded-xl hover:bg-primary/10 min-h-[44px] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="size-4" />
            {CREATE_TEXTS.ADD_ITEM_BTN}
          </button>
        </div>

        {/* Xem trước trực tiếp */}
        <LiveReceiptPreview
          title={title}
          items={items || []}
          selectedMembers={selectedMembers}
          breakdowns={breakdowns}
        />
      </main>

      {/* Footer Submit */}
      <footer className="shrink-0 w-full p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] bg-background/95 backdrop-blur-md border-t border-border/60 z-20">
        <Button
          size="lg"
          className="w-full min-h-[48px] font-bold text-sm gap-2 shadow-md"
          onClick={handleSubmit}
        >
          <Check className="size-5" />
          {isEditMode ? CREATE_TEXTS.SUBMIT_EDIT_BTN : CREATE_TEXTS.SUBMIT_BTN}
        </Button>
      </footer>
    </div>
  );
};

const GroupCreateContent: React.FC = () => {
  const params = useParams<{ groupId: string }>();
  const searchParams = useSearchParams();
  const editBillId = searchParams.get("edit");

  const { group, currentMember, isLoading } = useGroupSession(params.groupId);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
        Đang tải dữ liệu nhóm...
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-xs text-destructive">
        Không tìm thấy nhóm.
      </div>
    );
  }

  const defaultPayerId = currentMember?.id || group.members[0]?.id || "";

  return (
    <GroupInvoiceFormInner
      key={editBillId || "new"}
      group={group}
      defaultPayerId={defaultPayerId}
      editBillId={editBillId}
    />
  );
};

export const GroupCreateInvoiceView: React.FC = () => {
  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground relative overflow-hidden">
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
            Đang tải...
          </div>
        }
      >
        <GroupCreateContent />
      </Suspense>
    </div>
  );
};
