import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <section style={{ maxWidth: 520, textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".12em", color: "#6557e8" }}>
          ENGLISH LOOP
        </div>
        <h1 style={{ fontSize: 52, letterSpacing: "-.06em", margin: "12px 0" }}>404</h1>
        <p style={{ color: "#6f7774", lineHeight: 1.6 }}>
          This learning loop does not exist yet.
        </p>
        <Link
          href="/"
          style={{
            marginTop: 18,
            display: "inline-block",
            borderRadius: 12,
            padding: "12px 16px",
            background: "#17201f",
            color: "white",
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          Back to English Loop
        </Link>
      </section>
    </main>
  );
}
