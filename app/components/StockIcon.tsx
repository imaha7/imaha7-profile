import React from 'react';

type Props = {
  symbol: string;
  change: number;
  size?: number;
  smart?: boolean;
};

export default function StockIcon({ symbol, change, size = 40, smart = false }: Props) {
  const display = symbol.replace(/\.JK$/i, '');
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

  const src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

  return <img src={src} alt={`${symbol} icon`} width={size} height={size} className="rounded-md" />;
}
