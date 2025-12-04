"use client";
import React from "react";

type Props = {
  title: string;
  description: string;
  category: string;
};

export default function JobCard({ title, description, category }: Props) {
  return (
    <div className="py-3">
      <div className="text-[14px] font-semibold text-[var(--color-text)]">{title}</div>
      <div className="mt-1 line-clamp-2 text-[13px] leading-5 text-[var(--color-text-muted)]">{description}</div>
      <div className="mt-2 inline-flex items-center rounded-full bg-[#d8f5ee] px-2.5 py-1 text-[12px] font-semibold text-[#0f766e]">{category}</div>
      <div className="mt-3 h-px w-full bg-[var(--color-border)]" />
    </div>
  );
}