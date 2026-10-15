"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type CartState = { count: number; add: () => void };

const CartContext = createContext<CartState>({ count: 0, add: () => {} });

/** A simple in-memory cart counter. Replace it with your real cart or checkout. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  return (
    <CartContext.Provider value={{ count, add: () => setCount((c) => c + 1) }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
