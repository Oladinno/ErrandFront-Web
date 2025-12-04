"use client";
import React from "react";
import { ArrowLeft } from "../../../components/icons";

export default function OrderTrackingScreen() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-muted)]">
      <header className="sticky top-0 z-30 bg-white">
        <div className="flex items-center gap-2 px-4 py-3">
          <button onClick={() => window.history.back()} className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white">
            <ArrowLeft color="#111" />
          </button>
          <div className="ml-2 text-[16px] font-semibold text-[var(--color-text)]">Order Tracking</div>
        </div>
      </header>
      <main className="px-4 py-6">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-[0_2px_10px_rgba(10,14,18,0.05)]">
          <div className="text-[14px] font-semibold text-[var(--color-text)]">Your order status</div>
          <div className="mt-2 text-[13px] text-[var(--color-text-muted)]">This is a placeholder screen. Tracking UI can be implemented next.</div>
        </div>
      </main>
    </div>
  );
}