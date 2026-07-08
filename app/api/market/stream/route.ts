const SAMPLE_SYMBOLS = [
  'BBCA.JK', 'BBRI.JK', 'TLKM.JK', 'ASII.JK', 'BMRI.JK',
  'INDF.JK', 'UNVR.JK', 'GGRM.JK', 'KLBF.JK', 'MNCN.JK',
  'SMGR.JK', 'PGAS.JK', 'ADRO.JK', 'MEDC.JK', 'BBNI.JK',
  'BRIS.JK', 'HMSP.JK', 'UNTR.JK', 'ANTM.JK', 'BMTR.JK',
  'LPPF.JK', 'ACES.JK', 'JSMR.JK', 'WSKT.JK', 'CPIN.JK',
  'IKAN.JK', 'JPFA.JK', 'ADHI.JK', 'TBIG.JK', 'WIKA.JK',
];

interface StockData {
  symbol: string;
  name?: string;
  price: number;
  volume: number;
  timestamp: number;
}

const cache = new Map<string, StockData>();

function createSimulatedStock(symbol: string, previous?: StockData): StockData {
  const basePrice = previous?.price ?? 100 + Math.random() * 1200;
  const price = Number((previous ? previous.price * (1 + (Math.random() - 0.5) * 0.02) : basePrice).toFixed(2));
  const volume = Math.max(1, Math.round(previous?.volume ?? 500000) * (0.75 + Math.random() * 0.5));
  const stockData: StockData = {
    symbol,
    name: previous?.name ?? symbol,
    price,
    volume,
    timestamp: Date.now(),
  };
  cache.set(symbol, stockData);
  return stockData;
}

const IDX_API_BASE_URL = process.env.IDX_API_BASE_URL || process.env.IDX_API_URL || "";

function formatDateId(date: Date) {
  return date.toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" }).replace(/-/g, "");
}

function normalizeIdxSymbol(value: string) {
  return String(value).trim().replace(/\.JK$/gi, "").toUpperCase();
}

function mapIdxRecordToStockData(record: any): StockData | null {
  const symbol = normalizeIdxSymbol(record.code ?? record.companyCode ?? record.symbol ?? record.ticker ?? record.stock ?? record.id);
  if (!symbol) return null;

  const price = Number(record.lastPrice ?? record.close ?? record.price ?? record.currentPrice ?? record.tradePrice ?? record.matchedPrice ?? 0);
  const volume = Number(record.volume ?? record.totalVolume ?? record.tradeVolume ?? record.total_trade_volume ?? record.value ?? 0);
  const name = record.name ?? record.companyName ?? record.shortName ?? symbol;

  if (!price || Number.isNaN(price)) return null;

  const stockData: StockData = {
    symbol: symbol.includes(".JK") ? symbol : `${symbol}.JK`,
    name,
    price,
    volume: Number.isFinite(volume) ? Math.round(volume) : 0,
    timestamp: Date.now(),
  };
  cache.set(stockData.symbol, stockData);
  return stockData;
}

async function fetchIdxData(date: string): Promise<any[]> {
  if (!IDX_API_BASE_URL) return [];
  const url = new URL(`${IDX_API_BASE_URL.replace(/\/+$/, "")}/trading/stock-summary`);
  url.searchParams.set("date", date);

  const response = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`IDX-API fetch failed: ${response.status}`);
  }

  const payload = await response.json();
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.result)) return payload.result;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
}

async function fetchQuotes(): Promise<StockData[]> {
  const symbols = SAMPLE_SYMBOLS.join(",");
  const today = formatDateId(new Date());

  if (IDX_API_BASE_URL) {
    try {
      const records = await fetchIdxData(today);
      if (records.length > 0) {
        const mapped = records
          .map(mapIdxRecordToStockData)
          .filter((item): item is StockData => item !== null);

        return SAMPLE_SYMBOLS.map((symbol) => {
          const item = mapped.find((entry) => normalizeIdxSymbol(entry.symbol) === normalizeIdxSymbol(symbol));
          if (item) return item;
          return createSimulatedStock(symbol, cache.get(symbol));
        });
      }
    } catch (error) {
      console.warn("IDX-API fetch failed, falling back to Yahoo Finance or simulation:", error);
    }
  }

  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}`;
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    Accept: "application/json, text/plain, */*",
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Yahoo Finance fetch failed: ${response.status}`);
    }
    const payload = await response.json();
    const quotes = payload.quoteResponse?.result ?? [];

    return SAMPLE_SYMBOLS.map((symbol) => {
      const item = quotes.find((entry: any) => String(entry.symbol).toUpperCase() === symbol.toUpperCase());
      if (item && item.regularMarketPrice != null) {
        const price = Number(item.regularMarketPrice ?? item.ask ?? item.bid ?? 0);
        const volume = Number(item.regularMarketVolume ?? item.volume ?? 0);
        const name = item.shortName || item.longName || item.displayName || symbol;
        const stockData: StockData = { symbol, name, price, volume, timestamp: Date.now() };
        cache.set(symbol, stockData);
        return stockData;
      }
      return createSimulatedStock(symbol, cache.get(symbol));
    });
  } catch (error) {
    console.warn("Yahoo Finance fetch failed, falling back to simulated quotes:", error);
    return SAMPLE_SYMBOLS.map((symbol) => createSimulatedStock(symbol, cache.get(symbol)));
  }
}

function stableStringify(data: any) {
  return JSON.stringify(data);
}

export async function GET(req: Request) {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  };

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const stocks = await fetchQuotes();
        controller.enqueue(encoder.encode(`data: ${stableStringify({ type: 'snapshot', data: stocks })}\n\n`));

        let updateCount = 0;
        const interval = setInterval(async () => {
          try {
            const latest = await fetchQuotes();
            controller.enqueue(encoder.encode(`data: ${stableStringify({ type: 'update', data: latest })}\n\n`));
            updateCount += 1;
            if (updateCount >= 120) {
              clearInterval(interval);
              controller.close();
            }
          } catch (error) {
            console.error('Stream update failure:', error);
            controller.enqueue(encoder.encode(`data: ${stableStringify({ type: 'error', message: String(error) })}\n\n`));
          }
        }, 5000);

        req.signal.addEventListener('abort', () => {
          clearInterval(interval);
          controller.close();
        });
      } catch (error) {
        console.error('Stream startup failure:', error);
        controller.enqueue(encoder.encode(`data: ${stableStringify({ type: 'error', message: String(error) })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, { headers });
}
