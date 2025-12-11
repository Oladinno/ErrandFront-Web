"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SearchIcon, DotIcon } from "../../components/icons";

type ChatRow = { id: string; name: string; subtitle: string; unread?: number; time: string; type: "store" | "person" | "bot" };

export default function MessagesPage() {
  const [query, setQuery] = useState("");
  const chats = useMemo<ChatRow[]>(
    () => [
      { id: "padi", name: "Padi", subtitle: "I'd be happy to help you…", unread: 1, time: "9:07pm", type: "bot" },
      { id: "foodcourt", name: "Food Court", subtitle: "Expecting!!!", time: "9:07pm", type: "store" },
      { id: "johnson", name: "Johnson Richard", subtitle: "I am on my way with your order", time: "9:07pm", type: "person" },
      { id: "peter", name: "Peter Terfa", subtitle: "I have gotten all your plumbing items", time: "9:07pm", type: "person" }
    ],
    []
  );
  const filtered = chats.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.subtitle.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => { if (Notification && Notification.permission === "default") Notification.requestPermission().catch(() => {}); }, []);
  return (
    <div className="min-h-screen bg-[var(--color-surface-muted)]">
      <div className="mx-auto max-w-[720px] px-4 py-4">
        <div className="text-center text-[16px] font-semibold text-[var(--color-text)]">Messages</div>
        <div className="mt-3 flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-3 py-2">
          <SearchIcon size={16} color="#6b7280" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full bg-transparent text-[14px] outline-none" placeholder="Search messages…" />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="rounded-full bg-black px-2 py-1 text-[12px] font-semibold text-white">All ({chats.length})</span>
          <span className="rounded-full border border-[var(--color-border)] bg-white px-2 py-1 text-[12px] text-[var(--color-text)]">Stores</span>
          <span className="rounded-full border border-[var(--color-border)] bg-white px-2 py-1 text-[12px] text-[var(--color-text)]">People</span>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 text-center text-[12px] text-[var(--color-text-muted)]">No messages found</div>
          )}
          {filtered.map((c) => (
            <Link key={c.id} href={`/messages/${c.id}?name=${encodeURIComponent(c.name)}&type=${c.type}`} className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-white p-3 shadow-[0_2px_10px_rgba(10,14,18,0.05)]">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[12px] font-semibold">{c.name.split(" ").map((p) => p[0]).slice(0,2).join("")}</div>
                <div>
                  <div className="text-[14px] font-semibold text-[var(--color-text)]">{c.name}</div>
                  <div className="text-[12px] text-[var(--color-text-muted)]">{c.subtitle}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {c.unread ? <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-green)] text-[11px] font-semibold text-white">{c.unread}</span> : null}
                <div className="text-[12px] text-[var(--color-text-muted)]">{c.time}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
