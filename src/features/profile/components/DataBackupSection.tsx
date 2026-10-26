"use client";

import React, { useRef } from "react";
import { StorageStats } from "../types";
import { PROFILE_TEXTS } from "../constants";
import { Button } from "@/components/ui/button";
import { HardDrive } from "lucide-react";

interface DataBackupSectionProps {
  storageStats: StorageStats;
  onExport: () => void;
  onImport: (file: File) => void;
}

export const DataBackupSection: React.FC<DataBackupSectionProps> = ({
  storageStats,
  onExport,
  onImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = "";
    }
  };

  return (
    <section className="space-y-3 bg-card border border-border/60 p-4 rounded-2xl">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <HardDrive className="size-4 text-primary" />
        <span>{PROFILE_TEXTS.SECTION_BACKUP_TITLE}</span>
      </div>

      <div className="space-y-2.5 pt-1">
        <Button
          variant="outline"
          size="lg"
          onClick={onExport}
          className="w-full min-h-[44px] justify-start text-xs font-semibold"
        >
          {PROFILE_TEXTS.EXPORT_BTN}
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        <Button
          variant="outline"
          size="lg"
          onClick={() => fileInputRef.current?.click()}
          className="w-full min-h-[44px] justify-start text-xs font-semibold"
        >
          {PROFILE_TEXTS.IMPORT_BTN}
        </Button>

        {/* Thanh dung lượng bộ nhớ */}
        <div className="p-3 bg-muted/30 rounded-xl space-y-1.5 border border-border/40">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground">
              {PROFILE_TEXTS.STORAGE_USAGE_LABEL}
            </span>
            <span className="font-bold text-foreground">
              {storageStats.usedKb} KB
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${Math.max(3, storageStats.percent)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
