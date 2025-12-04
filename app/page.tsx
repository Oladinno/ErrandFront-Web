"use client";
import React, { useMemo, useState } from "react";
import HomeTopBar from "../components/HomeTopBar";
import Tabs from "../components/Tabs";
import PromoSkeleton from "../components/PromoSkeleton";
import OrderCard from "../components/cards/OrderCard";
import SpotCard from "../components/cards/SpotCard";
import StoreCard from "../components/cards/StoreCard";
import SearchBar from "../components/SearchBar";
import PadiFAB from "../components/PadiFAB";
import SidebarComponent from "../components/Sidebar";
import Link from "next/link";
import JobCard from "../components/jobs/JobCard";
import ProfessionalCard from "../components/cards/ProfessionalCard";
import { BoltIcon, CarIcon, ListIcon, PlusIcon, SendIcon, WrenchIcon } from "../components/icons";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"food" | "services">("food");

  const recentOrders = useMemo(
    () => [
      {
        id: 1,
        title: "Jollof Rice and Chips with Coleslaw",
        subtitle: "FoodCourt",
        rating: 4.2,
        reviews: 31,
        price: "₦ 4,500",
        imageUrl:
          "https://images.unsplash.com/photo-1604908554052-2f67c3bde2e4?q=80&w=800&auto=format&fit=crop",
      },
      {
        id: 2,
        title: "Jumbo Chicken Shawarma",
        subtitle: "FoodCourt",
        rating: 4.2,
        reviews: 26,
        price: "₦ 4,800",
        imageUrl:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
      },
      {
        id: 3,
        title: "Jollof Rice and Chips with Coleslaw",
        subtitle: "FoodCourt",
        rating: 4.2,
        reviews: 12,
        price: "₦ 4,500",
        imageUrl:
          "https://images.unsplash.com/photo-1617196037300-e3fb3ff5bbf3?q=80&w=800&auto=format&fit=crop",
      },
      {
        id: 4,
        title: "Jollof Rice and Chips with Coleslaw",
        subtitle: "FoodCourt",
        rating: 4.2,
        reviews: 40,
        price: "₦ 4,500",
        imageUrl:
          "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop",
      },
    ],
    []
  );

  const nearbySpots = useMemo(
    () => [
      {
        id: 11,
        title: "Food Court",
        subtitle: "FoodCourt",
        rating: 4.2,
        time: "10-25 mins",
        price: "₦ 1,300",
        imageUrl:
          "https://images.unsplash.com/photo-1604908554052-2f67c3bde2e4?q=80&w=800&auto=format&fit=crop",
      },
      {
        id: 12,
        title: "Food Court",
        subtitle: "FoodCourt",
        rating: 4.2,
        time: "10-25 mins",
        price: "₦ 1,300",
        imageUrl:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
      },
      {
        id: 13,
        title: "Food Court",
        subtitle: "FoodCourt",
        rating: 4.2,
        time: "10-25 mins",
        price: "₦ 1,300",
        imageUrl:
          "https://images.unsplash.com/photo-1617196037300-e3fb3ff5bbf3?q=80&w=800&auto=format&fit=crop",
      },
      {
        id: 14,
        title: "Food Court",
        subtitle: "FoodCourt",
        rating: 4.2,
        time: "10-25 mins",
        price: "₦ 1,300",
        imageUrl:
          "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop",
      },
    ],
    []
  );

  const storeCategories = useMemo(
    () => [
      { key: "all", label: "All Stores" },
      { key: "restaurants", label: "Restaurants" },
      { key: "groceries", label: "Groceries" },
      { key: "convenience", label: "Convenience" },
    ],
    []
  );

  const storeFilters = useMemo(
    () => [
      { key: "all", label: "All" },
      { key: "breakfast", label: "Breakfast" },
      { key: "local", label: "Local" },
      { key: "chicken", label: "Chicken" },
    ],
    []
  );

  const stores = useMemo(
    () => Array.from({ length: 12 }).map((_, i) => ({
      id: i + 1,
      title: "Food Court",
      subtitle: "FoodCourt",
      rating: 4.2,
      time: "10-25 mins",
      price: "₦ 1,300",
      imageUrl: i % 2 === 0
        ? "https://images.unsplash.com/photo-1604908554052-2f67c3bde2e4?q=80&w=800&auto=format&fit=crop"
        : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
    })),
    []
  );

  const [activeCategory, setActiveCategory] = useState<string>("restaurants");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  return (
    <div className="min-h-screen bg-[var(--color-surface-muted)]">
      <SidebarComponent isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="mx-auto max-w-[1200px] pt-6">
        <HomeTopBar onMenuToggle={() => setIsSidebarOpen(true)} />
        <div className="mt-3">
          <Tabs active={activeTab} onChange={setActiveTab} />
        </div>
        <div className="mt-4">
          <PromoSkeleton />
        </div>

        {activeTab === "food" && (
          <>
            <section className="mt-6 px-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-[var(--color-text)]">Recent Orders</h2>
                <Link href="/nearby-spots" className="text-[13px] font-medium text-[var(--color-green)]">See all</Link>
              </div>
              <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                {recentOrders.map((item, i) => (
                  <OrderCard key={i} {...item} href={`/store/${item.id}`} onQuickAdd={() => {}} />
                ))}
              </div>
            </section>

            <section className="mt-6 px-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-[var(--color-text)]">Nearby spots</h2>
                <Link href="/recent-orders" className="text-[13px] font-medium text-[var(--color-green)]">See all</Link>
              </div>
              <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                {nearbySpots.map((item, i) => (
                  <SpotCard key={i} {...item} href={`/store/${item.id}`} />
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === "services" && (
          <div className="mt-6 px-4">
            <div className="flex items-center justify-center gap-8">
              <Link href="/services/post-job" className="flex w-[92px] flex-col items-center">
                <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[var(--color-border)] bg-white shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
                  <PlusIcon size={22} />
                </div>
                <span className="mt-2 text-[13px] font-medium text-[var(--color-text)]">Post a Job</span>
              </Link>
              <Link href="/services/my-jobs" className="flex w-[92px] flex-col items-center">
                <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[var(--color-border)] bg-white shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
                  <ListIcon size={22} />
                </div>
                <span className="mt-2 text-[13px] font-medium text-[var(--color-text)]">My Jobs</span>
              </Link>
              <Link href="/send-package" className="flex w-[120px] flex-col items-center">
                <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[var(--color-border)] bg-white shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
                  <SendIcon size={22} />
                </div>
                <span className="mt-2 text-[13px] font-medium text-[var(--color-text)]">Send a Package</span>
              </Link>
            </div>

            <section className="mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-[var(--color-text)]">Recent Jobs</h2>
                <Link href="/services/jobs" className="text-[13px] font-medium text-[var(--color-green)]">See all</Link>
              </div>
              <div className="mt-3">
                <JobCard
                  title="Fix Leaking Kitchen Sink and Replace Tap"
                  description="My kitchen sink has been leaking underneath for the past 2 weeks and the water is damaging my cabinet. The tap is also very loose and needs to be replaced. I need a reliable plumber to come and fix the leak properly and install a new tap."
                  category="Plumbing"
                />
                <JobCard
                  title="Fix Leaking Kitchen Sink and Replace Tap"
                  description="My kitchen sink has been leaking underneath for the past 2 weeks and the water is damaging my cabinet. The tap is also very loose and needs to be replaced. I need a reliable plumber to come and fix the leak properly and install a new tap."
                  category="Plumbing"
                />
              </div>
            </section>

            <div className="mt-6">
              <SearchBar />
            </div>
            <div className="mt-3 flex items-center justify-center">
              <div className="w-full max-w-[720px]">
                <div className="flex gap-6 overflow-x-auto pb-2">
                  <button className="flex shrink-0 flex-col items-center">
                    <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full border border-dashed border-[var(--color-green)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                      <PlusIcon size={18} />
                    </div>
                    <span className="mt-2 text-[13px] font-medium text-[var(--color-text)]">All</span>
                  </button>
                  <button className="flex shrink-0 flex-col items-center">
                    <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full border border-[var(--color-border)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                      <WrenchIcon size={18} />
                    </div>
                    <span className="mt-2 text-[13px] font-medium text-[var(--color-text)]">Plumber</span>
                  </button>
                  <button className="flex shrink-0 flex-col items-center">
                    <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full border border-[var(--color-border)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                      <BoltIcon size={18} />
                    </div>
                    <span className="mt-2 text-[13px] font-medium text-[var(--color-text)]">Electrician</span>
                  </button>
                  <button className="flex shrink-0 flex-col items-center">
                    <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full border border-[var(--color-border)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                      <CarIcon size={18} />
                    </div>
                    <span className="mt-2 text-[13px] font-medium text-[var(--color-text)]">Auto Repair</span>
                  </button>
                </div>
                <div className="mx-auto mt-2 h-px w-[90%] bg-[var(--color-border)]" />
              </div>
            </div>

            <section className="mt-6">
              <div className="flex items-center gap-2">
                <span className="text-[16px]">🔥</span>
                <h2 className="text-[16px] font-semibold text-[var(--color-text)]">Top Rated Professionals</h2>
              </div>
              <div className="mt-3 flex flex-col gap-3">
                <ProfessionalCard name="Johnson Smith" title="Plumber" location="Sagamu" distance="13km" rating={4.2} reviews={13} price="20" />
                <ProfessionalCard name="Johnson Smith" title="Plumber" location="Sagamu" distance="3km" rating={4.2} reviews={13} price="20" />
              </div>
            </section>
          </div>
        )}

        {activeTab === "food" && (
          <>
            <div className="mt-6">
              <SearchBar />
            </div>

            <section className="mt-4 px-4">
              <div className="flex w-full items-center justify-between">
                <h2 className="text-[16px] font-semibold text-[var(--color-text)]">Stores</h2>
                <Link href="/stores" className="text-[13px] font-medium text-[var(--color-green)]">See all</Link>
              </div>

              <div className="mt-3 flex gap-6 overflow-x-auto pb-2">
                {storeCategories.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setActiveCategory(c.key)}
                    className="flex shrink-0 flex-col items-center"
                  >
                    <div
                      className={`flex h-[56px] w-[56px] items-center justify-center rounded-full border ${
                        activeCategory === c.key ? "border-dashed border-[var(--color-green)]" : "border-[var(--color-border)]"
                      } bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]`}
                    />
                    <span className="mt-2 whitespace-nowrap text-[13px] font-medium text-[var(--color-text)]">{c.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-3 flex gap-2">
                {storeFilters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    className={`rounded-full border px-3 py-1 text-[12px] ${
                      activeFilter === f.key
                        ? "border-[var(--color-green)] bg-[var(--color-green)] text-white"
                        : "border-[var(--color-border)] bg-white text-[var(--color-text)]"
                    } shadow-[0_2px_8px_rgba(0,0,0,0.06)]`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {stores.map((s) => (
                  <StoreCard key={s.id} {...s} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
      <PadiFAB />
    </div>
  );
}
