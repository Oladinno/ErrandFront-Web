"use client";
import React, { createContext, useContext, useMemo, useState } from "react";

const fallbackImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=70&w=176&auto=format&fit=crop";

type CartOption = { type: "radio" | "checkbox"; key: string; label: string; price: number };
type CartItem = {
  id?: string | number;
  title: string;
  imageUrl?: string;
  basePrice: number;
  quantity: number;
  options: CartOption[];
  notes?: string;
  totalPrice: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clear: () => void;
  isMutating: boolean;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isMutating, setIsMutating] = useState(false);

  const addItem = (item: CartItem) => {
    setIsMutating(true);
    const withImage = item.imageUrl && item.imageUrl.length > 0 ? item : { ...item, imageUrl: fallbackImage };
    setItems((prev) => [...prev, withImage]);
    setIsMutating(false);
  };

  const removeItem = (id: string | number) => {
    setIsMutating(true);
    setItems((prev) => prev.filter((it) => String(it.id ?? "") !== String(id)));
    setIsMutating(false);
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    setIsMutating(true);
    setItems((prev) => prev.map((it) => (String(it.id ?? "") === String(id) ? { ...it, quantity: Math.max(1, quantity) } : it)));
    setIsMutating(false);
  };

  const clear = () => {
    setIsMutating(true);
    setItems([]);
    setIsMutating(false);
  };

  const value = useMemo(() => ({ items, addItem, removeItem, updateQuantity, clear, isMutating }), [items, isMutating]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
