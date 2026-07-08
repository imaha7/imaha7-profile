"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Tick = { price: number; volume: number; t: number };
type StockState = {
  symbol: string;
  name?: string;
  lastClose: number;
  price: number;
  volume: number;
  avgVolume: number;
  ticks: Tick[];
};

type AnalysisRow = {
  symbol: string;
  name?: string;
  price: number;
  changePct: number;
  volume: number;
  ara: boolean;
  arb: boolean;
  smartMoney: boolean;
  recommendation: string;
  recommendationClass: string;
  confidence: number;
  date: string;
};

const popularSymbols = ["BBCA", "BBRI", "BMRI", "TLKM", "ASII", "ANTM", "GOTO", "UNVR", "KLBF", "INDF", "BUMI", "ADMR"];

const normalizeSymbol = (value: string) => value.trim().replace(/\.JK$/gi, "").toUpperCase();

export default function AnalyzePage() {
  const [stocks, setStocks] = useState<StockState[]>([]);
  const [connected, setConnected] = useState(false);
  const [streamUrl] = useState<string>("/api/market/stream");
  const eventSourceRef = useRef<EventSource | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [querySymbols, setQuerySymbols] = useState<string[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [araThreshold, setAraThreshold] = useState<number>(7);
  const [arbThreshold, setArbThreshold] = useState<number>(-7);
  const [smartVolumeMultiplier, setSmartVolumeMultiplier] = useState<number>(1.5);

  const parseSymbols = useCallback((value: string) => {
    return value
      .split(/[\s,;]+/)
      .map(normalizeSymbol)
      .filter(Boolean);
  }, []);

  const initializeStocks = useCallback((data: any[]) => {
    return data.map((d: any) => ({
      symbol: normalizeSymbol(d.symbol),
      name: d.name ? normalizeSymbol(d.name) : normalizeSymbol(d.symbol),
      lastClose: d.price,
      price: d.price,
      volume: d.volume || 0,
      avgVolume: (d.volume || 0) * 0.8,
      ticks: [{ price: d.price, volume: d.volume || 0, t: d.timestamp || Date.now() }],
    }));
  }, []);

  const connectStream = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      const es = new EventSource(streamUrl);
      eventSourceRef.current = es;
      setConnected(true);

      es.addEventListener("open", () => {
        console.log("Connected to market stream");
        setConnected(true);
      });

      es.addEventListener("message", (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === "snapshot" && msg.data) {
            setStocks(initializeStocks(msg.data));
            setLastUpdate(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
          } else if (msg.type === "update" && msg.data) {
            setLastUpdate(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
            setStocks((prev) => {
              const updated = [...prev];
              for (const newData of msg.data) {
                const idx = updated.findIndex((s) => s.symbol === normalizeSymbol(newData.symbol));
                if (idx >= 0) {
                  const existing = updated[idx];
                  const now = newData.timestamp || Date.now();
                  const newTicks = [...existing.ticks, { price: newData.price, volume: newData.volume || 0, t: now }].slice(-60);

                  updated[idx] = {
                    ...existing,
                    price: newData.price,
                    volume: newData.volume || 0,
                    ticks: newTicks,
                  };
                }
              }
              return updated;
            });
          } else if (msg.type === "error") {
            console.error("Stream error:", msg.message);
          }
        } catch (e) {
          console.error("Parse error:", e);
        }
      });

      es.addEventListener("error", () => {
        console.error("Stream connection error");
        setConnected(false);
        es.close();
      });
    } catch (e) {
      console.error("Failed to connect:", e);
      setConnected(false);
    }
  }, [streamUrl, initializeStocks]);

  useEffect(() => {
    connectStream();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [connectStream]);

  const analysis = useMemo(() => {
    return stocks.map((s) => {
      const changePct = ((s.price - s.lastClose) / s.lastClose) * 100;
      const ara = changePct >= araThreshold;
      const arb = changePct <= arbThreshold;

      const lastTicks = s.ticks.slice(-6);
      let upCount = 0;
      for (let i = Math.max(1, lastTicks.length - 3); i < lastTicks.length; i++) {
        if (lastTicks[i] && lastTicks[i - 1] && lastTicks[i].price > lastTicks[i - 1].price) upCount++;
      }
      const recentAvgVol = lastTicks.length ? lastTicks.reduce((a, b) => a + b.volume, 0) / lastTicks.length : 0;
      const smartMoney = upCount >= 2 && recentAvgVol > s.avgVolume * smartVolumeMultiplier;
      const lastTick = s.ticks[s.ticks.length - 1];
      const date = new Date(lastTick?.t || Date.now()).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      let recommendation = "NEUTRAL - Monitor";
      let recommendationClass = "bg-[var(--surface)] text-[var(--muted)] border border-[var(--surface-border)]";
      if (smartMoney && changePct >= 0) {
        recommendation = "BUY - Enter Small (20-30% allocation)";
        recommendationClass = "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
      } else if (arb) {
        recommendation = "AVOID - Do Not Enter";
        recommendationClass = "bg-rose-500/10 text-rose-500 border border-rose-500/20";
      } else if (ara) {
        recommendation = "WATCH - Potential Breakout";
        recommendationClass = "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      }

      const confidence = Math.round(
        Math.min(
          95,
          Math.max(25, 40 + Math.abs(changePct) * 1.25 + (smartMoney ? 18 : 0) + (ara ? 6 : 0) - (arb ? 10 : 0))
        )
      );

      return {
        symbol: s.symbol,
        name: s.name,
        price: s.price,
        changePct,
        volume: s.volume,
        ara,
        arb,
        smartMoney,
        recommendation,
        recommendationClass,
        confidence,
        date,
      };
    });
  }, [stocks, araThreshold, arbThreshold, smartVolumeMultiplier]);

  const filteredAnalysis = useMemo(() => {
    if (querySymbols.length === 0) return analysis;
    return analysis.filter((item) => querySymbols.includes(item.symbol));
  }, [analysis, querySymbols]);

  const formatNumber = (n: number) => n.toLocaleString("id-ID");

  const handleSearch = useCallback((value: string) => {
    setQuerySymbols(parseSymbols(value));
  }, [parseSymbols]);

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    setQuerySymbols([]);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch(searchInput);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 shadow-lg shadow-slate-900/5">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Bandarmology Analysis</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                Detects broker volume activity, relative strength, consolidation & trigger signals.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-slate-900/80 px-3 py-2 text-xs font-semibold text-slate-300">
                Last update: {lastUpdate || "--:--:--"}
              </span>
              <button
                type="button"
                onClick={() => connectStream()}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  connected
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : "bg-[var(--surface)] text-[var(--foreground)] border border-[var(--surface-border)]"
                }`}
              >
                {connected ? "● Connected" : "Reconnect"}
              </button>
              <button
                type="button"
                onClick={() => setStocks([])}
                className="rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]"
              >
                Clear
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1 min-w-0">
              <label htmlFor="symbol-search" className="sr-only">
                Stock Code
              </label>
              <input
                id="symbol-search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="BBCA, TLKM, ANTM"
                className="w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>
            <button
              type="submit"
              className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-400"
            >
              Analyze
            </button>
            <button
              type="button"
              onClick={handleClearSearch}
              className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-cyan-400 hover:text-cyan-400"
            >
              Reset
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
            {popularSymbols.map((symbol) => (
              <button
                key={symbol}
                type="button"
                onClick={() => {
                  setSearchInput(symbol);
                  handleSearch(symbol);
                }}
                className="rounded-full border border-[var(--surface-border)] bg-[var(--background)] px-3 py-2 text-left text-sm font-medium text-[var(--foreground)] transition hover:border-cyan-400 hover:text-cyan-400"
              >
                {symbol}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-2xl bg-slate-950/70 px-4 py-3 text-sm text-slate-300 ring-1 ring-slate-800">
            Each analysis uses 5 tokens. Balance: 0 tokens. Prices come from IDX-API when `IDX_API_BASE_URL` is configured, otherwise the app falls back to Yahoo Finance / simulation. .JK is added automatically.
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 shadow-lg shadow-slate-900/5">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">Bandarmology Analysis History</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
              <button type="button" onClick={() => connectStream()} className="text-cyan-400 hover:text-cyan-300">
                Refresh
              </button>
              <span className="hidden sm:inline">Click row to re-analyze</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="bg-[var(--surface)] text-left text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  <th className="px-4 py-3">Ticker</th>
                  <th className="px-4 py-3">Recommendation</th>
                  <th className="px-4 py-3">Confidence</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnalysis.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-[var(--muted)]">
                      {analysis.length === 0 ? "Loading analysis data..." : "No results for the current filter."}
                    </td>
                  </tr>
                ) : (
                  filteredAnalysis
                    .sort((a, b) => {
                      const aSignal = a.smartMoney || a.ara || a.arb ? 1 : 0;
                      const bSignal = b.smartMoney || b.ara || b.arb ? 1 : 0;
                      if (aSignal !== bSignal) return bSignal - aSignal;
                      return b.confidence - a.confidence;
                    })
                    .slice(0, 12)
                    .map((item) => (
                      <tr
                        key={item.symbol}
                        onClick={() => handleSearch(item.symbol)}
                        className="cursor-pointer border-t border-[var(--surface-border)] transition hover:bg-slate-900/5"
                      >
                        <td className="px-4 py-4 font-semibold">{item.symbol}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex max-w-[320px] rounded-full px-3 py-1 text-[0.75rem] font-semibold ${item.recommendationClass}`}>
                            {item.recommendation}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-[var(--muted)]">{item.confidence}%</td>
                        <td className="px-4 py-4">{item.price ? `Rp ${formatNumber(Math.round(item.price))}` : "N/A"}</td>
                        <td className="px-4 py-4 text-[var(--muted)]">{item.date}</td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
