const fs = require('fs');
const path = require('path');
const fetch = global.fetch || require('node-fetch');

const outDir = path.join(__dirname, '..', 'public', 'logos');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const queries = [
  { symbol: 'HMSP', q: 'H. M. Sampoerna logo' },
  { symbol: 'PGAS', q: 'Perusahaan Gas Negara logo' },
  { symbol: 'PTBA', q: 'Bukit Asam logo' },
];

async function fetchJson(url){ try{ const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }); if(!res.ok) return null; return await res.json(); }catch(e){ return null; } }
async function tryFetchImage(url){ try{ const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }); if(!res.ok) return null; const ct = res.headers.get('content-type')||''; if(!ct.startsWith('image')) return null; const buf = Buffer.from(await res.arrayBuffer()); return { buf, ct, url }; }catch(e){ return null; } }

(async()=>{
  for(const it of queries){
    console.log('***', it.symbol, it.q);
    const search = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(it.q)}&format=json&origin=*`;
    const sj = await fetchJson(search);
    if(!sj || !sj.query || !sj.query.search || sj.query.search.length===0){ console.log('no commons results'); continue; }
    let found = null;
    for(const s of sj.query.search){
      const title = s.title; // may be File:...
      const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json&origin=*`;
      const ij = await fetchJson(infoUrl);
      if(!ij || !ij.query || !ij.query.pages) continue;
      const pages = ij.query.pages;
      for(const k of Object.keys(pages)){
        const pg = pages[k];
        if(pg.imageinfo && pg.imageinfo[0] && pg.imageinfo[0].url){
          const url = pg.imageinfo[0].url;
          const dl = await tryFetchImage(url);
          if(dl){ found = { ...dl, source: url }; break; }
        }
      }
      if(found) break;
    }
    if(!found){ console.log('no valid image'); continue; }
    const ext = found.ct.includes('svg') ? 'svg' : found.ct.includes('png') ? 'png' : found.ct.includes('jpeg')||found.ct.includes('jpg') ? 'jpg' : 'bin';
    const outPath = path.join(outDir, `${it.symbol.toLowerCase()}.${ext}`);
    fs.writeFileSync(outPath, found.buf);
    console.log('Saved', outPath, 'from', found.source);
  }
  console.log('done');
})();
