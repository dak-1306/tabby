"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { useCreateInvoice } from "../hooks/useCreateInvoice";
import { MemberSelector } from "./MemberSelector";
import { ItemInputRow } from "./ItemInputRow";
import { LiveReceiptPreview } from "./LiveReceiptPreview";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { CREATE_TEXTS } from "../constants";

export const CreateInvoiceView: React.FC = () => {
  const {
    title,
    setTitle,
    allMembers,
    selectedMemberIds,
    selectedMembers,
    items,
    breakdowns,
    handleToggleMember,
    handleAddNewMember,
    handleAddItem,
    handleUpdateItem,
    handleRemoveItem,
    handleSubmit,
  } = useCreateInvoice();

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground relative overflow-hidden">
      <Header />

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-32 scrollbar-none space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {CREATE_TEXTS.TITLE_LABEL}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={CREATE_TEXTS.TITLE_PLACEHOLDER}
            className="w-full min-h-[44px] px-3.5 py-2.5 bg-card border border-border/60 rounded-xl text-xs font-bold focus:outline-none focus:border-primary/60"
          />
        </div>

        <MemberSelector
          allMembers={allMembers}
          selectedMemberIds={selectedMemberIds}
          onToggleMember={handleToggleMember}
          onAddNewMember={handleAddNewMember}
        />

        <div className="space-y-2.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            {CREATE_TEXTS.ITEMS_SECTION_TITLE}
          </label>
          {items.map((item) => (
            <ItemInputRow
              key={item.id}
              item={item}
              members={selectedMembers}
              onUpdate={handleUpdateItem}
              onRemove={() => handleRemoveItem(item.id)}
            />
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="w-full py-2.5 border border-dashed border-primary/50 text-primary text-xs font-bold rounded-xl hover:bg-primary/10 min-h-[44px] flex items-center justify-center gap-1.5"
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

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-background/95 backdrop-blur-md border-t border-border/60 z-30">
        <Button
          size="lg"
          className="w-full min-h-[48px] font-bold text-sm gap-2 shadow-md"
          onClick={handleSubmit}
        >
          <Check className="size-5" />
          {CREATE_TEXTS.SUBMIT_BTN}
        </Button>
      </div>
    </div>
  );
};
