import React from "react";

export default function PromoSkeleton() {
  return (
    <div className="flex w-full gap-3 px-4">
      <div className="h-[84px] flex-1 rounded-2xl bg-[var(--color-skeleton)]" />
      <div className="h-[84px] flex-1 rounded-2xl bg-[var(--color-skeleton)]" />
      <div className="h-[84px] flex-1 rounded-2xl bg-[var(--color-skeleton)]" />
      <div className="h-[84px] flex-1 rounded-2xl bg-[var(--color-skeleton)]" />
    </div>
  );
}