"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { BellIcon, CartIcon, ChevronDown, HamburgerIcon, LocationPin, TrashIcon } from "./icons";
import MessageButton from "./messages/MessageButton";
import { useCart } from "./cart/CartContext";

type Props = {
  onMenuToggle: () => void;
};

export default function HomeTopBar({ onMenuToggle }: Props) {
  const { items, removeItem, updateQuantity, isMutating } = useCart();
  const count = useMemo(() => items.reduce((a, it) => a + (it.quantity || 0), 0), [items]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const numberFormatter = useMemo(() => new Intl.NumberFormat("en-US", { useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 }), []);
  return (
    <div className="flex h-[56px] items-center justify-between px-4">
      <button onClick={onMenuToggle} aria-label="Open menu" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <HamburgerIcon size={20} />
      </button>
      <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <LocationPin size={18} />
        <span className="text-[13px] font-medium text-[var(--color-text)]">12, North Avenue, GP Street, Sagamu</span>
        <ChevronDown size={16} color="#6b7280" />
      </div>
      <div className="flex items-center gap-2">
        <MessageButton />
        <div className="relative">
          <Link
            href="/cart"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
          >
            <CartIcon size={20} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-[var(--color-green)] px-1 text-center text-[11px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>
          {open && (
            <div className="absolute right-0 top-12 z-30 w-[280px] rounded-2xl border border-[var(--color-border)] bg-white p-3 shadow-[0_12px_24px_rgba(0,0,0,0.12)]" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
              <div className="flex items-center justify-between">
                <div className="text-[14px] font-semibold text-[var(--color-text)]">Cart ({count})</div>
                <Link href="/cart" className="text-[12px] font-medium text-[var(--color-green)]">View</Link>
              </div>
              <div className="mt-2 max-h-[220px] overflow-y-auto modal-scroll">
                {items.map((it) => (
                  <div key={String(it.id)} className="flex items-start justify-between rounded-xl px-1 py-2">
                    <div>
                      <div className="text-[13px] font-semibold text-[var(--color-text)]">{it.title}</div>
                      <div className="mt-0.5 text-[12px] text-[var(--color-text-muted)]">{it.options?.map((o) => o.label).join(" + ") || "Main"}</div>
                      <div className="mt-0.5 text-[13px] font-semibold text-[var(--color-text)]">₦ {numberFormatter.format(it.basePrice + (it.options?.reduce((a, o) => a + o.price, 0) || 0))}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          try {
                            updateQuantity(it.id ?? "", Math.max(1, (it.quantity || 1) - 1));
                            setError(null);
                          } catch (e) {
                            setError("Failed to update quantity");
                          }
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[16px]"
                      >
                        -
                      </button>
                      <span className="min-w-[18px] text-center text-[12px] font-semibold text-[var(--color-text)]">{it.quantity}</span>
                      <button
                        onClick={() => {
                          try {
                            updateQuantity(it.id ?? "", (it.quantity || 1) + 1);
                            setError(null);
                          } catch (e) {
                            setError("Failed to update quantity");
                          }
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[16px]"
                      >
                        +
                      </button>
                      <button
                        onClick={() => {
                          try {
                            removeItem(it.id ?? "");
                            setError(null);
                          } catch (e) {
                            setError("Failed to remove item");
                          }
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-border)] bg-white"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="py-6 text-center text-[12px] text-[var(--color-text-muted)]">Your cart is empty.</div>
                )}
              </div>
              <Link href="/cart" className="mt-3 block w-full rounded-full bg-[var(--color-green)] px-4 py-2 text-center text-[13px] font-semibold text-white">Proceed to checkout</Link>
              {isMutating && <div className="mt-2 text-center text-[11px] text-[var(--color-text-muted)]">Updating…</div>}
              {error && <div className="mt-2 text-center text-[11px] text-[#ef4444]">{error}</div>}
            </div>
          )}
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <BellIcon size={20} />
        </button>
      </div>
    </div>
  );
}
