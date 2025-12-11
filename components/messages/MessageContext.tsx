"use client";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

type Summary = { unread: number };
type Ctx = {
  unreadCount: number;
  isAuthenticated: boolean;
  setAuthenticated: (v: boolean) => void;
};

const MessageCtx = createContext<Ctx | null>(null);

const readAllLocal = (): number => {
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith("msg:"));
    let count = 0;
    keys.forEach((k) => {
      const arr = JSON.parse(localStorage.getItem(k) || "[]");
      if (Array.isArray(arr)) {
        arr.forEach((m: any) => { if (m && m.sender !== "Me" && m.status !== "read") count += 1; });
      }
    });
    return count;
  } catch { return 0; }
};

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [unread, setUnread] = useState<number>(0);
  const [isAuthenticated, setAuthenticated] = useState<boolean>(() => {
    try { return !!localStorage.getItem("auth:user"); } catch { return true; }
  });
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let opened = false;
    try {
      wsRef.current = new WebSocket("ws://localhost:3002/ws/summary");
      wsRef.current.onopen = () => { opened = true; };
      wsRef.current.onmessage = (ev) => {
        try { const data: Summary = JSON.parse(ev.data); if (typeof data.unread === "number") setUnread(data.unread); } catch {}
      };
      wsRef.current.onclose = () => {};
      wsRef.current.onerror = () => {};
    } catch {}
    const poll = window.setInterval(() => { if (!opened) setUnread(readAllLocal()); }, 4000);
    setUnread(readAllLocal());
    return () => { window.clearInterval(poll); wsRef.current?.close(); };
  }, []);

  const value = useMemo<Ctx>(() => ({ unreadCount: unread, isAuthenticated, setAuthenticated }), [unread, isAuthenticated]);
  return <MessageCtx.Provider value={value}>{children}</MessageCtx.Provider>;
}

export function useMessage() {
  const ctx = useContext(MessageCtx);
  if (!ctx) throw new Error("useMessage must be used within MessageProvider");
  return ctx;
}

