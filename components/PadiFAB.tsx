"use client";
import React from "react";
import { ChatBubble } from "./icons";

type Props = {
  onClick?: () => void;
};

export default function PadiFAB({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-5 z-50 flex items-center gap-2 rounded-full bg-[var(--color-black)] px-5 py-3 text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
    >
      <ChatBubble size={16} />
      Padi
    </button>
  );
}