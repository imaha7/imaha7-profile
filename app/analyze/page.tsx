"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import StockIcon from "../components/StockIcon";

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

export default function AnalyzePage() {
  const [stocks, setStocks] = useState<StockState[]>([]);
  const [connected, setConnected] = useState(false);
  const [streamUrl] = useState<string>("/api/market/stream");
  const eventSourceRef = useRef<EventSource | null>(null);

  const [araThreshold, setAraThreshold] = useState<number>(7);
  const [arbThreshold, setArbThreshold] = useState<number>(-7);
  const [smartVolumeMultiplier, setSmartVolumeMultiplier] = useState<number>(1.5);

  // Initialize stocks from first data point
  const initializeStocks = useCallback((data: any[]) => {
    const initialized = data.map((d: any) => ({
      symbol: d.symbol,
      name: d.name || d.symbol,
      lastClose: d.price, // use current as baseline
      price: d.price,
      volume: d.volume || 0,
      avgVolume: (d.volume || 0) * 0.8, // estimate average
      ticks: [{ price: d.price, volume: d.volume || 0, t: d.timestamp || Date.now() }],
    }));
    return initialized;
  }, []);

  // Connect to SSE stream
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
            // Initialize stocks on first snapshot
            setStocks(initializeStocks(msg.data));
          } else if (msg.type === "update" && msg.data) {
            // Update existing stocks
            setStocks((prev) => {
              const updated = [...prev];
              for (const newData of msg.data) {
                const idx = updated.findIndex((s) => s.symbol === newData.symbol);
                if (idx >= 0) {
                  const existing = updated[idx];
                  const now = newData.timestamp || Date.now();
                  const newTicks = [
                    ...existing.ticks,
                    { price: newData.price, volume: newData.volume || 0, t: now },
                  ].slice(-60);

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

  // Auto-connect on mount
  useEffect(() => {
    connectStream();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [connectStream]);

  // Analysis computation
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

      return {
        symbol: s.symbol,
        name: s.name,
        price: s.price,
        changePct,
        volume: s.volume,
        ara,
        arb,
        smartMoney,
      };
    });
  }, [stocks, araThreshold, arbThreshold, smartVolumeMultiplier]);

  const formatNumber = (n: number) => n.toLocaleString();

  

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analyze Stocks</h1>
            <p className="text-sm text-[var(--muted)]">Real-time BEI/IDX analysis — ARA / ARB detection and smart-money accumulation.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => connectStream()}
              className={`rounded-md px-4 py-2 border transition ${
                connected
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-[var(--surface)] border-[var(--surface-border)] text-[var(--foreground)]"
              }`}
            >
              {connected ? "● Connected" : "Reconnect"}
            </button>
            <button
              onClick={() => setStocks([])}
              className="rounded-md bg-[var(--surface)] px-4 py-2 border border-[var(--surface-border)]"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mb-4 flex gap-4 items-center flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs text-[var(--muted)]">ARA %</label>
            <input type="number" value={araThreshold} onChange={(e) => setAraThreshold(Number(e.target.value))} className="w-20 rounded-md bg-[var(--surface)] px-2 py-1 border border-[var(--surface-border)] text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-[var(--muted)]">ARB %</label>
            <input type="number" value={arbThreshold} onChange={(e) => setArbThreshold(Number(e.target.value))} className="w-20 rounded-md bg-[var(--surface)] px-2 py-1 border border-[var(--surface-border)] text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-[var(--muted)]">Smart Vol x</label>
            <input step="0.1" type="number" value={smartVolumeMultiplier} onChange={(e) => setSmartVolumeMultiplier(Number(e.target.value))} className="w-24 rounded-md bg-[var(--surface)] px-2 py-1 border border-[var(--surface-border)] text-sm" />
          </div>
          <div className="text-xs text-[var(--muted)]">
            {stocks.length} stocks • {analysis.filter((a) => a.ara || a.arb || a.smartMoney).length} signals
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[var(--surface-border)] bg-[var(--surface)]">
          <table className="w-full table-auto text-sm">
            <thead className="text-left text-[var(--muted)] bg-[var(--surface)]/50 sticky top-0">
              <tr>
                <th className="px-4 py-3">Symbol</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Change</th>
                <th className="px-4 py-3">Volume</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {analysis.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[var(--muted)]">
                    Loading stocks from BEI/IDX... {stocks.length > 0 ? `(${stocks.length} loaded)` : "(connecting)"}
                  </td>
                </tr>
              ) : (
                analysis
                  .sort((a, b) => {
                    // Sort by signals first, then by largest moves
                    const aSignal = (a.ara || a.arb || a.smartMoney) ? 1 : 0;
                    const bSignal = (b.ara || b.arb || b.smartMoney) ? 1 : 0;
                    if (aSignal !== bSignal) return bSignal - aSignal;
                    return Math.abs(b.changePct) - Math.abs(a.changePct);
                  })
                  .map((a) => (
                    <tr key={a.symbol} className="border-t border-[var(--surface-border)] hover:bg-[var(--surface)]/50">
                      <td className="px-4 py-3 font-semibold flex items-center gap-3">
                        <StockIcon symbol={a.symbol} change={a.changePct} size={44} smart={a.smartMoney} />
                        <span>{a.symbol.replace(/\.JK$/i, '')}</span>
                      </td>
                      <td className="px-4 py-3 text-[var(--muted)] text-xs">{a.name?.replace(/\.JK$/i, '')}</td>
                      <td className="px-4 py-3">Rp {formatNumber(Math.round(a.price))}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${a.changePct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {a.changePct.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">{formatNumber(Math.round(a.volume))}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 flex-wrap">
                          {a.ara && <span className="inline-flex items-center rounded-full bg-emerald-400/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">ARA</span>}
                          {a.arb && <span className="inline-flex items-center rounded-full bg-rose-400/10 px-2 py-0.5 text-xs font-semibold text-rose-400">ARB</span>}
                          {a.smartMoney && <span className="inline-flex items-center rounded-full bg-cyan-400/10 px-2 py-0.5 text-xs font-semibold text-cyan-400">Accum</span>}
                          {!a.ara && !a.arb && !a.smartMoney && <span className="text-[var(--muted)] text-xs">—</span>}
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-xs text-[var(--muted)] space-y-2">
          <p>
            <strong>Live Data:</strong> Real-time BEI/IDX stock data from Yahoo Finance with fallback simulation when live quotes are unavailable. Updates every 5 seconds.
          </p>
          <p>
            <strong>Signals:</strong> ARA (gain ≥{araThreshold}%), ARB (loss ≤{arbThreshold}%), Accum (price up + volume spike).
          </p>
        </div>
      </div>
    </div>
  );
}
