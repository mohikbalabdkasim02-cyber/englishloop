"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("English Loop error", error);
  }, [error]);

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <section style={{ maxWidth: 520, textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".12em", color: "#6557e8" }}>
          ENGLISH LOOP
        </div>
        <h1 style={{ fontSize: 40, letterSpacing: "-.05em", margin: "12px 0" }}>
          The loop hit a small bump.
        </h1>
        <p style={{ color: "#6f7774", lineHeight: 1.6 }}>
          Your work is still safe. Try loading this part of English Loop again.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: 18,
            border: 0,
            borderRadius: 12,
            padding: "12px 16px",
            background: "#17201f",
            color: "white",
            fontWeight: 800,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <RotateCcw size={16} /> Try again
        </button>
      </section>
    </main>
  );
}
