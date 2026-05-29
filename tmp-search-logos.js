const domains = [
  {symbol:'BBRI.JK',host:'https://www.bri.co.id'},
  {symbol:'ADRO.JK',host:'https://www.adaro.com'},
  {symbol:'INDF.JK',host:'https://www.indofood.com'},
  {symbol:'GGRM.JK',host:'https://www.gudanggaram.com'},
  {symbol:'KLBF.JK',host:'https://www.kalbe.co.id'},
  {symbol:'MNCN.JK',host:'https://www.mncgroup.com'},
  {symbol:'SMGR.JK',host:'https://www.semenindonesia.com'},
  {symbol:'PGAS.JK',host:'https://www.pgas.com'},
  {symbol:'BBNI.JK',host:'https://www.bni.co.id'},
];

(async () => {
  for (const item of domains) {
    try {
      const res = await fetch(item.host, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const html = await res.text();
      const regex = /(["'\(]|\s)([^"'\s>\/]*logo[^"'\s>\/]*)(["'\)]|\s|>)/gi;
      const matches = [];
      let m;
      while ((m = regex.exec(html))) {
        matches.push(m[2]);
      }
      const unique = Array.from(new Set(matches));
      console.log(item.symbol + ' ' + item.host);
      if (unique.length === 0) {
        console.log('  none');
      } else {
        unique.slice(0, 100).forEach((path) => console.log('  ' + path));
      }
    } catch (e) {
      console.log(item.symbol + ' ' + item.host + ' ERR ' + e.message);
    }
    console.log('---');
  }
})();
