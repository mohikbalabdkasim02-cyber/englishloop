import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="offline-shell">
      <div className="offline-mark" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="eyebrow">OFFLINE MODE</div>
      <h1>You&apos;re offline.</h1>
      <p>
        English Loop can still open its saved app shell, but live materials,
        YouTube, PDF files, sign-in, submissions, and teacher feedback need an internet connection.
      </p>
      <Link className="btn btn-dark" href="/">Try English Loop again</Link>
    </main>
  );
}
