const pages = [
  {symbol: 'BBRI.JK', url: 'https://en.wikipedia.org/wiki/Bank_Rakyat_Indonesia'},
  {symbol: 'ADRO.JK', url: 'https://en.wikipedia.org/wiki/Adaro_Energy'},
  {symbol: 'BBNI.JK', url: 'https://en.wikipedia.org/wiki/Bank_Negara_Indonesia'},
  {symbol: 'PGAS.JK', url: 'https://en.wikipedia.org/wiki/Perusahaan_Gas_Nasional'},
];
(async () => {
  for (const page of pages) {
    try {
      const res = await fetch(page.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const html = await res.text();
      const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
      const matches = [];
      let m;
      while ((m = imgRegex.exec(html))) {
        const src = m[1];
        if (/logo|Logo|logo|icon|Icon/.test(src)) {
          matches.push(src);
        }
      }
      console.log(page.symbol, page.url);
      console.log(matches.slice(0, 50).join('\n') || 'none');
    } catch (e) {
      console.log(page.symbol, 'ERR', e.message);
    }
    console.log('---');
  }
})();
