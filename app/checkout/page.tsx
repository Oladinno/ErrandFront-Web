"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
 
 
import { ArrowLeft, ClockIcon, LocationPin, TicketIcon, WalletIcon } from "../../components/icons";
import { useCart } from "../../components/cart/CartContext";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function CheckoutPage() {
  const router = useRouter();
  const [orderReference, setOrderReference] = useState("");
  useEffect(() => { setOrderReference(String(Date.now()).slice(-6)); }, []);
  const { items } = useCart();
  const rows = items.map((it, i) => ({
    id: it.id ?? i + 1,
    name: it.title,
    description: it.options?.map((o) => o.label).join(" + ") || "Main",
    price: it.basePrice + (it.options?.reduce((a, o) => a + o.price, 0) || 0),
    quantity: it.quantity,
    image: it.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop",
  }));

  const subtotal = useMemo(() => rows.reduce((a, r) => a + r.price * r.quantity, 0), [rows]);
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [scheduled, setScheduled] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [tip, setTip] = useState<number>(0);
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [discount, setDiscount] = useState<number>(0);
  const [isPaying, setIsPaying] = useState(false);

  const deliveryFee = deliveryMethod === "delivery" ? 1000 : 0;
  const serviceFee = 500;
  const total = useMemo(() => Math.max(0, subtotal + deliveryFee + serviceFee + tip - discount), [subtotal, deliveryFee, serviceFee, tip, discount]);
  const walletBalance = 42500;
  const canPay = walletBalance >= total && total > 0 && rows.length > 0 && !isPaying;
  const numberFormatter = useMemo(() => new Intl.NumberFormat("en-US", { useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 }), []);
  const format = (n: number) => `₦ ${numberFormatter.format(n)}`;

  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "bank" | "card">("wallet");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankConfirm, setBankConfirm] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  

  const applyPromo = () => {
    if (promoInput.trim().toUpperCase() === "WELCOME10") {
      setDiscount(Math.round(subtotal * 0.1));
    } else {
      setDiscount(0);
    }
  };

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const styleLoadedRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [view, setView] = useState<"street" | "satellite">("street");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.js";
    script.onload = () => setMapReady(true);
    script.onerror = () => setMapError("Map failed to load");
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current || mapError) return;
    const gl = (window as any).maplibregl;
    if (!gl) return;
    const map = new gl.Map({
      container: mapRef.current,
      style: {
        version: 8,
        sources: {
          osm: { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256, attribution: "© OpenStreetMap" },
          esri: { type: "raster", tiles: ["https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"], tileSize: 256 }
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }]
      },
      center: [3.65, 6.86],
      zoom: 12,
      pitchWithRotate: false,
      dragRotate: false
    });
    mapInstanceRef.current = map;
    map.addControl(new gl.NavigationControl());
    const marker = new gl.Marker({ draggable: true }).setLngLat([3.65, 6.86]).addTo(map);
    marker.on("dragend", () => {
      const p = marker.getLngLat();
      setCoords([p.lng, p.lat]);
    });
    map.on("click", (e: any) => {
      marker.setLngLat(e.lngLat);
      setCoords([e.lngLat.lng, e.lngLat.lat]);
    });
    map.on("load", () => {
      styleLoadedRef.current = true;
    });
    return () => {
      styleLoadedRef.current = false;
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mapReady, mapError]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !styleLoadedRef.current) return;
    const current = view === "street" ? "osm" : "esri";
    const other = view === "street" ? "esri" : "osm";
    if (map.getLayer(other)) map.removeLayer(other);
    if (!map.getLayer(current)) map.addLayer({ id: current, type: "raster", source: current });
  }, [view]);

  const requestLocation = () => {
    if (!navigator.geolocation) { setMapError("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { longitude, latitude } = pos.coords;
        setCoords([longitude, latitude]);
      },
      () => setMapError("Location access denied"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
    );
  };

  

  return (
    <div className="min-h-screen bg-[var(--color-surface-muted)]">
      <div className="mx-auto max-w-lg px-4 pb-24">
        <Head>
          <link rel="preconnect" href="https://unpkg.com" />
        </Head>
        <div className="sticky top-0 z-20 bg-white px-4 py-3">
          <div className="flex items-center justify-center">
            <div className="text-[16px] font-semibold text-[var(--color-text)]">Checkout</div>
          </div>
          <button onClick={() => router.push("/cart")} className="absolute left-4 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white">
            <ArrowLeft color="#111" />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LocationPin size={18} color="#16a34a" />
                <div className="text-[14px] font-semibold text-[var(--color-text)]">Home · 12, North Avenue, Sagamu</div>
              </div>
              <button onClick={() => alert("Change address (mock)")} className="text-[13px] font-medium text-[var(--color-green)]">Change</button>
            </div>
            <div className="mt-3 overflow-hidden rounded-xl">
              <div ref={mapRef} className="h-[180px] w-full" />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={requestLocation} className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1 text-[12px]">Use my location</button>
                  <button onClick={() => setView(view === "street" ? "satellite" : "street")} className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1 text-[12px]">{view === "street" ? "Satellite" : "Street"}</button>
                </div>
                <span className="text-[12px] text-[var(--color-text-muted)]">{coords ? `${coords[1].toFixed(5)}, ${coords[0].toFixed(5)}` : "Select a location"}</span>
              </div>
              {mapError && <div className="mt-1 text-[12px] text-[#ef4444]">{mapError}</div>}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setDeliveryMethod("delivery")} className={`rounded-full px-3 py-1 text-[13px] font-semibold ${deliveryMethod === "delivery" ? "bg-[var(--color-green)] text-white" : "border border-[var(--color-border)] bg-white text-[var(--color-text)]"}`}>Delivery</button>
              <span className="flex items-center gap-1 text-[12px] text-[var(--color-text-muted)]"><ClockIcon size={14} />45 - 55 mins</span>
              <button onClick={() => setDeliveryMethod("pickup")} className={`rounded-full px-3 py-1 text-[13px] font-semibold ${deliveryMethod === "pickup" ? "bg-[var(--color-green)] text-white" : "border border-[var(--color-border)] bg-white text-[var(--color-text)]"}`}>Pickup</button>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <button onClick={() => setScheduled((v) => !v)} className={`rounded-full px-3 py-1 text-[12px] ${scheduled ? "bg-[var(--color-green)] text-white" : "border border-[var(--color-border)] bg-white text-[var(--color-text)]"}`}>{scheduled ? "Scheduled" : "ASAP"}</button>
              <span className="text-[12px] text-[var(--color-text-muted)]">{scheduled ? "Later today" : "Deliver soon"}</span>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-3 py-2">
              <input value={instructions} onChange={(e) => setInstructions(e.target.value)} className="w-full bg-transparent text-[13px] outline-none" placeholder="Note to Rider (e.g., Gate code, Leave at door)" />
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-3">
            <div className="text-[14px] font-semibold text-[var(--color-text)]">Tip your rider</div>
            <div className="mt-2 flex gap-2">
              {[100, 200, 500].map((v) => (
                <button key={v} onClick={() => setTip(v)} className={`rounded-full px-3 py-1 text-[13px] font-semibold ${tip === v ? "bg-[var(--color-green)] text-white" : "border border-[var(--color-border)] bg-white text-[var(--color-text)]"}`}>{format(v)}</button>
              ))}
              <button onClick={() => setTip(0)} className={`rounded-full px-3 py-1 text-[13px] font-semibold ${tip === 0 ? "bg-[var(--color-green)] text-white" : "border border-[var(--color-border)] bg-white text-[var(--color-text)]"}`}>Custom</button>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-3">
          <div className="text-[14px] font-semibold text-[var(--color-text)]">Payment Method</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
              <button onClick={() => { setPaymentMethod("bank"); setBankConfirm(false); }} className={`rounded-xl border px-3 py-3 text-left transition-all ${paymentMethod === "bank" ? "border-[var(--color-green)] bg-[#eef7f1]" : "border-[var(--color-border)] bg-white"}`}>
                <div className="text-[14px] font-semibold text-[var(--color-text)]">Bank Transfer</div>
                <div className="text-[12px] text-[var(--color-text-muted)]">Transfer from your bank</div>
              </button>
              <button onClick={() => setPaymentMethod("card")} className={`rounded-xl border px-3 py-3 text-left transition-all ${paymentMethod === "card" ? "border-[var(--color-green)] bg-[#eef7f1]" : "border-[var(--color-border)] bg-white"}`}>
                <div className="text-[14px] font-semibold text-[var(--color-text)]">Pay with Card</div>
                <div className="text-[12px] text-[var(--color-text-muted)]">Use your card</div>
              </button>
            </div>

            {paymentMethod === "bank" && (
              <div className="mt-3">
                {!bankConfirm ? (
                  <div className="flex flex-col gap-2">
                    <input value={bankAccountNumber} onChange={(e) => setBankAccountNumber(e.target.value)} placeholder="Account Number" className="rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-[13px] outline-none" />
                    <input value={routingNumber} onChange={(e) => setRoutingNumber(e.target.value)} placeholder="Routing Number" className="rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-[13px] outline-none" />
                    <input value={bankAccountName} onChange={(e) => setBankAccountName(e.target.value)} placeholder="Account Holder Name" className="rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-[13px] outline-none" />
                    <button onClick={() => setBankConfirm(true)} className="mt-1 rounded-full bg-[var(--color-green)] px-4 py-2 text-[13px] font-semibold text-white">Continue</button>
                  </div>
                ) : (
                  <div className="rounded-xl border border-[var(--color-border)] bg-[#f9fafb] p-3">
                    <div className="text-[13px] text-[var(--color-text)]">Transfer {format(total)} to</div>
                    <div className="mt-1 text-[13px] font-semibold text-[var(--color-text)]">{bankAccountName || "Account Holder"}</div>
                    <div className="text-[12px] text-[var(--color-text-muted)]">Acct: {bankAccountNumber || "••••••••••"} • Routing: {routingNumber || "•••••••••"}</div>
                    <div className="mt-1 text-[12px] text-[var(--color-text-muted)]">Reference: ORD-{orderReference}</div>
                    <div className="mt-2 text-[12px] text-[var(--color-text-muted)]">Your order will be confirmed after transfer is received.</div>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="mt-3">
                <div className="grid grid-cols-1 gap-2">
                  <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="Card Number" inputMode="numeric" className="rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-[13px] outline-none" />
                  <input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Name on Card" className="rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-[13px] outline-none" />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/YY" className="rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-[13px] outline-none" />
                    <input value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} placeholder="CVV" inputMode="numeric" className="rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-[13px] outline-none" />
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-end">
                  <button onClick={() => router.push("/orders/success")} className="rounded-full bg-[var(--color-green)] px-4 py-2 text-[13px] font-semibold text-white">Pay {format(total)}</button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WalletIcon size={18} />
                <div className="text-[14px] font-semibold text-[var(--color-text)]">Wallet</div>
                <span className={`text-[13px] ${walletBalance < total ? "text-[#ef4444]" : "text-[var(--color-text-muted)]"}`}>Available balance: {format(walletBalance)}</span>
              </div>
              <button className="text-[13px] font-medium text-[var(--color-green)]">{walletBalance < total ? "Top Up" : "Change"}</button>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-3">
            <button onClick={() => setPromoOpen((v) => !v)} className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <TicketIcon size={18} />
                <div className="text-[14px] font-semibold text-[var(--color-text)]">Apply Promo Code</div>
              </div>
              <span className="text-[13px] text-[var(--color-text-muted)]">›</span>
            </button>
            {promoOpen && (
              <div className="mt-2 flex items-center gap-2">
                <input value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="Enter code" className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-[13px] outline-none" />
                <button onClick={applyPromo} className="rounded-full bg-[var(--color-green)] px-4 py-2 text-[13px] font-semibold text-white">Apply</button>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-3">
            <div className="text-[14px] font-semibold text-[var(--color-text)]">Order Summary</div>
            <div className="mt-2 flex items-center justify-between text-[13px]">
              <span className="text-[var(--color-text-muted)]">Subtotal</span>
              <span className="text-[var(--color-text)]">{format(subtotal)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[13px]">
              <span className="text-[var(--color-text-muted)]">Delivery Fee</span>
              <span className="text-[var(--color-text)]">{format(deliveryFee)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[13px]">
              <span className="text-[var(--color-text-muted)]">Service Fee</span>
              <span className="text-[var(--color-text)]">{format(serviceFee)}</span>
            </div>
            {tip > 0 && (
              <div className="mt-1 flex items-center justify-between text-[13px]">
                <span className="text-[var(--color-text-muted)]">Rider Tip</span>
                <span className="text-[var(--color-text)]">{format(tip)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="mt-1 flex items-center justify-between text-[13px]">
                <span className="text-[var(--color-green)]">Discount</span>
                <span className="text-[var(--color-green)]">- {format(discount)}</span>
              </div>
            )}
            <div className="mt-2 h-px w-full bg-[var(--color-border)]" />
            <div className="mt-2 flex items-center justify-between text-[14px] font-semibold">
              <span className="text-[var(--color-text)]">Total</span>
              <span className="text-[var(--color-text)]">{format(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="mx-auto max-w-lg px-4 py-3">
          <button
            onClick={() => {
              if (!canPay) return;
              setIsPaying(true);
              setTimeout(() => {
                setIsPaying(false);
                router.push("/orders/success");
              }, 600);
            }}
            disabled={!canPay}
            className="w-full rounded-full bg-[var(--color-green)] px-6 py-3 text-[14px] font-semibold text-white disabled:opacity-60"
          >
            {isPaying ? "Processing…" : `Pay ${format(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
