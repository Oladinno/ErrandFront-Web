"use client";
import React from "react";
import Link from "next/link";
import { ChatIcon } from "../icons";
import { useMessage } from "./MessageContext";

type Props = { size?: number; className?: string; href?: string };

export default function MessageButton({ size = 20, className, href = "/messages" }: Props) {
  const { unreadCount, isAuthenticated } = useMessage();
  return (
    <Link href={href} className={`relative flex h-10 w-10 items-center justify-center rounded-xl ${isAuthenticated ? "bg-white" : "bg-white/60"} shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${className || ""}`} aria-label="Messages" aria-disabled={!isAuthenticated}>
      <ChatIcon size={size} />
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-[var(--color-green)] px-1 text-center text-[11px] font-semibold text-white">
          {unreadCount}
        </span>
      )}
    </Link>
  );
}
