"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowLeft, DotsIcon, HeartIcon, PencilIcon, SearchIcon, StarIcon, XIcon } from "../icons";
import { useCart } from "../cart/CartContext";

type Item = {
  id?: string | number;
  title: string;
  imageUrl: string;
  basePrice: number;
  rating: number;
  reviews: number;
  description?: string;
};

export default function ItemCustomizationModal({ open, onClose, item }: { open: boolean; onClose: () => void; item: Item }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [style, setStyle] = useState<string | null>(null);
  const [sides, setSides] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [heroError, setHeroError] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const numberFormatter = useMemo(() => new Intl.NumberFormat("en-US", { useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 }), []);

  const radioOptions = useMemo(
    () => [
      { key: "plain", label: "Plain Fried", price: 0 },
      { key: "deep", label: "Deep Fried", price: 0 },
      { key: "rotisserie", label: "Rotiseri-ed", price: 500 },
    ],
    []
  );
  const sideOptions = useMemo(
    () => [
      { key: "coleslaw", label: "Coleslaw", price: 700 },
      { key: "plantain", label: "Plantain", price: 900 },
    ],
    []
  );

  const modifiers = useMemo(() => {
    const radio = style ? radioOptions.find((r) => r.key === style)?.price || 0 : 0;
    const checks = sides.reduce((acc, s) => acc + (sideOptions.find((o) => o.key === s)?.price || 0), 0);
    return radio + checks;
  }, [style, sides, radioOptions, sideOptions]);

  const total = useMemo(() => (item.basePrice + modifiers) * quantity, [item.basePrice, modifiers, quantity]);

  const toggleSide = (key: string) => {
    setSides((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const onAdd = () => {
    const selectedOptions = [] as { type: "radio" | "checkbox"; key: string; label: string; price: number }[];
    if (style) {
      const r = radioOptions.find((x) => x.key === style)!;
      selectedOptions.push({ type: "radio", key: r.key, label: r.label, price: r.price });
    }
    sides.forEach((k) => {
      const s = sideOptions.find((x) => x.key === k)!;
      selectedOptions.push({ type: "checkbox", key: s.key, label: s.label, price: s.price });
    });
    addItem({ id: item.id, title: item.title, imageUrl: item.imageUrl, basePrice: item.basePrice, quantity, options: selectedOptions, notes, totalPrice: total });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="absolute inset-x-0 bottom-0 top-0 bg-white overflow-y-auto overscroll-y-contain scroll-smooth modal-scroll pb-24"
        style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
      >
        <div className="relative h-[220px] w-full overflow-hidden">
          <Image
            src={heroError || !item.imageUrl ? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=70&w=1600&auto=format&fit=crop" : item.imageUrl}
            alt={item.title}
            width={1600}
            height={800}
            sizes="100vw"
            unoptimized
            className={`h-full w-full object-cover ${heroLoaded ? "opacity-100" : "opacity-0"}`}
            onLoadingComplete={() => setHeroLoaded(true)}
            onError={() => setHeroError(true)}
          />
          {!heroLoaded && <div aria-hidden className="absolute inset-0 animate-pulse bg-[#f3f4f6]" />}
          <div className="absolute inset-x-0 top-0 flex h-[56px] items-center justify-between px-4">
            <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30">
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
        </div>

        <div className="mx-auto max-w-[720px] px-4">
          <div className="relative -mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
            <div className="flex items-center justify-between">
              <div className="text-[16px] font-semibold text-[var(--color-text)]">Item</div>
              <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-white">
                <XIcon />
              </button>
            </div>
          <div className="mt-2 overflow-hidden rounded-xl">
            <div className="relative h-[140px] w-full">
              <Image
                src={previewError || !item.imageUrl ? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=70&w=1200&auto=format&fit=crop" : item.imageUrl}
                alt={item.title}
                width={1200}
                height={800}
                sizes="(max-width: 768px) 100vw, 720px"
                unoptimized
                className={`h-[140px] w-full object-cover ${previewLoaded ? "opacity-100" : "opacity-0"}`}
                onLoadingComplete={() => setPreviewLoaded(true)}
                onError={() => setPreviewError(true)}
              />
              {!previewLoaded && <div aria-hidden className="absolute inset-0 animate-pulse bg-[#f3f4f6]" />}
            </div>
          </div>
            <div className="mt-3 flex items-start justify-between">
              <div>
                <div className="text-[16px] font-semibold text-[var(--color-text)]">{item.title}</div>
                <div className="mt-1 flex items-center gap-1 text-[12px]">
                  {[0,1,2,3,4].map((i) => (
                    <StarIcon key={i} size={12} />
                  ))}
                  <span className="ml-1 text-[var(--color-text-muted)]">{item.rating.toFixed(1)} ({item.reviews} Reviews)</span>
                </div>
                <div className="mt-1 text-[12px] text-[var(--color-text-muted)]">Contains 1 pack of chicken. Customization options available</div>
              </div>
              <div className="text-[16px] font-semibold text-[var(--color-text)]">₦ {numberFormatter.format(item.basePrice)}</div>
            </div>

            <div className="mt-3 h-px w-full bg-[var(--color-border)]" />

            <div className="mt-3 flex items-center justify-between">
              <div className="text-[14px] font-semibold text-[var(--color-text)]">Chicken Style</div>
              <span className="rounded-full bg-[#eef2f7] px-2 py-0.5 text-[12px] text-[var(--color-text-muted)]">Optional</span>
            </div>
            <div className="mt-2 flex flex-col">
              {radioOptions.map((r) => (
                <label key={r.key} className="flex items-center justify-between rounded-xl px-2 py-2">
                  <div className="text-[13px] text-[var(--color-text)]">{r.label} {r.price > 0 && <span className="text-[var(--color-text-muted)]">+ ₦{numberFormatter.format(r.price)}</span>}</div>
                  <input type="radio" name="style" checked={style === r.key} onChange={() => setStyle(r.key)} className="h-4 w-4 rounded-full border-[var(--color-border)]" />
                </label>
              ))}
            </div>

            <div className="mt-3 h-px w-full bg-[var(--color-border)]" />

            <div className="mt-3 flex items-center justify-between">
              <div className="text-[14px] font-semibold text-[var(--color-text)]">Sides</div>
              <span className="rounded-full bg-[#eef2f7] px-2 py-0.5 text-[12px] text-[var(--color-text-muted)]">Optional</span>
            </div>
            <div className="mt-2 flex flex-col">
              {sideOptions.map((s) => (
                <label key={s.key} className="flex items-center justify-between rounded-xl px-2 py-2">
                  <div className="text-[13px] text-[var(--color-text)]">{s.label} {s.price > 0 && <span className="text-[var(--color-text-muted)]">+ ₦{numberFormatter.format(s.price)}</span>}</div>
                  <input type="checkbox" checked={sides.includes(s.key)} onChange={() => toggleSide(s.key)} className="h-4 w-4 rounded border-[var(--color-border)]" />
                </label>
              ))}
            </div>

            <div className="mt-3 h-px w-full bg-[var(--color-border)]" />

            <div className="mt-3 flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-3 py-2">
              <PencilIcon size={14} color="#6b7280" />
              <input value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-transparent text-[13px] outline-none" placeholder="Add notes for the restaurant (Optional)" />
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white">
          <div className="mx-auto max-w-[720px] px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[18px]">-</button>
                <span className="min-w-[24px] text-center text-[14px] font-semibold text-[var(--color-text)]">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[18px]">+</button>
              </div>
              <button onClick={onAdd} className="rounded-full bg-[var(--color-green)] px-6 py-3 text-[14px] font-semibold text-white">
                Add ₦{numberFormatter.format(total)} to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
