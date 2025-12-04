"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BikeIcon, ClockIcon, DotsIcon, HeartIcon, SearchIcon } from "../../../components/icons";
import FoodItemCard from "../../../components/food/FoodItemCard";
import ItemCustomizationModal from "../../../components/modals/ItemCustomizationModal";

type Props = { params: { storeId: string } };

export default function StoreDetailScreen({ params }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const onScroll = () => setCollapsed(window.scrollY > 180);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const menuTabs = ["Main", "Drinks", "Side", "Snacks"];
  const [activeTab, setActiveTab] = useState("Main");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    id?: number;
    title: string;
    imageUrl: string;
    basePrice: number;
    rating: number;
    reviews: number;
  } | null>(null);

  const items = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        title: "Jollof Rice and Chicken with Coleslaw",
        rating: 4.2,
        reviews: 13,
        price: "₦ 1,200",
        basePrice: 1200,
        imageUrl:
          i % 2 === 0
            ? "https://images.unsplash.com/photo-1604908554052-2f67c3bde2e4?q=80&w=600&auto=format&fit=crop"
            : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop",
      })),
    []
  );

  return (
    <div className="min-h-screen bg-[var(--color-surface-muted)]">
      <div className="relative h-[220px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1600&auto=format&fit=crop"
          alt="Store hero"
          width={1600}
          height={800}
          unoptimized
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 top-0 flex h-[56px] items-center justify-between px-4">
          <button onClick={() => window.history.back()} className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30">
            <ArrowLeft />
          </button>
          <div className="flex items-center gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30">
              <SearchIcon color="#fff" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30">
              <HeartIcon color="#fff" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30">
              <DotsIcon />
            </button>
          </div>
        </div>
        <div className="absolute left-1/2 top-[170px] -translate-x-1/2">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white text-[16px] font-semibold text-[var(--color-text)] shadow-[0_6px_20px_rgba(0,0,0,0.12)]">FC</div>
        </div>
      </div>

      {/* Collapsed sticky header search */}
      {collapsed && (
        <div className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur">
          <div className="mx-auto max-w-[1200px] px-4 py-2">
            <div className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2">
              <SearchIcon size={16} color="#6b7280" />
              <input className="w-full bg-transparent text-[14px] outline-none" placeholder="Search in store..." />
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1200px] px-4">
        <div className="mt-6 text-center">
          <div className="text-[18px] font-semibold text-[var(--color-text)]">Food Court</div>
          <div className="mt-1 text-[13px] text-[var(--color-text-muted)]">Sagamu, GP Street</div>
        </div>

        {/* Metadata row */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white p-3 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-center gap-1 text-[14px] font-semibold text-[var(--color-text)]">
              <BikeIcon />
              ₦ 1,200
            </div>
            <div className="mt-1 text-center text-[12px] text-[var(--color-text-muted)]">Delivery Fee</div>
          </div>
          <div className="rounded-xl bg-white p-3 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
            <div className="text-center text-[14px] font-semibold text-[var(--color-text)]">4.15 (23)</div>
            <div className="mt-1 text-center text-[12px] text-[var(--color-text-muted)]">Rating</div>
          </div>
          <div className="rounded-xl bg-white p-3 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-center gap-1 text-[14px] font-semibold text-[var(--color-text)]">
              <ClockIcon />
              ~10 mins
            </div>
            <div className="mt-1 text-center text-[12px] text-[var(--color-text-muted)]">Earliest Arrival</div>
          </div>
        </div>

        {/* Service toggles and open status */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button className="rounded-full bg-[var(--color-green)] px-4 py-2 text-[13px] font-medium text-white">Delivery</button>
          <button className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-[13px] font-medium text-[var(--color-text)]">Pickup</button>
          <span className="ml-4 inline-flex items-center rounded-full bg-[var(--color-green)] px-2 py-1 text-[12px] font-semibold text-white">Open</span>
          <span className="text-[12px] text-[var(--color-text-muted)]">Closes 11:00 PM</span>
        </div>

        {/* Menu tabs */}
        <div className="mt-6 flex items-center gap-6">
          {menuTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-[14px] font-medium ${activeTab === tab ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)]"}`}
            >
              {tab}
              {activeTab === tab && (
                <span className="mt-2 block h-[3px] w-full rounded bg-[var(--color-green)]" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-3 text-[14px] font-semibold text-[var(--color-text)]">{activeTab}</div>
        <div className="mt-3 flex flex-col gap-3">
          {items.map((it, i) => (
            <FoodItemCard
              key={i}
              {...it}
              onClick={() => {
                setSelectedItem({ id: i + 1, title: it.title, imageUrl: it.imageUrl, basePrice: it.basePrice, rating: it.rating, reviews: it.reviews });
                setModalOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Ongoing order button */}
      <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
        <Link href="/cart" className="rounded-full bg-[var(--color-green)] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)]">Ongoing Order →</Link>
      </div>

      {selectedItem && (
        <ItemCustomizationModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          item={{ id: selectedItem.id, title: selectedItem.title, imageUrl: selectedItem.imageUrl, basePrice: selectedItem.basePrice, rating: selectedItem.rating, reviews: selectedItem.reviews }}
        />
      )}
    </div>
  );
}
