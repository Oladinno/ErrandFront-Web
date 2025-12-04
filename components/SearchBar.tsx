"use client";
import React from "react";
import { ScanIcon, SearchIcon } from "./icons";

export default function SearchBar() {
  return (
    <div className="flex items-center justify-between px-4">
      <div className="flex flex-1 items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <SearchIcon size={16} color="#6b7280" />
        <input
          placeholder="Search here..."
          className="w-full bg-transparent text-[14px] outline-none placeholder:text-[var(--color-text-muted)]"
        />
      </div>
      <button className="ml-3 flex h-10 items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 text-[13px] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <ScanIcon size={16} />
        Scan
      </button>
    </div>
  );
}