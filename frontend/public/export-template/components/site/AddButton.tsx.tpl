"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useCart } from "./Cart";
import { P } from "./theme";

export function AddButton() {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        add();
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
      className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
      style={{ background: added ? "#059669" : P.grad, borderRadius: P.btnRadius }}
    >
      {added ? (
        <>
          <Check size={13} /> Added
        </>
      ) : (
        "Add"
      )}
    </button>
  );
}
