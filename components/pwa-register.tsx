"use client";

import { Download, Share2, X } from "lucide-react";
import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandalone() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches
    || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
}

export default function PwaRegister() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // The web app remains fully usable even if SW registration is unavailable.
      });
    }

    const alreadyDismissed = sessionStorage.getItem("english-loop-pwa-dismissed") === "1";
    setDismissed(alreadyDismissed);

    const handleInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    };

    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    const safari = /safari/.test(userAgent) && !/crios|fxios|edgios/.test(userAgent);
    if (ios && safari && !isStandalone()) setShowIosHint(true);

    window.addEventListener("beforeinstallprompt", handleInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleInstall);
  }, []);

  function dismiss() {
    sessionStorage.setItem("english-loop-pwa-dismissed", "1");
    setDismissed(true);
  }

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "accepted") {
      setInstallEvent(null);
      setDismissed(true);
    }
  }

  if (dismissed || isStandalone() || (!installEvent && !showIosHint)) return null;

  return (
    <aside className="pwa-install-card" aria-live="polite">
      <button className="pwa-dismiss" onClick={dismiss} aria-label="Dismiss install suggestion">
        <X size={15} />
      </button>
      <div className="pwa-install-icon">
        {installEvent ? <Download size={19} /> : <Share2 size={19} />}
      </div>
      <div className="pwa-install-copy">
        <strong>Install English Loop</strong>
        <span>
          {installEvent
            ? "Open it like an app from your home screen."
            : "On iPhone/iPad: tap Share, then Add to Home Screen."}
        </span>
      </div>
      {installEvent && (
        <button className="pwa-install-button" onClick={install}>
          Install
        </button>
      )}
    </aside>
  );
}
