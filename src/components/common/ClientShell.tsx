"use client";

import React, { useState, useSyncExternalStore } from "react";
import { SplashScreen } from "./SplashScreen";

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export const ClientShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isMounted = useIsMounted();
  const [showSplash, setShowSplash] = useState(true);

  if (!isMounted) {
    return <SplashScreen onFinish={() => {}} forceVisible />;
  }

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      {children}
    </>
  );
};
