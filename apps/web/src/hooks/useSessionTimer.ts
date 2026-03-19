"use client";

import { useEffect, useMemo, useState } from "react";

export function useSessionTimer(expiresAt: string | null | undefined) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt) {
      return;
    }
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, [expiresAt]);

  return useMemo(() => {
    if (!expiresAt) {
      return {
        timeRemainingSeconds: null,
        label: null,
        warning: false,
        expired: false,
      };
    }

    const remainingSeconds = Math.max(Math.floor((new Date(expiresAt).getTime() - now) / 1000), 0);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const label = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} remaining`;

    return {
      timeRemainingSeconds: remainingSeconds,
      label,
      warning: remainingSeconds > 0 && remainingSeconds <= 600,
      expired: remainingSeconds === 0,
    };
  }, [expiresAt, now]);
}
