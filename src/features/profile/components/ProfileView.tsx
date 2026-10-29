"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { useProfileSettings } from "../hooks/useProfileSettings";
import { UserProfileSection } from "./UserProfileSection";
import { ThemeSection } from "./ThemeSection";
import { DataBackupSection } from "./DataBackupSection";
import { DangerZoneSection } from "./DangerZoneSection";
import { PROFILE_TEXTS } from "../constants";

export const ProfileView: React.FC = () => {
  const {
    form,
    isSaved,
    isBankDrawerOpen,
    setIsBankDrawerOpen,
    storageStats,
    handleSave,
    handleExportData,
    handleImportData,
    handleResetApp,
  } = useProfileSettings();

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground relative overflow-hidden">
      <Header />

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24 scrollbar-none space-y-4">
        <UserProfileSection
          form={form}
          onSave={handleSave}
          isSaved={isSaved}
          isBankDrawerOpen={isBankDrawerOpen}
          setIsBankDrawerOpen={setIsBankDrawerOpen}
        />

        <ThemeSection />

        <DataBackupSection
          storageStats={storageStats}
          onExport={handleExportData}
          onImport={handleImportData}
        />

        <DangerZoneSection onReset={handleResetApp} />

        <div className="text-center pt-2 pb-1">
          <span className="text-[11px] text-muted-foreground font-medium tracking-wide">
            {PROFILE_TEXTS.APP_VERSION_FOOTER}
          </span>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
