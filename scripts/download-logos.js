const fs = require('fs');
const path = require('path');
const fetch = global.fetch || require('node-fetch');

const outDir = path.join(__dirname, '..', 'public', 'logos');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const targets = [
  { symbol: 'ANTM', domain: 'antam.com', name: 'Aneka Tambang' },
  { symbol: 'ICBP', domain: 'indofood.com', name: 'Indofood CBP' },
  { symbol: 'INDF', domain: 'indofood.com', name: 'Indofood' },
  { symbol: 'SMGR', domain: 'semenindonesia.com', name: 'Semen Indonesia' },
  { symbol: 'GOTO', domain: 'goto.id', name: 'GoTo' },
  { symbol: 'KLBF', domain: 'kalbe.co.id', name: 'Kalbe Farma' },
  { symbol: 'UNTR', domain: 'unitedtractors.com', name: 'United Tractors' },
  { symbol: 'HMSP', domain: 'sampoerna.com', name: 'HM Sampoerna' },
  { symbol: 'PGAS', domain: 'pgn.co.id', name: 'Perusahaan Gas Negara' },
  { symbol: 'WIKA', domain: 'wika.co.id', name: 'Wijaya Karya' },
  { symbol: 'PTBA', domain: 'ptba.co.id', name: 'Bukit Asam' },
];

async function tryFetch(url, opts = {}){
  try{
    const res = await fetch(url, opts);
    if(!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if(!ct.startsWith('image')) return null;
    const buf = await res.arrayBuffer();
    return { buf: Buffer.from(buf), ct };
  }catch(e){
    return null;
  }
}

(async()=>{
  for(const t of targets){
    const name = t.symbol.toLowerCase();
    console.log('===', t.symbol, '->', t.domain);
    let result = null;

    // Try Clearbit
    const clearbit = `https://logo.clearbit.com/${t.domain}?size=512`;
    result = await tryFetch(clearbit, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if(result){
      console.log('Got from clearbit');
    }

    // Try favicon
    const favs = [`https://${t.domain}/favicon.ico`, `https://${t.domain}/favicon.png`, `https://${t.domain}/assets/images/logo.png`, `https://${t.domain}/logo.png`, `https://${t.domain}/images/logo.png`];
    if(!result){
      for(const u of favs){
        result = await tryFetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if(result){ console.log('Got from', u); break; }
      }
    }

    // Try Wikipedia og:image
    if(!result){
      try{
        const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(t.name)}`;
        const pageRes = await fetch(wikiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if(pageRes.ok){
          const text = await pageRes.text();
          const m = text.match(/<meta property="og:image" content="([^"]+)"/i);
          if(m){
            const imgUrl = m[1];
            const tryImg = await tryFetch(imgUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            if(tryImg){ result = tryImg; console.log('Got from Wikipedia og:image'); }
          }
        }
      }catch(e){}
    }

    if(!result){
      console.log('Failed to fetch logo for', t.symbol);
      continue;
    }

    const ext = result.ct.includes('svg') ? 'svg' : result.ct.includes('png') ? 'png' : result.ct.includes('jpeg') ? 'jpg' : 'bin';
    const outPath = path.join(outDir, `${name}.${ext}`);
    fs.writeFileSync(outPath, result.buf);
    console.log('Saved', outPath);
  }
  console.log('Done');
})();
