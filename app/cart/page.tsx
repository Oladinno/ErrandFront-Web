"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, LocationPin, TrashIcon, WalletIcon } from "../../components/icons";
import { useCart } from "../../components/cart/CartContext";
import { useRouter } from "next/navigation";

type CartRow = { id: string | number; name: string; description: string; price: number; quantity: number; image: string };

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, isMutating } = useCart();
  const [error, setError] = useState<string | null>(null);
  const makeImage = (src: string | undefined, w: number, h: number, q = 70) => {
    const fallback = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=${q}&w=${w}&auto=format&fit=crop`;
    if (!src) return fallback;
    try {
      const u = new URL(src);
      u.searchParams.set("q", String(q));
      u.searchParams.set("w", String(w));
      u.searchParams.set("auto", "format");
      u.searchParams.set("fit", "crop");
      return u.toString();
    } catch {
      return fallback;
    }
  };

  const rows: CartRow[] = items.map((it, i) => ({
    id: it.id ?? i + 1,
    name: it.title,
    description: it.options?.map((o) => o.label).join(" + ") || "Main",
    price: it.basePrice + (it.options?.reduce((a, o) => a + o.price, 0) || 0),
    quantity: it.quantity,
    image: makeImage(it.imageUrl, 176, 176, 70),
  }));
  const [currentStep, setCurrentStep] = useState<"cart" | "checkout">("cart");
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");

  const subtotal = useMemo(() => rows.reduce((a, r) => a + r.price * r.quantity, 0), [rows]);
  const deliveryFee = 1000;
  const serviceFee = 500;
  const total = useMemo(() => subtotal + (deliveryMethod === "delivery" ? deliveryFee : 0) + serviceFee, [subtotal, deliveryMethod]);

  const numberFormatter = useMemo(() => new Intl.NumberFormat("en-US", { useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 }), []);
  const format = (n: number) => `₦ ${numberFormatter.format(n)}`;

  const removeRow = (id: string | number) => {
    try {
      removeItem(id);
      setError(null);
    } catch (e) {
      setError("Failed to remove item");
    }
  };
  const updateQty = (id: string | number, delta: number) => {
    try {
      const current = rows.find((r) => String(r.id) === String(id))?.quantity || 1;
      updateQuantity(id, Math.max(1, current + delta));
      setError(null);
    } catch (e) {
      setError("Failed to update quantity");
    }
  };

  if (currentStep === "cart") {
    return (
      <div className="min-h-screen bg-[var(--color-surface-muted)]">
        <div className="mx-auto max-w-md px-4 pb-24">
          <div className="sticky top-0 z-20 bg-white px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="text-[16px] font-semibold text-[var(--color-text)]">My Order</div>
              <Link href="/explore" className="text-[13px] font-medium text-[var(--color-green)]">Add more items</Link>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {rows.map((r) => (
              <div key={r.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-3 shadow-[0_2px_10px_rgba(10,14,18,0.05)]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Image src={r.image} alt={r.name} width={176} height={176} sizes="(max-width: 768px) 64px, 64px" unoptimized loading="lazy" className="h-[64px] w-[64px] rounded-xl object-cover" />
                    <div>
                      <div className="text-[14px] font-semibold text-[var(--color-text)]">{r.name}</div>
                      <div className="mt-1 text-[12px] text-[var(--color-text-muted)]">{r.description}</div>
                      <div className="mt-1 text-[14px] font-semibold text-[var(--color-text)]">{format(r.price)}</div>
                    </div>
                  </div>
                  <button onClick={() => removeRow(r.id)} className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white">
                    <TrashIcon />
                  </button>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <button onClick={() => updateQty(r.id, -1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[18px]">-</button>
                  <span className="min-w-[24px] text-center text-[14px] font-semibold text-[var(--color-text)]">{r.quantity}</span>
                  <button onClick={() => updateQty(r.id, 1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[18px]">+</button>
                </div>
              </div>
            ))}
            {rows.length === 0 && (
              <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 text-center text-[13px] text-[var(--color-text-muted)]">Your cart is empty.</div>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          <div className="mx-auto max-w-md px-4 py-3">
            <button onClick={() => router.push("/checkout")} disabled={rows.length === 0 || isMutating} className="flex w-full items-center justify-between rounded-full bg-[var(--color-green)] px-6 py-3 text-[14px] font-semibold text-white disabled:opacity-60">
              <span>Go to Checkout</span>
              <span>Subtotal: {format(subtotal)}</span>
            </button>
            {isMutating && <div className="mt-2 text-center text-[11px] text-[var(--color-text-muted)]">Updating…</div>}
            {error && <div className="mt-1 text-center text-[11px] text-[#ef4444]">{error}</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-muted)]">
      <div className="mx-auto max-w-md px-4 pb-24">
        <div className="sticky top-0 z-20 bg-white px-4 py-3">
          <div className="flex items-center justify-center">
            <div className="text-[16px] font-semibold text-[var(--color-text)]">Checkout</div>
          </div>
          <button onClick={() => setCurrentStep("cart")} className="absolute left-4 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white">
            <ArrowLeft color="#111" />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LocationPin size={18} color="#16a34a" />
                <div className="text-[14px] font-semibold text-[var(--color-text)]">12, North Avenue, Sagamu</div>
              </div>
              <button className="text-[13px] font-medium text-[var(--color-green)]">Change</button>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setDeliveryMethod("delivery")} className={`rounded-full px-3 py-1 text-[13px] font-semibold ${deliveryMethod === "delivery" ? "bg-[var(--color-green)] text-white" : "border border-[var(--color-border)] bg-white text-[var(--color-text)]"}`}>Delivery</button>
              <span className="text-[12px] text-[var(--color-text-muted)]">45 - 55 mins</span>
              <button onClick={() => setDeliveryMethod("pickup")} className={`rounded-full px-3 py-1 text-[13px] font-semibold ${deliveryMethod === "pickup" ? "bg-[var(--color-green)] text-white" : "border border-[var(--color-border)] bg-white text-[var(--color-text)]"}`}>Pickup</button>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WalletIcon size={18} />
                <div className="text-[14px] font-semibold text-[var(--color-text)]">Wallet</div>
                <span className="text-[13px] text-[var(--color-text-muted)]">Balance: {format(42500)}</span>
              </div>
              <button className="text-[13px] font-medium text-[var(--color-green)]">Change</button>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-3">
            <div className="text-[14px] font-semibold text-[var(--color-text)]">Order Summary</div>
            <div className="mt-2 flex items-center justify-between text-[13px]">
              <span className="text-[var(--color-text-muted)]">Subtotal</span>
              <span className="text-[var(--color-text)]">{format(subtotal)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[13px]">
              <span className="text-[var(--color-text-muted)]">Delivery Fee</span>
              <span className="text-[var(--color-text)]">{deliveryMethod === "delivery" ? format(deliveryFee) : format(0)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[13px]">
              <span className="text-[var(--color-text-muted)]">Service Fee</span>
              <span className="text-[var(--color-text)]">{format(serviceFee)}</span>
            </div>
            <div className="mt-2 h-px w-full bg-[var(--color-border)]" />
            <div className="mt-2 flex items-center justify-between text-[14px] font-semibold">
              <span className="text-[var(--color-text)]">Total</span>
              <span className="text-[var(--color-text)]">{format(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="mx-auto max-w-md px-4 py-3">
          <button
            onClick={() => {
              console.log("Pay", total);
              router.push("/orders/success");
            }}
            className="w-full rounded-full bg-[var(--color-green)] px-6 py-3 text-[14px] font-semibold text-white"
          >
            Pay {format(total)}
          </button>
        </div>
      </div>
    </div>
  );
}
