"use client";

import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterTabOption<T extends string = string> {
  id: T;
  label: string;
}

interface SearchFilterBarProps<T extends string = string> {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  placeholder: string;
  activeTab: T;
  onTabChange: (tabId: T) => void;
  tabs: FilterTabOption<T>[];
}

export function SearchFilterBar<T extends string = string>({
  searchQuery,
  onSearchChange,
  placeholder,
  activeTab,
  onTabChange,
  tabs,
}: SearchFilterBarProps<T>) {
  return (
    <div className="space-y-3">
      {/* Ô tìm kiếm */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[44px] pl-10 pr-4 py-2 bg-card border border-border/60 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
        />
      </div>

      {/* Thanh Tab lọc */}
      <div className="flex items-center gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 min-h-[44px] py-2 px-3 rounded-xl text-xs font-semibold transition-all active:scale-95 border",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-card/80 text-muted-foreground border-border/50 hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
