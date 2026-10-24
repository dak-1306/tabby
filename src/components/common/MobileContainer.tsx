"use client";

import React from "react";

interface MobileContainerProps {
  children: React.ReactNode;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
}) => {
  return (
    <div className="h-dvh w-full bg-[#090d16] text-foreground flex justify-center items-center font-sans antialiased selection:bg-primary/20 overflow-hidden">
      {/* Desktop Frame Mockup */}
      <div className="w-full max-w-md h-dvh md:h-[840px] md:max-h-[90vh] bg-background md:rounded-[44px] md:border-[8px] md:border-slate-800 md:shadow-2xl md:shadow-primary/10 relative flex flex-col overflow-hidden">
        {/* Dynamic Island / Dynamic Notch (Chỉ hiện trên Desktop) */}
        <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 h-6 w-28 bg-slate-800 rounded-b-2xl z-50 items-center justify-center pointer-events-none">
          <div className="size-2.5 rounded-full bg-slate-950 mr-2" />
          <div className="size-2 rounded-full bg-emerald-900/40" />
        </div>

        {/* Viewport Container */}
        <div className="flex-1 flex flex-col h-full w-full overflow-hidden relative pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] bg-background">
          {children}
        </div>
      </div>
    </div>
  );
};
