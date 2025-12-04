"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import SidebarComponent from "../../components/Sidebar";
import { BellIcon, CartIcon, FireIcon, HamburgerIcon, HistoryIcon, SearchIcon, ShopIcon, XIcon } from "../../components/icons";
import SpotCard from "../../components/cards/SpotCard";

export default function ExplorePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"food" | "services">("food");
  const [activeChip, setActiveChip] = useState("all");
  const [recentSearches, setRecentSearches] = useState<string[]>(["Umar Muhammad", "Food Court", "Breakfast"]);

  const topSpots = useMemo(
    () =>
      [
        { id: 101, title: "Food Court", subtitle: "FoodCourt", rating: 4.2, time: "10-25 mins", price: "₦ 1,300", imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop" },
        { id: 102, title: "Food Court", subtitle: "FoodCourt", rating: 4.2, time: "10-25 mins", price: "₦ 1,300", imageUrl: "https://images.unsplash.com/photo-1604908554052-2f67c3bde2e4?q=80&w=600&auto=format&fit=crop" },
        { id: 103, title: "Food Court", subtitle: "FoodCourt", rating: 4.2, time: "10-25 mins", price: "₦ 1,300", imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop" },
        { id: 104, title: "Food Court", subtitle: "FoodCourt", rating: 4.2, time: "10-25 mins", price: "₦ 1,300", imageUrl: "https://images.unsplash.com/photo-1604908554052-2f67c3bde2e4?q=80&w=600&auto=format&fit=crop" },
      ],
    []
  );
  const recommended = topSpots.map((s, i) => ({ ...s, id: s.id + 100 + i }));

  return (
    <div className="min-h-screen bg-[var(--color-surface-muted)]">
      <SidebarComponent isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <header className="sticky top-0 z-30 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <button onClick={() => window.history.back()} className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white">
              <span className="text-[18px]">←</span>
            </button>
            <button onClick={() => setSidebarOpen(true)} className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white">
              <HamburgerIcon />
            </button>
            <div className="ml-2 text-[16px] font-semibold text-[var(--color-text)]">Explore</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)} className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white">
              <SearchIcon />
            </button>
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

      {searchOpen && (
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur">
          <div className="px-4 py-3">
            <div className="flex items-center gap-2">
              <button onClick={() => setSearchOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-white">
                <XIcon />
              </button>
              <div className="flex-1 rounded-full border border-[var(--color-border)] bg-white px-4 py-2">
                <input className="w-full bg-transparent text-[14px] outline-none" placeholder="Search anything..." />
              </div>
              <button className="rounded-full bg-[var(--color-green)] px-4 py-2 text-[13px] font-semibold text-white">Search</button>
            </div>
            <div className="mt-3 text-[14px] font-semibold text-[var(--color-text)]">Recent searches</div>
            <div className="mt-2 flex flex-col gap-2">
              {recentSearches.map((term, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-white px-3 py-2">
                  <div className="flex items-center gap-2">
                    <HistoryIcon size={16} color="#6b7280" />
                    <span className="text-[14px] text-[var(--color-text)]">{term}</span>
                    <span className="rounded-full bg-[var(--color-green)] px-2 py-0.5 text-[12px] font-semibold text-white">Food</span>
                  </div>
                  <button onClick={() => setRecentSearches((s) => s.filter((_, idx) => idx !== i))} className="flex h-6 w-6 items-center justify-center rounded bg-[var(--color-surface-muted)]">
                    <XIcon size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="px-4 pb-8">
        <section className="mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FireIcon />
              <h2 className="text-[16px] font-semibold text-[var(--color-text)]">Top spots</h2>
            </div>
            <Link href="/stores" className="text-[13px] font-medium text-[var(--color-green)]">See all</Link>
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
            {topSpots.map((s) => (
              <SpotCard key={s.id} {...s} href={`/store/${s.id}`} />
            ))}
          </div>
        </section>

        <section className="mt-6">
          <div className="text-[16px] font-semibold text-[var(--color-text)]">Categories</div>
          <div className="mt-3 flex flex-wrap gap-6">
            {[
              { key: "all", label: "All Stores", icon: <ShopIcon /> },
              { key: "restaurants", label: "Restaurants", icon: <ShopIcon /> },
              { key: "groceries", label: "Groceries", icon: <CartIcon /> },
              { key: "convenience", label: "Convenience", icon: <BellIcon /> },
            ].map((c) => (
              <button key={c.key} onClick={() => setActiveChip(c.key)} className="flex shrink-0 flex-col items-center">
                <div className={`flex h-[56px] w-[56px] items-center justify-center rounded-full border ${activeChip === c.key ? "border-dashed border-[var(--color-green)]" : "border-[var(--color-border)]"} bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]`}>
                  {c.icon}
                </div>
                <span className="mt-2 whitespace-nowrap text-[13px] font-medium text-[var(--color-text)]">{c.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {["All", "Breakfast", "Local", "Chicken", "Shawarma", "Rice", "Noodles", "Drinks", "Snacks"].map((f) => (
              <button key={f} onClick={() => setActiveChip(f.toLowerCase())} className={`rounded-full border px-3 py-1 text-[12px] ${activeChip === f.toLowerCase() ? "border-[var(--color-green)] bg-[var(--color-green)] text-white" : "border-[var(--color-border)] bg-white text-[var(--color-text)]"} shadow-[0_2px_8px_rgba(0,0,0,0.06)]`}>
                {f}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[var(--color-text)]">Recommended</h2>
            <Link href="/stores" className="text-[13px] font-medium text-[var(--color-green)]">See all</Link>
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
            {recommended.map((s) => (
              <SpotCard key={s.id} {...s} href={`/store/${s.id}`} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}