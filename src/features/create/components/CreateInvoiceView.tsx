"use client";

import React, { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { useCreateInvoice } from "../hooks/useCreateInvoice";
import { MemberSelector } from "./MemberSelector";
import { ItemInputRow } from "./ItemInputRow";
import { LiveReceiptPreview } from "./LiveReceiptPreview";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { CREATE_TEXTS } from "../constants";

const CreateInvoiceForm: React.FC = () => {
  const {
    form,
    title,
    items,
    isEditMode,
    fields,
    allMembers,
    selectedMemberIds,
    selectedMembers,
    breakdowns,
    handleToggleMember,
    handleAddNewMember,
    handleUpdateMember,
    handleAddItem,
    handleRemoveItem,
    handleSubmit,
    handleNextRow,
  } = useCreateInvoice();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="flex-1 min-h-0 flex flex-col w-full overflow-hidden">
      {/* Vùng cuộn nội dung form chính */}
      <main className="flex-1 min-h-0 overflow-y-auto px-4 py-4 scrollbar-none space-y-5">
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

        <MemberSelector
          allMembers={allMembers}
          selectedMemberIds={selectedMemberIds}
          onToggleMember={handleToggleMember}
          onAddNewMember={handleAddNewMember}
          onUpdateMember={handleUpdateMember}
        />

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

        <LiveReceiptPreview
          title={title}
          items={items}
          selectedMembers={selectedMembers}
          breakdowns={breakdowns}
        />
      </main>

      {/* Action Footer - Đứng cố định ở đáy theo luồng Flexbox */}
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

export const CreateInvoiceView: React.FC = () => {
  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground relative overflow-hidden">
      <Header />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center p-4 text-xs text-muted-foreground">
            Đang tải...
          </div>
        }
      >
        <CreateInvoiceForm />
      </Suspense>
    </div>
  );
};