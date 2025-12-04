"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SidebarComponent from "../../components/Sidebar";
import { BellIcon, BikeIcon, CartIcon, ChevronRight, HamburgerIcon, ClockIcon, DotIcon, PlusIcon } from "../../components/icons";

export default function ActivityPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"food" | "services">("food");
  const [foodFilter, setFoodFilter] = useState("ongoing");
  const [jobFilter, setJobFilter] = useState("active");

  const foodOrders = useMemo(
    () =>
      [
        {
          id: 301,
          title: "Food Court",
          items: 3,
          total: "₦ 13,500",
          status: "Order is being prepared",
          imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop",
          fee: "₦ 1,300",
          time: "~15 mins",
        },
        {
          id: 302,
          title: "Food Court",
          items: 2,
          total: "₦ 9,500",
          status: "Order is on its way",
          imageUrl: "https://images.unsplash.com/photo-1604908554052-2f67c3bde2e4?q=80&w=600&auto=format&fit=crop",
          fee: "₦ 1,300",
          time: "~12 mins",
        },
      ],
    []
  );

  const [liveOrders, setLiveOrders] = useState(foodOrders);
  useEffect(() => {
    setLiveOrders(foodOrders);
  }, [foodOrders]);
  useEffect(() => {
    let opened = false;
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket("ws://localhost:3001/ws/activity");
      ws.onopen = () => { opened = true; };
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === "order_update" && msg.order) {
            setLiveOrders((prev) => {
              const idx = prev.findIndex((o: any) => String(o.id) === String(msg.order.id));
              if (idx >= 0) {
                const next = [...prev];
                next[idx] = { ...next[idx], ...msg.order };
                return next;
              }
              return [msg.order, ...prev];
            });
            if (Notification && Notification.permission === "granted" && msg.order.status) new Notification("Order update", { body: `${msg.order.status}` });
          }
        } catch {}
      };
    } catch {}
    if (Notification && Notification.permission === "default") Notification.requestPermission().catch(() => {});
    const sim = window.setInterval(() => {
      if (!opened) {
        setLiveOrders((prev) => prev.map((o) => (o.id === 302 ? { ...o, status: o.status === "Order is being prepared" ? "Order is on its way" : o.status } : o)));
      }
    }, 3000);
    return () => { window.clearInterval(sim); ws?.close(); };
  }, []);

  const jobs = useMemo(
    () =>
      [
        {
          id: 501,
          title: "Fix Leaking Kitchen Sink...",
          description: "Pipe under sink is leaking onto cabinet floor. Need quick fix.",
          category: "Plumbing",
          status: "Pending",
          offers: 12,
          assigned: undefined,
        },
        {
          id: 502,
          title: "Install new light fixtures in living room",
          description: "Need assistance installing 3 ceiling light fixtures.",
          category: "Electrical",
          status: "In Progress",
          offers: 5,
          assigned: "Johnson Smith",
        },
      ],
    []
  );

  return (
    <div className="min-h-screen bg-[var(--color-surface-muted)]">
      <SidebarComponent isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <header className="sticky top-0 z-30 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(true)} className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white">
              <HamburgerIcon />
            </button>
            <div className="ml-2 text-[16px] font-semibold text-[var(--color-text)]">Activity</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white">
              <CartIcon />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white">
              <BellIcon />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-8 px-4">
          <button onClick={() => setActiveTab("food")} className="pb-2 text-[14px] font-medium text-[var(--color-text)]">
            Food
            {activeTab === "food" && <span className="mt-2 block h-[3px] w-full rounded bg-[var(--color-green)]" />}
          </button>
          <button onClick={() => setActiveTab("services")} className="pb-2 text-[14px] font-medium text-[var(--color-text-muted)]">
            Services
            {activeTab === "services" && <span className="mt-2 block h-[3px] w-full rounded bg-[var(--color-green)]" />}
          </button>
        </div>
      </header>

      {activeTab === "food" && (
        <main className="px-4 pb-24">
          <div className="mt-4 flex gap-2">
            {[
              { key: "all", label: "All Orders" },
              { key: "ongoing", label: "Ongoing Orders (3)" },
              { key: "past", label: "Past Orders" },
            ].map((f) => (
              <button key={f.key} onClick={() => setFoodFilter(f.key)} className={`rounded-full border px-3 py-1 text-[12px] ${foodFilter === f.key ? "border-[var(--color-green)] bg-[var(--color-green)] text-white" : "border-[var(--color-border)] bg-white text-[var(--color-text)]"} shadow-[0_2px_8px_rgba(0,0,0,0.06)]`}>
                {f.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {liveOrders.map((o) => (
              <Link key={o.id} href={`/track/${o.id}`} className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-white p-3 shadow-[0_2px_10px_rgba(10,14,18,0.05)]">
                <div className="flex items-center gap-3">
                  <Image src={o.imageUrl} alt={o.title} width={88} height={88} unoptimized className="h-[56px] w-[56px] rounded-xl object-cover" />
                  <div>
                    <div className="text-[14px] font-semibold text-[var(--color-text)]">{o.title}</div>
                    <div className="mt-1 flex items-center gap-2 text-[12px] text-[var(--color-text-muted)]">
                      <BikeIcon />
                      <span>{o.fee}</span>
                      <DotIcon />
                      <ClockIcon />
                      <span>{o.time}</span>
                      <DotIcon />
                      <span>{o.items} items</span>
                      <DotIcon />
                      <span className="font-semibold text-[var(--color-text)]">{o.total}</span>
                    </div>
                    <div className="mt-2 inline-flex items-center rounded-full bg-[var(--color-green)] px-2 py-1 text-[12px] font-semibold text-white">{o.status}</div>
                  </div>
                </div>
                <ChevronRight />
              </Link>
            ))}
          </div>

          <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
            <Link href={`/track/${foodOrders[0]?.id ?? 301}`} className="rounded-full bg-black px-6 py-3 text-[14px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)]">Track</Link>
          </div>
        </main>
      )}

      {activeTab === "services" && (
        <main className="px-4 pb-24">
          <div className="mt-4 flex gap-2">
            {[
              { key: "mine", label: "My Services" },
              { key: "active", label: "Active Jobs (3)" },
              { key: "closed", label: "Closed Jobs" },
            ].map((f) => (
              <button key={f.key} onClick={() => setJobFilter(f.key)} className={`rounded-full border px-3 py-1 text-[12px] ${jobFilter === f.key ? "border-[var(--color-green)] bg-[var(--color-green)] text-white" : "border-[var(--color-border)] bg-white text-[var(--color-text)]"} shadow-[0_2px_8px_rgba(0,0,0,0.06)]`}>
                {f.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {jobs.map((j) => (
              <div key={j.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-3 shadow-[0_2px_10px_rgba(10,14,18,0.05)]">
                <div className="text-[14px] font-semibold text-[var(--color-text)]">{j.title}</div>
                <div className="mt-1 line-clamp-2 text-[13px] leading-5 text-[var(--color-text-muted)]">{j.description}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-[#d8f5ee] px-2.5 py-1 text-[12px] font-semibold text-[#0f766e]">{j.category}</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold ${j.status === "Pending" ? "bg-[#fee2e2] text-[#b91c1c]" : "bg-[#dcfce7] text-[#166534]"}`}>
                    <DotIcon color={j.status === "Pending" ? "#ef4444" : "#22c55e"} />
                    {j.status}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-white px-2.5 py-1 text-[12px] font-semibold text-[var(--color-text)]">{j.offers} new offers</span>
                  {j.assigned && <span className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-white px-2.5 py-1 text-[12px] font-semibold text-[var(--color-text)]">{j.assigned}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
            <Link href="/services/post-job" className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-[14px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
              <PlusIcon color="#fff" />
              Add Job
            </Link>
          </div>
        </main>
      )}
    </div>
  );
}
