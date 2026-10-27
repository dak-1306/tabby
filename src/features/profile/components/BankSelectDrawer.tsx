"use client";

import React, { useState } from "react";
import { VIETNAM_BANKS } from "@/constants/banks";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Search, Check } from "lucide-react";

interface BankSelectDrawerProps {
  open: boolean;
  selectedBank?: string;
  onSelect: (bankShortName: string) => void;
  onClose: () => void;
}

export const BankSelectDrawer: React.FC<BankSelectDrawerProps> = ({
  open,
  selectedBank,
  onSelect,
  onClose,
}) => {
  const [search, setSearch] = useState("");

  const filteredBanks = VIETNAM_BANKS.filter(
    (b) =>
      b.shortName.toLowerCase().includes(search.toLowerCase()) ||
      b.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Drawer open={open} onOpenChange={(val) => !val && onClose()}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle className="text-base font-bold">
            Chọn ngân hàng nhận tiền
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-2 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên ngân hàng..."
              className="pl-9"
            />
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1 pr-1 scrollbar-none">
            {filteredBanks.map((bank) => {
              const isSelected = selectedBank === bank.shortName;
              return (
                <button
                  key={bank.code}
                  type="button"
                  onClick={() => {
                    onSelect(bank.shortName);
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-xl border border-border/40 bg-card hover:bg-muted/40 flex items-center justify-between text-left transition-colors min-h-[44px]"
                >
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      {bank.shortName}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {bank.fullName}
                    </p>
                  </div>
                  {isSelected && <Check className="size-4 text-primary" />}
                </button>
              );
            })}
          </div>

          <DrawerClose
            render={
              <Button
                variant="ghost"
                className="w-full min-h-[44px]"
                onClick={onClose}
              />
            }
          >
            Đóng
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
