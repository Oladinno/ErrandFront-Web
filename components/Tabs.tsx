"use client";
import React from "react";
import { ShopIcon, WrenchIcon } from "./icons";

type Props = {
  active: "food" | "services";
  onChange: (value: "food" | "services") => void;
};

export default function Tabs({ active, onChange }: Props) {
  return (
    <div className="flex items-center justify-center gap-3 px-4">
      <button
        onClick={() => onChange("food")}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${
          active === "food" ? "bg-[var(--color-green)] text-white" : "bg-white text-[var(--color-text)]"
        }`}
      >
        <ShopIcon size={16} color={active === "food" ? "#fff" : "#111"} />
        Food
      </button>
      <button
        onClick={() => onChange("services")}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${
          active === "services" ? "bg-[var(--color-green)] text-white" : "bg-white text-[var(--color-text)]"
        }`}
      >
        <WrenchIcon size={16} color={active === "services" ? "#fff" : "#111"} />
        Services
      </button>
    </div>
  );
}