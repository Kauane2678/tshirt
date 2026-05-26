"use client";

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "style-shooes-wishlist";

/**
 * Hook simples de wishlist persistido em localStorage.
 * Sincroniza entre abas via storage event.
 */
export function useWishlist() {
  const [ids, setIds] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setIds(JSON.parse(saved));
    } catch {}
    setHydrated(true);
  }, []);

  // Persist + cross-tab sync
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {}
  }, [ids, hydrated]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue) {
        try { setIds(JSON.parse(e.newValue)); } catch {}
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const has    = useCallback((id: number) => ids.includes(id), [ids]);
  const toggle = useCallback((id: number) => {
    setIds((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);
  const clear  = useCallback(() => setIds([]), []);

  return { ids, has, toggle, clear, count: ids.length };
}
