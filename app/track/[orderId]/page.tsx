"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, BikeIcon } from "../../../components/icons";
import MessageButton from "../../../components/messages/MessageButton";
import { useCart } from "../../../components/cart/CartContext";

type MLMap = {
  addControl: (c: unknown) => void;
  addLayer: (l: unknown) => void;
  addSource: (id: string, s: unknown) => void;
  fitBounds: (b: [number, number][], o?: unknown) => void;
  getSource: (id: string) => unknown;
  on: (e: string, cb: (...args: unknown[]) => void) => void;
  remove: () => void;
  _updateRider?: (lngLat: [number, number]) => void;
};

export default function OrderTrackingPage() {
  const router = useRouter();
  const params = useParams<{ orderId: string }>();
  const orderId = String(params?.orderId || "FC-185j17");
  const [orderStatus, setOrderStatus] = useState<"created" | "preparing" | "on_the_way">("created");
  const { items } = useCart();
  const numberFormatter = useMemo(() => new Intl.NumberFormat("en-US", { useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 }), []);
  const subtotal = useMemo(() => items.reduce((a, it) => a + (it.basePrice + (it.options?.reduce((s, o) => s + o.price, 0) || 0)) * (it.quantity || 1), 0), [items]);

  const [summaryOpen, setSummaryOpen] = useState(false);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<unknown | null>(null);
  const styleLoadedRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [storeCoords] = useState<[number, number]>([3.653, 6.869]);
  const [destCoords] = useState<[number, number]>([3.689, 6.880]);
  const [riderCoords, setRiderCoords] = useState<[number, number]>([3.653, 6.869]);
  const wsRef = useRef<WebSocket | null>(null);
  const simRef = useRef<number | null>(null);

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
    const map: MLMap = new gl.Map({
      container: mapRef.current,
      style: {
        version: 8,
        sources: {
          osm: { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256, attribution: "© OpenStreetMap" },
          esri: { type: "raster", tiles: ["https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"], tileSize: 256 }
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }]
      },
      center: storeCoords,
      zoom: 12,
      pitchWithRotate: false,
      dragRotate: false
    });
    mapInstanceRef.current = map;
    map.addControl(new gl.NavigationControl());
    new gl.Marker({ color: "#16a34a" }).setLngLat(storeCoords).addTo(map);
    new gl.Marker({ color: "#ef4444" }).setLngLat(destCoords).addTo(map);
    const riderMarker = new gl.Marker({ color: "#0ea5e9" }).setLngLat(storeCoords).addTo(map);
    map.on("load", () => {
      styleLoadedRef.current = true;
      map.addSource("route", { type: "geojson", data: { type: "Feature", geometry: { type: "LineString", coordinates: [storeCoords, destCoords] } } });
      map.addLayer({ id: "route", type: "line", source: "route", paint: { "line-color": "#10b981", "line-width": 4, "line-dasharray": [2, 2] } });
      map.addSource("progress", { type: "geojson", data: { type: "Feature", geometry: { type: "LineString", coordinates: [storeCoords, storeCoords] } } });
      map.addLayer({ id: "progress", type: "line", source: "progress", paint: { "line-color": "#0ea5e9", "line-width": 4 } });
    });
    const updateRider = (lngLat: [number, number]) => {
      setRiderCoords(lngLat);
      riderMarker.setLngLat(lngLat);
      const src = map.getSource("progress") as { setData?: (d: unknown) => void } | null;
      src?.setData?.({ type: "Feature", geometry: { type: "LineString", coordinates: [storeCoords, lngLat] } });
    };
    (map as MLMap)._updateRider = updateRider;
    map.fitBounds([storeCoords, destCoords], { padding: 60 });
    return () => {
      styleLoadedRef.current = false;
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mapReady, mapError, storeCoords, destCoords]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let opened = false;
    try {
      wsRef.current = new WebSocket(`ws://localhost:3001/ws/orders/${orderId}`);
      wsRef.current.onopen = () => { opened = true; };
      wsRef.current.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === "location" && Array.isArray(msg.coords)) {
            const map = mapInstanceRef.current as MLMap | null;
            map?._updateRider?.([msg.coords[0], msg.coords[1]]);
          }
          if (msg.type === "status" && typeof msg.status === "string") {
            const s = msg.status as any;
            if (s === "preparing" || s === "on_the_way" || s === "created") setOrderStatus(s);
            if (s === "on_the_way" || s === "delivered") {
              if (Notification && Notification.permission === "granted") new Notification(`Order ${s}`, { body: `Order ${orderId} ${s}` });
            }
          }
        } catch {}
      };
      wsRef.current.onerror = () => {};
    } catch {}
    const startSim = () => {
      if (simRef.current) return;
      let t = 0;
      simRef.current = window.setInterval(() => {
        t += 0.02;
        const lng = storeCoords[0] + (destCoords[0] - storeCoords[0]) * Math.min(1, t);
        const lat = storeCoords[1] + (destCoords[1] - storeCoords[1]) * Math.min(1, t);
        const map = mapInstanceRef.current as MLMap | null;
        map?._updateRider?.([lng, lat]);
        if (t >= 1) {
          window.clearInterval(simRef.current!);
          simRef.current = null;
          setOrderStatus("on_the_way");
          if (Notification && Notification.permission === "granted") new Notification("Order on the way", { body: `Order ${orderId} on the way` });
        }
      }, 1000);
    };
    const timer = window.setTimeout(() => { if (!opened) startSim(); }, 1500);
    if (Notification && Notification.permission === "default") Notification.requestPermission().catch(() => {});
    return () => { window.clearTimeout(timer); if (simRef.current) window.clearInterval(simRef.current); wsRef.current?.close(); };
  }, [orderId]);

  return (
    <div className="min-h-screen bg-[var(--color-surface-muted)]">
      <div className="relative">
        <div className="h-[85vh] w-full overflow-hidden"> {/* Height adjusted */}
          <div className="relative h-full w-full">
            <div ref={mapRef} className="h-full w-full" />
            <div className="absolute left-4 top-4 flex items-center justify-between rounded-full bg-white px-3 py-2 shadow-[0_2px_10px_rgba(10,14,18,0.08)]">
              <button onClick={() => router.back()} className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white">
                <ArrowLeft color="#111" />
              </button>
              <button className="ml-2 rounded-full border border-[var(--color-border)] bg-white px-3 py-1 text-[12px]">Help?</button>
            </div>
            <span className="absolute left-6 top-20 text-[12px] font-semibold text-[#db2777]">ALHIKMA UNIVERSITY</span>
            <span className="absolute left-8 top-[52%] text-[12px] font-semibold text-[#db2777]">Hotels Limited</span>
            <span className="absolute right-12 bottom-8 text-[12px] font-semibold text-[#3b82f6]">Mandate Market</span>
          </div>
        </div>

        <div className="absolute bottom-[-160px] left-0 right-0 z-30"> {/* Position adjusted */}
          <div className="mx-auto max-w-lg rounded-t-2xl border border-[var(--color-border)] bg-white p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.12)]">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-6">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full ${orderStatus === "created" ? "border-2 border-[var(--color-green)]" : "border border-[var(--color-border)]"}`}>
                  <span className="h-3 w-3 rounded-full bg-[var(--color-green)]" />
                </div>
                <div className="flex h-3 w-16 items-center justify-center gap-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} className="h-0.5 w-1 rounded bg-[var(--color-border)]" />
                  ))}
                </div>
                <div className={`flex h-7 w-7 items-center justify-center rounded-full ${orderStatus === "preparing" ? "border-2 border-[var(--color-green)]" : "border border-[var(--color-border)]"}`}>
                  <span className="h-3 w-3 rounded-full bg-[var(--color-green)]" />
                </div>
                <BikeIcon />
                <div className={`flex h-7 w-7 items-center justify-center rounded-full ${orderStatus === "on_the_way" ? "border-2 border-[var(--color-green)]" : "border border-[var(--color-border)]"}`}>
                  <span className="h-3 w-3 rounded-full bg-[var(--color-green)]" />
                </div>
              </div>
              <button onClick={() => setOrderStatus(orderStatus === "created" ? "preparing" : orderStatus === "preparing" ? "on_the_way" : "created")} className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[14px]">✓</button>
            </div>

            <div className="mt-3 rounded-xl border border-[var(--color-border)] bg-white p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8b5cf6] text-[12px] font-semibold text-white">FC</div>
                {orderStatus === "created" && <div className="text-[14px] font-semibold text-[var(--color-text)]">Order created</div>}
                {orderStatus === "preparing" && <div className="text-[14px] font-semibold text-[var(--color-text)]">Your order is being prepared</div>}
                {orderStatus === "on_the_way" && <div className="text-[14px] font-semibold text-[var(--color-text)]">Your order is on its way</div>}
              </div>
              <div className="mt-1 text-[12px] text-[var(--color-text-muted)]">Estimated arrival time is 16:40pm</div>
              {orderStatus !== "on_the_way" && (
                <div className="mt-2 text-[12px] text-[var(--color-text-muted)]">Your order has been sent to “FoodCourt”. OrderID: {orderId}</div>
              )}
              {orderStatus === "on_the_way" && (
                <div className="mt-3 flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[#f9fafb] p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[12px] font-semibold">MJ</div>
                    <div>
                      <div className="text-[13px] font-semibold text-[var(--color-text)]">Micheal John</div>
                      <div className="text-[12px] text-[var(--color-text-muted)]">Rider</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageButton className="h-8 w-8" href={`/messages/${orderId}?name=${encodeURIComponent("Micheal John")}&type=rider`} />
                    <button onClick={() => console.log("call rider", orderId)} className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-white">📞</button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="h-[64px] rounded-xl bg-[#eef2f7]" />
              <div className="h-[64px] rounded-xl bg-[#eef2f7]" />
            </div>
          </div>

          <div className="mx-auto max-w-lg border-t border-[var(--color-border)] bg-white px-4 py-3">
            <button onClick={() => setSummaryOpen(true)} className="flex w-full items-center justify-center gap-2 text-[13px] font-semibold text-[var(--color-text)]">
              See Order Summary
              <ChevronDown size={14} color="#6b7280" />
            </button>
          </div>
        </div>
      </div>

      {summaryOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSummaryOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl border border-[var(--color-border)] bg-white p-4">
            <div className="text-[14px] font-semibold text-[var(--color-text)]">Order Summary</div>
            <div className="mt-2 flex flex-col gap-2">
              {items.map((it, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[#f9fafb] px-3 py-2">
                  <div>
                    <div className="text-[13px] font-semibold text-[var(--color-text)]">{it.title}</div>
                    <div className="text-[12px] text-[var(--color-text-muted)]">{it.options?.map((o) => o.label).join(" + ") || "Main"}</div>
                  </div>
                  <div className="text-[13px] font-semibold text-[var(--color-text)]">₦ {numberFormatter.format(it.basePrice + (it.options?.reduce((a, o) => a + o.price, 0) || 0))}</div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[13px] text-[var(--color-text-muted)]">Subtotal</span>
              <span className="text-[13px] font-semibold text-[var(--color-text)]">₦ {numberFormatter.format(subtotal)}</span>
            </div>
            <div className="mt-3">
              <button onClick={() => setSummaryOpen(false)} className="w-full rounded-full bg-[var(--color-green)] px-6 py-3 text-[14px] font-semibold text-white">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
