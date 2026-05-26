"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { Product } from "@/lib/data";
import { calcCombo, ComboCalc } from "@/lib/combo";

type CartItem = {
  product: Product;
  size: string;
  quantity: number;
  /** Se definido, usa este preço ao invés de product.price (ex: upsell R$ 40) */
  promoPrice?: number;
  /** Rótulo exibido junto do produto (ex: "OFERTA ESPECIAL") */
  promoLabel?: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, size: string, opts?: { promoPrice?: number; promoLabel?: string }) => void;
  removeItem: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
  clearCart: () => void;
  /** Total já com desconto do combo aplicado */
  total: number;
  /** Total sem desconto (subtotal da soma dos preços cheios) */
  subtotal: number;
  count: number;
  combo: ComboCalc;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "style-shooes-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setHydrated(true);
  }, []);

  // Persist on every change (after hydration to avoid wiping on first render)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const addItem = (product: Product, size: string, opts?: { promoPrice?: number; promoLabel?: string }) => {
    setItems((prev) => {
      // Itens promocionais entram como linha separada (não soma com normal)
      const matcher = (i: CartItem) =>
        i.product.id === product.id &&
        i.size === size &&
        (i.promoPrice ?? null) === (opts?.promoPrice ?? null);

      const existing = prev.find(matcher);
      if (existing) {
        return prev.map((i) => matcher(i) ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        product, size, quantity: 1,
        ...(opts?.promoPrice ? { promoPrice: opts.promoPrice } : {}),
        ...(opts?.promoLabel ? { promoLabel: opts.promoLabel } : {}),
      }];
    });
  };

  const removeItem = (productId: number, size: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.product.id === productId && i.size === size))
    );
  };

  const updateQuantity = (productId: number, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.size === size ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const combo = useMemo(() => calcCombo(
    items.map(i => ({
      productId: i.product.id,
      size:      i.size,
      quantity:  i.quantity,
      unitPrice: i.promoPrice ?? i.product.price,
    }))
  ), [items]);

  const subtotal = combo.originalTotal;
  const total    = combo.finalTotal;
  const count    = combo.totalQuantity;

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, subtotal, count, combo }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
