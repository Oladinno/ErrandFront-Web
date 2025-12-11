"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BikeIcon, DotIcon, HeartIcon, StarIcon } from "../icons";

type Props = {
  id: string | number;
  title: string;
  subtitle: string;
  rating: number;
  time: string;
  price: string;
  imageUrl: string | string[];
};

export default function StoreCard({ id, title, subtitle, rating, time, price, imageUrl }: Props) {
  const images = Array.isArray(imageUrl) ? imageUrl : [imageUrl];
  const [index, setIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const fallback = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=70&w=544&auto=format&fit=crop";
  const src = imgError ? fallback : images[index];
  return (
    <Link
      href={`/store/${id}`}
      className="relative block overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-[0_4px_16px_rgba(10,14,18,0.06)]"
    >
      <div className="relative h-[124px] w-full overflow-hidden">
        <Image
          src={src}
          alt={title}
          width={544}
          height={248}
          sizes="(max-width: 768px) 100vw, 544px"
          unoptimized
          loading="lazy"
          className={`h-[124px] w-full object-cover ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoadingComplete={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
        {!imgLoaded && <div aria-hidden className="absolute inset-0 animate-pulse bg-[#f3f4f6]" />}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {images.map((_, i) => (
              <button key={i} onClick={(e) => { e.preventDefault(); setIndex(i); setImgLoaded(false); setImgError(false); }} className={`h-1.5 w-1.5 rounded-full ${index === i ? "bg-white" : "bg-white/60"}`} />
            ))}
          </div>
        )}
      </div>
      <div className="absolute left-2 top-2 rounded-full bg-[var(--color-green-dark)] px-2 py-1 text-[11px] font-semibold text-white">
        Free Delivery above ₦700
      </div>
      <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
        <HeartIcon size={14} />
      </div>
      <div className="px-3 pb-3 pt-2">
        <div className="text-[12px] font-medium text-[var(--color-text-muted)]">{subtitle}</div>
        <div className="mt-0.5 line-clamp-1 text-[14px] font-semibold text-[var(--color-text)]">{title}</div>
        <div className="mt-1 flex items-center gap-1 text-[12px] text-[var(--color-text-muted)]">
          <StarIcon size={12} />
          <span className="ml-0.5 font-medium text-[var(--color-text)]">{rating.toFixed(1)}</span>
          <DotIcon />
          <span>{time}</span>
          <DotIcon />
          <BikeIcon />
          <span className="font-semibold text-[var(--color-text)]">{price}</span>
        </div>
      </div>
    </Link>
  );
}
