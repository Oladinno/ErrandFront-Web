"use client";
import React from "react";
import { FireIcon, HeartIcon, LocationPin, StarIcon } from "../icons";

type Props = {
  name: string;
  title: string;
  location: string;
  distance: string;
  rating: number;
  reviews: number;
  price: string;
};

export default function ProfessionalCard({ name, title, location, distance, rating, reviews, price }: Props) {
  return (
    <div className="relative flex items-start justify-between rounded-2xl border border-[var(--color-border)] bg-white px-3 py-3 shadow-[0_4px_16px_rgba(10,14,18,0.06)]">
      <div className="flex-1">
        <div className="text-[14px] font-semibold text-[var(--color-text)]">{name}</div>
        <div className="mt-0.5 text-[12px] text-[var(--color-text-muted)]">{title}</div>
        <div className="mt-1 flex items-center gap-1 text-[12px] text-[var(--color-text-muted)]">
          <LocationPin size={14} color="#94a3b8" />
          <span>{location}</span>
          <span>({distance} away)</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[12px]">
          <StarIcon size={12} />
          <span className="text-[var(--color-text)]">{rating.toFixed(1)}</span>
          <span className="text-[var(--color-text-muted)]">({reviews})</span>
          <span className="inline-flex items-center rounded-full bg-[#fff5f5] px-2 py-0.5 text-[11px] font-semibold text-[#ef4444]">
            <FireIcon size={12} color="#ef4444" />
            <span className="ml-1">Top Rated</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <HeartIcon size={13} />
        </button>
        <div className="text-[14px] font-semibold text-[var(--color-text)]">{price}</div>
      </div>
    </div>
  );
}