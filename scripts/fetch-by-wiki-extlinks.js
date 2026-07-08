const fs = require('fs');
const path = require('path');
const fetch = global.fetch || require('node-fetch');
const urlLib = require('url');

const outDir = path.join(__dirname, '..', 'public', 'logos');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const targets = [
  { symbol: 'HMSP', names: ['H. M. Sampoerna', 'HM Sampoerna'] },
  { symbol: 'PGAS', names: ['Perusahaan Gas Negara', 'Perusahaan Gas Negara (company)', 'PGN'] },
  { symbol: 'PTBA', names: ['Bukit Asam', 'PT Bukit Asam'] },
];

async function fetchJson(url){ try{ const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }); if(!res.ok) return null; return await res.json(); }catch(e){ return null; } }
async function tryFetchImage(url){ try{ const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }); if(!res.ok) return null; const ct = res.headers.get('content-type')||''; if(!ct.startsWith('image')) return null; const buf = Buffer.from(await res.arrayBuffer()); return { buf, ct, url }; }catch(e){ return null; } }

(async()=>{
  for(const t of targets){
    console.log('~~~', t.symbol, t.names.join(' / '));
    let domain = null;
    for(const name of t.names){
      const search = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&format=json&origin=*`;
      const sj = await fetchJson(search);
      if(!sj || !sj.query || !sj.query.search || sj.query.search.length===0) continue;
      const title = sj.query.search[0].title;
      const elUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extlinks&ellimit=max&format=json&origin=*`;
      const ej = await fetchJson(elUrl);
      if(!ej || !ej.query || !ej.query.pages) continue;
      const pages = ej.query.pages;
      for(const k of Object.keys(pages)){
        const pg = pages[k];
        if(pg.extlinks){
          for(const linkObj of pg.extlinks){
            const link = linkObj['*'];
            try{
              const parsed = new urlLib.URL(link);
              const host = parsed.hostname.replace(/^www\./,'');
              if(host && !host.includes('wikipedia.org') && !host.includes('wikimedia.org')){
                domain = host; break;
              }
            }catch(e){}
          }
        }
        if(domain) break;
      }
      if(domain) break;
    }
    if(!domain){ console.log('No official domain found via Wikipedia extlinks'); }
    else console.log('Found domain', domain);

    let found = null;
    if(domain){
      // try clearbit
      const c = await tryFetchImage(`https://logo.clearbit.com/${domain}?size=800`);
      if(c) found = { ...c, source: `clearbit:${domain}` };
      const paths = ['/favicon.ico','/favicon.png','/logo.png','/logo.svg','/assets/images/logo.png','/images/logo.png','/assets/img/logo.png','/wp-content/uploads/logo.png'];
      if(!found){
        for(const p of paths){
          const u = `https://${domain}${p}`;
          const r = await tryFetchImage(u);
          if(r){ found = { ...r, source: u }; break; }
        }
      }
    }

    if(!found){
      console.log('No image found from domain');
      // try wikipedia/commons fallback already attempted elsewhere
      continue;
    }
    const ext = found.ct.includes('svg') ? 'svg' : found.ct.includes('png') ? 'png' : found.ct.includes('jpeg')||found.ct.includes('jpg') ? 'jpg' : (found.ct.includes('icon') ? 'ico' : 'bin');
    const outPath = path.join(outDir, `${t.symbol.toLowerCase()}.${ext}`);
    fs.writeFileSync(outPath, found.buf);
    console.log('Saved', outPath, 'from', found.source);
  }
  console.log('done');
})();
