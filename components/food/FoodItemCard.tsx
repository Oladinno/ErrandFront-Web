"use client";
import React from "react";
import Image from "next/image";
import { HeartIcon, PlusIcon, StarIcon } from "../icons";

type Props = {
  title: string;
  rating: number;
  reviews: number;
  price: string;
  imageUrl: string;
  onClick?: () => void;
};

export default function FoodItemCard({ title, rating, reviews, price, imageUrl, onClick }: Props) {
  return (
    <div onClick={onClick} className="flex cursor-pointer items-center justify-between rounded-2xl border border-[var(--color-border)] bg-white p-3 shadow-[0_2px_10px_rgba(10,14,18,0.05)]">
      <div className="flex items-center gap-3">
        <Image src={imageUrl} alt={title} width={88} height={88} unoptimized className="h-[64px] w-[64px] rounded-xl object-cover" />
        <div>
          <div className="line-clamp-1 text-[14px] font-semibold text-[var(--color-text)]">{title}</div>
          <div className="mt-1 flex items-center gap-1 text-[12px] text-[var(--color-text-muted)]">
            <StarIcon size={12} />
            <span className="text-[var(--color-text)]">{rating.toFixed(1)}</span>
            <span>({reviews})</span>
          </div>
          <div className="mt-1 text-[14px] font-semibold text-[var(--color-text)]">{price}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <HeartIcon size={13} />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-green)] text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
          <PlusIcon size={16} color="#fff" />
        </button>
      </div>
    </div>
  );
}
