import { useState, useEffect, useMemo } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { UserProfileFormData, StorageStats } from "../types";
import { STORAGE_KEY } from "@/constants";

export const useProfileSettings = () => {
  const {
    members,
    currentUserId,
    updateCurrentUserProfile,
    importData,
    resetData,
  } = useAppStore();

  const currentUser = useMemo(
    () => members.find((m) => m.id === currentUserId),
    [members, currentUserId],
  );

  const [formData, setFormData] = useState<UserProfileFormData>({
    name: currentUser?.name || "",
    bankName: currentUser?.bankName || "",
    accountNumber: currentUser?.accountNumber || "",
  });

  const [isSaved, setIsSaved] = useState(false);
  const [storageStats, setStorageStats] = useState<StorageStats>({
    usedKb: "0.00",
    percent: 0,
  });

  const calculateStorageSize = () => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(STORAGE_KEY) || "";
    const bytes = new Blob([raw]).size;
    const kb = (bytes / 1024).toFixed(2);
    const maxKb = 5120; // ~5MB localStorage
    const percent = Math.min(100, Math.round((bytes / (maxKb * 1024)) * 100));
    setStorageStats({ usedKb: kb, percent });
  };

  useEffect(() => {
    calculateStorageSize();
  }, [members]);

  const handleSaveProfile = () => {
    updateCurrentUserProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportData = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const a = document.createElement("a");
    a.href = url;
    a.download = `tabby_backup_${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const parsedState = json?.state || json;
        if (parsedState?.members && parsedState?.invoices) {
          importData(parsedState);
          calculateStorageSize();
        }
      } catch {
        alert("File sao lưu không đúng định dạng JSON!");
      }
    };
    reader.readAsText(file);
  };

  const handleResetApp = () => {
    resetData();
    calculateStorageSize();
  };

  return {
    formData,
    setFormData,
    isSaved,
    storageStats,
    handleSaveProfile,
    handleExportData,
    handleImportData,
    handleResetApp,
  };
};
