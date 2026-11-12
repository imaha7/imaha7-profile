"use client";

import { useEffect, useState } from "react";

type VisitorCounts = {
  onlineVisitors: number;
  totalVisitors: number;
};

export default function VisitorCounter() {
  const [counts, setCounts] = useState<VisitorCounts | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let active = true;

    const updateCounts = async () => {
      try {
        const response = await fetch("/api/visitors", {
          method: "POST",
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`Visitor analytics returned HTTP ${response.status}.`);
        }

        const nextCounts: unknown = await response.json();
        if (
          typeof nextCounts !== "object" ||
          nextCounts === null ||
          !("onlineVisitors" in nextCounts) ||
          !("totalVisitors" in nextCounts) ||
          typeof nextCounts.onlineVisitors !== "number" ||
          typeof nextCounts.totalVisitors !== "number"
        ) {
          throw new Error("Visitor analytics returned invalid counts.");
        }

        if (active) {
          setCounts({
            onlineVisitors: nextCounts.onlineVisitors,
            totalVisitors: nextCounts.totalVisitors,
          });
          setUnavailable(false);
        }
      } catch (error) {
        console.error("Unable to load visitor analytics.", error);
        if (active) {
          setCounts(null);
          setUnavailable(true);
        }
      }
    };

    const initialTimeoutId = window.setTimeout(() => void updateCounts(), 0);
    const intervalId = window.setInterval(() => void updateCounts(), 30_000);

    return () => {
      active = false;
      window.clearTimeout(initialTimeoutId);
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div
      className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-[var(--surface-border)] pt-6 text-sm text-[var(--muted)]"
      aria-live="polite"
      aria-label="Website visitor statistics"
    >
      <p className="inline-flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
        <span>
          <span className="font-semibold text-[var(--foreground)]">
            {counts ? counts.onlineVisitors.toLocaleString() : "—"}
          </span>{" "}
          {counts ? (counts.onlineVisitors > 1 ? "visitors are" : "visitor") : ""} online now
        </span>
      </p>
      <p className="inline-flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--foreground)] opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--foreground)]" />
        </span>
        <span className="font-semibold text-[var(--foreground)]">
          {counts ? counts.totalVisitors.toLocaleString() : "—"}
        </span>{" "}
        all-time {counts ? (counts.totalVisitors > 1 ? "visitors" : "visitor") : ""}
      </p>
      {unavailable && (
        <p className="w-full text-center text-xs">Visitor stats are unavailable.</p>
      )}
    </div>
  );
}
