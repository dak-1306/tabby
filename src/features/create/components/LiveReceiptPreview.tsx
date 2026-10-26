"use client";

import React from "react";
import { DraftItem, MemberSplitBreakdown } from "../types";
import { Member } from "@/types";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { CREATE_TEXTS } from "../constants";
import { CURRENCY_SYMBOL, LOCALE_VI } from "@/constants";

interface LiveReceiptPreviewProps {
  title: string;
  items: DraftItem[];
  selectedMembers: Member[];
  breakdowns: MemberSplitBreakdown[];
}

export const LiveReceiptPreview: React.FC<LiveReceiptPreviewProps> = ({
  title,
  items,
  selectedMembers,
  breakdowns,
}) => {
  const totalAmount = items.reduce((sum, i) => sum + (i.price || 0), 0);

  return (
    <div className="bg-card border-2 border-dashed border-primary/30 rounded-2xl p-4 space-y-4 shadow-xs relative overflow-hidden">
      {/* Header Hóa đơn giấy */}
      <div className="text-center space-y-1 pb-3 border-b border-border/60">
        <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
          {CREATE_TEXTS.LIVE_PREVIEW_TITLE}
        </span>
        <h2 className="text-sm font-extrabold text-foreground truncate">
          {title || CREATE_TEXTS.TITLE_PLACEHOLDER}
        </h2>
      </div>

      {/* Danh sách món */}
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="text-xs space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-foreground">
                {item.name || "Món chưa tên"}
              </span>
              <span className="text-primary font-bold">
                {(item.price || 0).toLocaleString(LOCALE_VI)} {CURRENCY_SYMBOL}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {item.assignedMemberIds.map((mId) => {
                const member = selectedMembers.find((m) => m.id === mId);
                if (!member) return null;
                return (
                  <MemberAvatar
                    key={mId}
                    name={member.name}
                    fallbackText={member.avatar}
                    size="xs"
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Tổng tiền & Bảng chia mỗi người */}
      <div className="pt-3 border-t border-border/60 space-y-2.5">
        <div className="flex justify-between items-center text-xs font-bold">
          <span>TỔNG CỘNG:</span>
          <span className="text-sm text-primary">
            {totalAmount.toLocaleString(LOCALE_VI)} {CURRENCY_SYMBOL}
          </span>
        </div>

        <div className="space-y-1.5 pt-1">
          {breakdowns.map((b) => (
            <div
              key={b.memberId}
              className="flex items-center justify-between text-xs bg-muted/30 p-2 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <MemberAvatar
                  name={b.memberName}
                  fallbackText={b.memberAvatar}
                  size="xs"
                />
                <span className="font-semibold text-foreground">
                  {b.memberName}
                </span>
              </div>
              <span className="font-bold text-primary">
                {Math.round(b.amountOwed).toLocaleString(LOCALE_VI)}{" "}
                {CURRENCY_SYMBOL}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
