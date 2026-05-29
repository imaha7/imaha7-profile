import React from 'react';

type Props = {
  symbol: string;
  change: number;
  size?: number;
  smart?: boolean;
};

const LOGO_URL_MAP: Record<string, string> = {
  'BBCA.JK': '/logos/bbca.svg',
  'BBRI.JK': '/logos/bbri.png',
  'BMRI.JK': '/logos/bmri.ico',
  'TLKM.JK': '/logos/tlkm.svg',
  'ASII.JK': '/logos/asii.ico',
  'UNVR.JK': '/logos/unvr.svg',
  'ADRO.JK': '/logos/adro.png',
  'MEDC.JK': '/logos/medc.png',
  'BBNI.JK': '/logos/bbni.png',
};

export default function StockIcon({ symbol, change, size = 40, smart = false }: Props) {
  const display = symbol.replace(/\.JK$/i, '');
  const logoUrl = LOGO_URL_MAP[symbol];

  const color = change > 0 ? '#10B981' : change < 0 ? '#FB7185' : '#94A3B8';
  const bg = smart ? '#ecfeff' : '#0f172a';
  const arrow = change > 0 ? '▲' : change < 0 ? '▼' : '';
  const pct = Number.isFinite(change) ? Math.abs(change).toFixed(1) : '0.0';

  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 48 48'>
      <rect width='48' height='48' rx='8' fill='${bg}' />
      <text x='50%' y='40%' dominant-baseline='middle' text-anchor='middle' font-family='Inter,ui-sans-serif,system-ui,Arial' font-size='12' fill='${color}' font-weight='700'>${display}</text>
      <text x='50%' y='74%' dominant-baseline='middle' text-anchor='middle' font-family='Inter,ui-sans-serif,system-ui,Arial' font-size='10' fill='${color}'>${arrow}${pct}%</text>
    </svg>
  `;

  const fallbackSrc = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${display} logo`}
        width={size}
        height={size}
        className="rounded-md border border-white/10 bg-[var(--surface)] object-contain"
        style={{ backgroundColor: bg, padding: 6 }}
        onError={(event) => {
          const target = event.currentTarget as HTMLImageElement;
          if (target.src !== fallbackSrc) {
            target.src = fallbackSrc;
          }
        }}
      />
    );
  }

  return <img src={fallbackSrc} alt={`${symbol} icon`} width={size} height={size} className="rounded-md" />;
}
