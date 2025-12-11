"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, DotsIcon, SearchIcon, XIcon, PlusIcon, PaperClipIcon } from "../../../components/icons";

type Msg = { id: string; chatId: string; sender: string; content: string; ts: number; status: "sending" | "sent" | "delivered" | "read"; type?: "text" | "image" | "file" };

const ls = {
  get: (key: string) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (key: string, val: unknown) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
};

export default function ChatScreen() {
  const router = useRouter();
  const params = useParams<{ chatId: string }>();
  const sp = useSearchParams();
  const chatId = String(params?.chatId || "padi");
  const name = sp.get("name") || "Chat";
  const [online, setOnline] = useState(true);
  const [messages, setMessages] = useState<Msg[]>(() => ls.get(`msg:${chatId}`) || []);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const queueRef = useRef<Msg[]>([]);
  const [attachOpen, setAttachOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (Notification && Notification.permission === "default") Notification.requestPermission().catch(() => {});
  }, []);

  useEffect(() => {
    setMessages((prev) => {
      const next = prev.map((m: Msg) => (m.sender !== "Me" && m.status !== "read" ? { ...m, status: "read" as const } : m));
      ls.set(`msg:${chatId}`, next);
      return next;
    });
  }, [chatId]);

  useEffect(() => {
    let opened = false;
    try {
      wsRef.current = new WebSocket(`ws://localhost:3002/ws/chat/${chatId}`);
      wsRef.current.onopen = () => { opened = true; setOnline(true); const q = ls.get(`queue:${chatId}`) || []; q.forEach((m: Msg) => wsRef.current?.send(JSON.stringify(m))); ls.set(`queue:${chatId}`, []); };
      wsRef.current.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === "typing") setTyping(true);
          if (msg.type === "message") {
            const m: Msg = { id: String(Date.now()), chatId, sender: name, content: String(msg.content || ""), ts: Date.now(), status: "delivered" };
            setMessages((prev) => { const next = [...prev, m]; ls.set(`msg:${chatId}`, next); return next; });
            if (Notification && Notification.permission === "granted") new Notification(name, { body: m.content });
            setTimeout(() => setTyping(false), 1200);
          }
        } catch {}
      };
      wsRef.current.onclose = () => setOnline(false);
      wsRef.current.onerror = () => setOnline(false);
    } catch { setOnline(false); }
    if (!opened) {
      const sim = window.setInterval(() => {
        setTyping(true);
        setTimeout(() => {
          const m: Msg = { id: String(Date.now()), chatId, sender: name, content: "Okay", ts: Date.now(), status: "delivered" };
          setMessages((prev) => { const next = [...prev, m]; ls.set(`msg:${chatId}`, next); return next; });
          setTyping(false);
          if (Notification && Notification.permission === "granted") new Notification(name, { body: m.content });
        }, 1200);
      }, 15000);
      return () => window.clearInterval(sim);
    }
    return () => wsRef.current?.close();
  }, [chatId, name]);

  const send = (payload: { text?: string; file?: File }) => {
    const content = payload.text ?? (payload.file ? payload.file.name : "");
    if (!content.trim()) return;
    const m: Msg = { id: String(Date.now()), chatId, sender: "Me", content, ts: Date.now(), status: "sending", type: payload.file ? "file" : "text" };
    setMessages((prev) => { const next = [...prev, m]; ls.set(`msg:${chatId}`, next); return next; });
    try { wsRef.current?.send(JSON.stringify({ type: "message", content })); m.status = "sent"; setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, status: "sent" } : x))); } catch { const q = ls.get(`queue:${chatId}`) || []; ls.set(`queue:${chatId}`, [...q, m]); }
    setTimeout(() => setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, status: "delivered" } : x))), 800);
    setTimeout(() => setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, status: "read" } : x))), 1600);
    setInput("");
  };

  const view = useMemo(() => messages.sort((a, b) => a.ts - b.ts), [messages]);

  return (
    <div className="min-h-screen bg-[var(--color-surface-muted)]">
      <div className="relative h-[220px] w-full overflow-hidden">
        <div className="absolute inset-x-0 top-0 flex h-[56px] items-center justify-between px-4">
          <button onClick={() => router.back()} className="flex h-9 w-9 items-center justify-center rounded-full bg-black/10">
            <ArrowLeft />
          </button>
          <div className="flex items-center gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-black/10">
              <SearchIcon />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-black/10">
              <DotsIcon />
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[720px] px-4">
        <div className="-mt-10 flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[12px] font-semibold">{name.split(" ").map((p) => p[0]).slice(0,2).join("")}</div>
            <div>
              <div className="text-[14px] font-semibold text-[var(--color-text)]">{name}</div>
              <div className="text-[12px] text-[var(--color-text-muted)]">{online ? "Online" : "Offline"}</div>
            </div>
          </div>
          <button onClick={() => router.push("/messages")} className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1 text-[12px]">Messages</button>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {view.map((m) => (
            <div key={m.id} className={`max-w-[80%] rounded-2xl px-3 py-2 text-[13px] ${m.sender === "Me" ? "self-end bg-[#4369e3] text-white" : "self-start bg-[#eef2f7] text-[var(--color-text)]"}`}>
              <div>{m.content}</div>
              <div className="mt-1 flex items-center gap-1 text-[10px] opacity-80">
                <span>{new Date(m.ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
                <span>•</span>
                <span>{m.status}</span>
              </div>
            </div>
          ))}
          {typing && <div className="self-start rounded-2xl bg-[#eef2f7] px-3 py-2 text-[13px] text-[var(--color-text-muted)]">Typing…</div>}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <div className="mx-auto max-w-[720px] px-4 py-3">
          <div className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-3 py-2">
            <button onClick={() => setAttachOpen((v) => !v)} className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white">
              <PaperClipIcon />
            </button>
            <input value={input} onChange={(e) => setInput(e.target.value)} className="w-full bg-transparent text-[14px] outline-none" placeholder="Message" />
            <button onClick={() => send({ text: input })} className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-green)] text-white">
              <PlusIcon />
            </button>
          </div>
          {attachOpen && (
            <div className="mt-2 flex items-center gap-2">
              <input ref={fileRef} type="file" className="text-[12px]" onChange={(e) => { const f = e.target.files?.[0]; if (f) send({ file: f }); setAttachOpen(false); }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
