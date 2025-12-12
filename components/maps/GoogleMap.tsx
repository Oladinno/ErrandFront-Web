"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

type LatLng = { lat: number; lng: number };
type MapTypeId = "roadmap" | "satellite" | "terrain" | "hybrid";
type MarkerInit = { id: string; position: LatLng; color?: string; label?: string };

type Props = {
  center?: LatLng;
  zoom?: number;
  mapTypeId?: MapTypeId;
  className?: string;
  height?: number | string;
  width?: number | string;
  onReady?: () => void;
  onError?: (e: string) => void;
  markers?: MarkerInit[];
  onApiReady?: (api: { map: any; google: any; setMarker: (id: string, pos: LatLng, color?: string, label?: string) => void; setPath: (pts: LatLng[]) => void }) => void;
};

const loadScript = (key: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") { reject("window_unavailable"); return; }
    if ((window as any).google?.maps) { resolve(); return; }
    const id = "gmaps-js";
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing && (window as any).google?.maps) { resolve(); return; }
    const src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly`;
    const script = existing || document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject("script_error");
    script.onload = () => {
      if ((window as any).google?.maps) resolve(); else reject("google_unavailable");
    };
    if (!existing) document.head.appendChild(script);
  });
};

export default function GoogleMap({ center = { lat: 6.869, lng: 3.653 }, zoom = 12, mapTypeId = "roadmap", className, height = 320, width = "100%", onReady, onError }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const markersRef = useRef<Record<string, any>>({});
  const polylineRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    loadScript(apiKey)
      .then(() => {
        if (cancelled) return;
        const opts: any = { center, zoom, mapTypeId, zoomControl: true, fullscreenControl: true, mapTypeControl: true };
        mapRef.current = new (window as any).google.maps.Map(containerRef.current!, opts);
        if (Array.isArray(markers)) {
          markers.forEach((m) => {
            const mk = new (window as any).google.maps.Marker({ position: m.position, map: mapRef.current, label: m.label });
            markersRef.current[m.id] = mk;
          });
        }
        setReady(true);
        onReady?.();
        onApiReady?.({
          map: mapRef.current,
          google: (window as any).google,
          setMarker: (id: string, pos: LatLng, color?: string, label?: string) => {
            const exists = markersRef.current[id];
            if (exists) { exists.setPosition(pos); if (label) exists.setLabel?.(label); }
            else {
              markersRef.current[id] = new (window as any).google.maps.Marker({ position: pos, map: mapRef.current, label });
            }
          },
          setPath: (pts: LatLng[]) => {
            if (polylineRef.current) polylineRef.current.setPath(pts);
            else polylineRef.current = new (window as any).google.maps.Polyline({ path: pts, geodesic: true, strokeColor: "#0ea5e9", strokeOpacity: 1, strokeWeight: 4, map: mapRef.current });
          }
        });
      })
      .catch((e) => {
        const msg = String(e === "script_error" ? "Failed to load Google Maps script" : e === "google_unavailable" ? "Google Maps unavailable" : e === "window_unavailable" ? "Window unavailable" : "Unknown error");
        setError(msg);
        onError?.(msg);
      });
    return () => { cancelled = true; if (debounceRef.current) window.clearTimeout(debounceRef.current); };
  }, [apiKey]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => { mapRef.current.setOptions({ center, zoom, mapTypeId }); }, 120);
  }, [center, zoom, mapTypeId]);

  const style = useMemo(() => ({ height: typeof height === "number" ? `${height}px` : height, width: typeof width === "number" ? `${width}px` : width }), [height, width]);

  return (
    <div className={className} style={{ width: style.width }}>
      <div ref={containerRef} style={{ height: style.height, width: "100%", borderRadius: 12, overflow: "hidden" }} />
      {error && <div className="mt-2 text-[12px] text-[#ef4444]">{error}</div>}
      {!error && !ready && <div className="mt-2 text-[12px] text-[var(--color-text-muted)]">Loading map…</div>}
    </div>
  );
}
