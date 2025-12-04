"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrderSuccessPage() {
  const router = useRouter();
  const onTrack = () => {
    const id = "FC-" + String(Date.now()).slice(-6);
    router.push(`/track/${id}`);
  };
  return (
    <div className="min-h-screen bg-[var(--color-surface-muted)]">
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 text-center shadow-[0_2px_10px_rgba(10,14,18,0.05)]">
          <div className="text-[18px] font-semibold text-[var(--color-text)]">Payment Successful</div>
          <div className="mt-2 text-[13px] text-[var(--color-text-muted)]">Your order has been placed.</div>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link href="/" className="inline-block rounded-full border border-[var(--color-border)] bg-white px-6 py-3 text-[14px] font-semibold text-[var(--color-text)]">Go Home</Link>
            <button onClick={onTrack} className="inline-block rounded-full bg-[var(--color-green)] px-6 py-3 text-[14px] font-semibold text-white">Track Order</button>
          </div>
        </div>
      </div>
    </div>
  );
}
