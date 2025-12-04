"use client";
import React from "react";
import Link from "next/link";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SidebarComponent({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <aside className="absolute left-0 top-0 h-full w-[280px] bg-[#141414] text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="h-6 w-6 rounded bg-[var(--color-green)]" />
              <span className="text-base font-semibold">ErrandSort</span>
            </div>
            <nav className="px-3 py-2">
              <Link href="/" className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-white/5">
                <span>Home</span>
              </Link>
              <Link href="/explore" className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-white/5">
                <span>Explore</span>
              </Link>
              <Link href="/activity" className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-white/5">
                <span>Activity</span>
              </Link>
              <Link href="/cart" className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-white/5">
                <span>Cart</span>
              </Link>
              <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-white/5">
                <span>Send a Package</span>
              </button>
              <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-white/5">
                <span>Promotions</span>
              </button>
              <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-white/5">
                <span>Saved</span>
              </button>
              <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-white/5">
                <span>Notifications</span>
              </button>
              <div className="mt-4 border-t border-white/10" />
              <button className="mt-2 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-white/5">
                <span>Support</span>
              </button>
              <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-white/5">
                <span>Settings</span>
              </button>
            </nav>
            <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#0f0f0f] p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-white text-black">TS</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">Thomas Smith</div>
                  <div className="text-[12px] text-white/70">Customer</div>
                </div>
                <button onClick={onClose} className="h-8 w-8 rounded bg-white/10" />
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
