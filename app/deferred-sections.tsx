"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";

export default function DeferredSections() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [Content, setContent] = useState<ComponentType | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    const loadContent = async () => {
      try {
        const contentModule = await import("./secondary-content");
        if (!cancelled) setContent(() => contentModule.default);
      } catch (error) {
        console.error("Unable to load the news and music sections.", error);
        if (!cancelled) setLoadError(true);
      }
    };

    if (typeof IntersectionObserver === "undefined") {
      void loadContent();
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        void loadContent();
      },
      { rootMargin: "800px 0px" }
    );

    observer.observe(container);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef}>
      {Content ? (
        <Content />
      ) : (
        <>
          <section
            id="news"
            className="min-h-[500px] bg-[var(--surface)] px-4 py-20"
            aria-busy={!loadError}
          >
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-2xl font-bold text-[var(--foreground)]">
                Latest Tech News
              </h2>
              <p className="text-[var(--muted)]">
                {loadError ? "News and music are temporarily unavailable." : "Loading news..."}
              </p>
            </div>
          </section>
          <section
            id="music"
            className="min-h-[480px] px-4 py-20"
            aria-busy={!loadError}
          >
            <div className="mx-auto max-w-6xl">
              <h2 className="text-4xl font-bold text-[var(--foreground)]">
                Minimal music for your focus
              </h2>
            </div>
          </section>
          {loadError && (
            <p className="sr-only" role="alert">
              Unable to load the news and music sections.
            </p>
          )}
        </>
      )}
    </div>
  );
}
