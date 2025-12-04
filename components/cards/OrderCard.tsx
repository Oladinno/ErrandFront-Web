"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PlusIcon, StarIcon } from "../icons";

type Props = {
  title: string;
  subtitle: string;
  rating: number;
  reviews: number;
  price: string;
  imageUrl: string;
  onQuickAdd?: () => void;
  href?: string;
};

export default function OrderCard({ title, subtitle, rating, reviews, price, imageUrl, onQuickAdd, href }: Props) {
  const Card = (
    <div className="relative w-[272px] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-[0_4px_16px_rgba(10,14,18,0.06)]">
      <Image src={imageUrl} alt={title} width={544} height={280} unoptimized className="h-[140px] w-full object-cover" />
      <button
        onClick={onQuickAdd}
        aria-label="Quick add"
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
      >
        <PlusIcon size={16} />
      </button>
      <div className="px-3 pb-3 pt-2">
        <div className="text-[12px] font-medium text-[var(--color-text-muted)]">{subtitle}</div>
        <div className="mt-0.5 line-clamp-1 text-[14px] font-semibold text-[var(--color-text)]">{title}</div>
        <div className="mt-1 flex items-center gap-1 text-[12px] text-[var(--color-text-muted)]">
          <StarIcon size={12} />
          <span className="ml-0.5 font-medium text-[var(--color-text)]">{rating.toFixed(1)}</span>
          <span className="ml-0.5">({reviews})</span>
          <span className="mx-2 h-1 w-1 rounded-full bg-zinc-300" />
          <span className="font-semibold text-[var(--color-text)]">{price}</span>
        </div>
      </div>
    </div>
  );

  return href ? <Link href={href}>{Card}</Link> : Card;
}