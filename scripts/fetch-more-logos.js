const fs = require('fs');
const path = require('path');
const fetch = global.fetch || require('node-fetch');

const outDir = path.join(__dirname, '..', 'public', 'logos');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const targets = [
  { symbol: 'ICBP', name: 'Indofood CBP' },
  { symbol: 'HMSP', name: 'HM Sampoerna' },
  { symbol: 'PGAS', name: 'Perusahaan Gas Negara' },
  { symbol: 'WIKA', name: 'Wijaya Karya' },
  { symbol: 'PTBA', name: 'Bukit Asam' },
];

async function tryFetchImage(url){
  try{
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if(!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if(!ct.startsWith('image')) return null;
    const buf = await res.arrayBuffer();
    return { buf: Buffer.from(buf), ct, url };
  }catch(e){ return null; }
}

async function tryClearbit(domain){
  return await tryFetchImage(`https://logo.clearbit.com/${domain}?size=800`);
}

async function tryCommonPaths(domain){
  const paths = [
    `/favicon.ico`, `/favicon.png`, `/favicon.svg`, `/logo.png`, `/logo.svg`, `/assets/images/logo.png`, `/assets/images/logo.svg`, `/assets/img/logo.png`, `/assets/img/logo.svg`, `/images/logo.png`, `/images/logo.svg`, `/wp-content/uploads/logo.png`, `/wp-content/uploads/logo.svg`, `/themes/logo.png`, `/static/logo.png` ];
  for(const p of paths){
    const url = `https://${domain}${p}`;
    const r = await tryFetchImage(url);
    if(r) return { ...r, source: url };
  }
  return null;
}

async function tryWikipedia(name){
  try{
    const search = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&format=json&origin=*`;
    const sres = await fetch(search, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const sj = await sres.json();
    if(!sj.query || !sj.query.search || sj.query.search.length===0) return null;
    const title = sj.query.search[0].title;
    // Try og:image from page
    const page = `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
    const pres = await fetch(page, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if(!pres.ok) return null;
    const text = await pres.text();
    const m = text.match(/<meta property="og:image" content="([^"]+)"/i);
    if(m){
      const img = m[1];
      const r = await tryFetchImage(img);
      if(r) return { ...r, source: img };
    }
    // Try pageimage via API
    const pi = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&piprop=original&format=json&origin=*`;
    const pires = await fetch(pi, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const pij = await pires.json();
    const pages = pij.query && pij.query.pages;
    if(pages){
      for(const k of Object.keys(pages)){
        const pg = pages[k];
        if(pg.original && pg.original.source){
          const r = await tryFetchImage(pg.original.source);
          if(r) return { ...r, source: pg.original.source };
        }
      }
    }
  }catch(e){ return null; }
  return null;
}

async function tryCommons(name){
  try{
    const search = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name+ ' logo')}+filetype:svg&format=json&origin=*`;
    const sres = await fetch(search, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const sj = await sres.json();
    if(!sj.query || !sj.query.search || sj.query.search.length===0) return null;
    const title = sj.query.search[0].title; // like File:Logo.svg
    // get imageinfo
    const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json&origin=*`;
    const ires = await fetch(infoUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const ij = await ires.json();
    const pages = ij.query && ij.query.pages;
    if(pages){
      for(const k of Object.keys(pages)){
        const pg = pages[k];
        if(pg.imageinfo && pg.imageinfo[0] && pg.imageinfo[0].url){
          const url = pg.imageinfo[0].url;
          const r = await tryFetchImage(url);
          if(r) return { ...r, source: url };
        }
      }
    }
  }catch(e){ return null; }
  return null;
}

(async()=>{
  for(const t of targets){
    console.log('---', t.symbol, t.name);
    let found = null;
    // try probable domain guesses
    const domains = [
      `${t.name.replace(/\s+/g, '').toLowerCase()}.com`,
      `${t.name.replace(/\s+/g, '').toLowerCase()}.co.id`,
      `${t.name.replace(/\s+/g, '').toLowerCase()}.id`,
    ];
    // Add known domains per symbol to bias
    const known = {
      ICBP: ['cbpindo.com','indofood.co.id','indofood.com'],
      HMSP: ['sampoerna.com','hm-sampoerna.co.id','sampoerna.id'],
      PGAS: ['pgn.co.id','pgnindonesia.com','perusahaan-gas.com','pgas.co.id'],
      WIKA: ['wika.co.id','wijayakarya.com','wijayakarya.co.id'],
      PTBA: ['ptba.co.id','bukitasam.co.id']
    };
    const tryDomains = (known[t.symbol] || []).concat(domains);

    for(const d of tryDomains){
      if(found) break;
      // clearbit
      const c = await tryClearbit(d);
      if(c){ found = { ...c, source: `clearbit:${d}` }; break; }
      const p = await tryCommonPaths(d);
      if(p){ found = { ...p, source: p.source || d }; break; }
    }

    if(!found){
      const w = await tryWikipedia(t.name);
      if(w) found = w;
    }

    if(!found){
      const c = await tryCommons(t.name);
      if(c) found = c;
    }

    if(!found){
      console.log('NOT FOUND', t.symbol);
      continue;
    }

    const ext = found.ct.includes('svg') ? 'svg' : found.ct.includes('png') ? 'png' : found.ct.includes('jpeg') || found.ct.includes('jpg') ? 'jpg' : found.ct.includes('ico') ? 'ico' : 'bin';
    const outPath = path.join(outDir, `${t.symbol.toLowerCase()}.${ext}`);
    fs.writeFileSync(outPath, found.buf);
    console.log('Saved', outPath, 'from', found.source);
  }
  console.log('done');
})();
