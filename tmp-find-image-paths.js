const domains = [
  {symbol:'BBRI.JK',host:'https://www.bri.co.id'},
  {symbol:'TLKM.JK',host:'https://www.telkom.co.id'},
  {symbol:'ADRO.JK',host:'https://www.adaro.com'},
  {symbol:'INDF.JK',host:'https://www.indofood.com'},
  {symbol:'GGRM.JK',host:'https://www.gudanggaram.com'},
  {symbol:'MNCN.JK',host:'https://www.mncgroup.com'},
  {symbol:'SMGR.JK',host:'https://www.semenindonesia.com'},
  {symbol:'PGAS.JK',host:'https://www.pgas.com'},
  {symbol:'BBNI.JK',host:'https://www.bni.co.id'},
  {symbol:'ASII.JK',host:'https://www.astra.co.id'},
  {symbol:'UNVR.JK',host:'https://www.unilever.co.id'},
  {symbol:'KLBF.JK',host:'https://www.kalbe.co.id'},
  {symbol:'MEDC.JK',host:'https://www.medcoenergi.com'},
  {symbol:'BMRI.JK',host:'https://www.bankmandiri.co.id'},
  {symbol:'BBCA.JK',host:'https://www.bca.co.id'},
];

const normalize = (url, host) => {
  if (!url) return null;
  if (url.startsWith('//')) return 'https:' + url;
  if (url.startsWith('/')) return host + url;
  if (/^https?:\/\//i.test(url)) return url;
  return null;
};

(async () => {
  for (const item of domains) {
    try {
      const res = await fetch(item.host, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const html = await res.text();
      const urls = new Set();
      const linkRegex = /<(img|link)[^>]+(src|href)=["']([^"']+)["'][^>]*>/gi;
      let m;
      while ((m = linkRegex.exec(html))) {
        const url = normalize(m[3], item.host);
        if (!url) continue;
        if (/logo|icon|brand|favicon|svg|png/i.test(url)) urls.add(url);
      }
      console.log(item.symbol + ' ' + item.host);
      Array.from(urls).slice(0,30).forEach(u => console.log('  ' + u));
      if (urls.size === 0) console.log('  none');
    } catch (e) {
      console.log(item.symbol + ' ' + item.host + ' ERR ' + e.message);
    }
    console.log('---');
  }
})();
