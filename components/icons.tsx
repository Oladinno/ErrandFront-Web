import React from "react";

type Props = {
  size?: number;
  color?: string;
  className?: string;
};

export function LocationPin({ size = 20, color = "var(--color-green)", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22s7-6.667 7-12A7 7 0 1 0 5 10c0 5.333 7 12 7 12Z" stroke={color} strokeWidth="1.6" />
      <circle cx="12" cy="10" r="2.8" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

export function ChatIcon({ size = 20, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M6 19l-3 3V5a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6Z" stroke={color} strokeWidth="1.6" />
      <path d="M8 8h8M8 12h6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function CartIcon({ size = 20, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="20" r="1.8" stroke={color} strokeWidth="1.6" />
      <circle cx="17" cy="20" r="1.8" stroke={color} strokeWidth="1.6" />
      <path d="M4 4h2l2 12h10l2-8H7" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BellIcon({ size = 20, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8a6 6 0 1 0-12 0v5l-2 3h16l-2-3V8Z" stroke={color} strokeWidth="1.6" />
      <path d="M10 21h4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function HamburgerIcon({ size = 20, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6h18M3 12h18M3 18h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronDown({ size = 16, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9l6 6 6-6" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ShopIcon({ size = 16, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7h16l-2 12H6L4 7Z" stroke={color} strokeWidth="1.6" />
      <path d="M9 11v8M15 11v8" stroke={color} strokeWidth="1.6" />
      <path d="M3 7l3-4h12l3 4" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

export function WrenchIcon({ size = 16, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M15 4a4 4 0 0 0-5 5L4 15l5 5 6-6a4 4 0 1 0 0-10Z" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

export function StarIcon({ size = 14, color = "var(--color-yellow)", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3l3 6 6 .9-4.5 4.2 1.1 6L12 17l-5.6 3 1.1-6L3 9.9 9 9l3-6Z" />
    </svg>
  );
}

export function HeartIcon({ size = 14, color = "var(--color-red)", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21s-7.5-4.7-9.5-8.2C.7 10.2 2.2 6.7 6 6.7c2 0 3.6 1 4 2 0-1 1.7-2 3.9-2 3.9 0 5.3 3.5 3.6 6.1C19.6 16.3 12 21 12 21Z" />
    </svg>
  );
}

export function PlusIcon({ size = 16, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ListIcon({ size = 18, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M7 6h12M7 12h12M7 18h12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="4" cy="6" r="1.5" fill={color} />
      <circle cx="4" cy="12" r="1.5" fill={color} />
      <circle cx="4" cy="18" r="1.5" fill={color} />
    </svg>
  );
}

export function SendIcon({ size = 18, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M3 11l18-8-8 18-2-7-8-3Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function BoltIcon({ size = 16, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2 4 14h7l-2 8 9-12h-7l2-8Z" fill={color} />
    </svg>
  );
}

export function CarIcon({ size = 16, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M3 13l2-5a3 3 0 0 1 3-2h6a3 3 0 0 1 3 2l2 5v5H3v-5Z" stroke={color} strokeWidth="1.6" />
      <circle cx="7" cy="18" r="2" stroke={color} strokeWidth="1.6" />
      <circle cx="17" cy="18" r="2" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

export function FireIcon({ size = 16, color = "#ef4444", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2s2 3 5 4.5S20 9 20 12a8 8 0 1 1-16 0c0-3 2-4.5 3-6s3-4 5-4Z" />
    </svg>
  );
}

export function DotIcon({ size = 6, color = "#9ca3af", className }: Props) {
  return <span style={{ width: size, height: size, backgroundColor: color }} className={`inline-block rounded-full ${className || ""}`}></span>;
}

export function BikeIcon({ size = 14, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="17" r="3" stroke={color} strokeWidth="1.6" />
      <circle cx="18" cy="17" r="3" stroke={color} strokeWidth="1.6" />
      <path d="M9 17l3-7h4l2 4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function SearchIcon({ size = 16, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="6" stroke={color} strokeWidth="1.6" />
      <path d="M21 21l-5-5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowLeft({ size = 18, color = "#fff", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DotsIcon({ size = 18, color = "#fff", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

export function ClockIcon({ size = 16, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1.6" />
      <path d="M12 7v5l3 2" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function XIcon({ size = 18, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M6 6l12 12M6 18l12-12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function HistoryIcon({ size = 18, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 12a8 8 0 1 0 8-8" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 4v4h4" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7v5l3 2" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRight({ size = 18, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M9 6l6 6-6 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ScanIcon({ size = 16, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M4 16v3a1 1 0 0 0 1 1h3M16 20h3a1 1 0 0 0 1-1v-3" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4 12h16" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ChatBubble({ size = 16, color = "#fff", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 5h16v10H8l-4 4V5Z" />
    </svg>
  );
}

export function PencilIcon({ size = 16, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 20l4-1 11-11-3-3L5 16l-1 4Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 5l3 3" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function TrashIcon({ size = 18, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M6 7h12M9 7V5h6v2M7 7l1 12h8l1-12" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WalletIcon({ size = 18, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" stroke={color} strokeWidth="1.6" />
      <path d="M16 11h4v4h-4a2 2 0 0 1-2-2 2 2 0 0 1 2-2Z" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

export function TicketIcon({ size = 18, color = "#111", className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7h12a2 2 0 0 1 2 2v2a2 2 0 1 0 0 4v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" stroke={color} strokeWidth="1.6" />
      <path d="M10 7v10" stroke={color} strokeWidth="1.6" strokeDasharray="2 2" />
    </svg>
  );
}
