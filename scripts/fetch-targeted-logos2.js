const fs = require('fs');
const path = require('path');
const fetch = global.fetch || require('node-fetch');

const outDir = path.join(__dirname, '..', 'public', 'logos');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const targets = [
  { symbol: 'HMSP', name: 'HMSP', queryNames: ['HMSP', 'H. M. Sampoerna', 'HM Sampoerna'] },
  { symbol: 'PGAS', name: 'PGAS', queryNames: ['Perusahaan Gas Negara', 'PGN'] },
  { symbol: 'WIKA', name: 'WIKA', queryNames: ['Wijaya Karya', 'WIKA'] },
  { symbol: 'PTBA', name: 'PTBA', queryNames: ['Bukit Asam', 'PT Bukit Asam'] },
];

async function fetchJson(url){
  try{ const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }); if(!res.ok) return null; return await res.json(); }catch(e){ return null; }
}

async function getImagesFromPage(title){
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=images&format=json&origin=*`;
  const j = await fetchJson(url);
  if(!j || !j.query || !j.query.pages) return [];
  const pages = j.query.pages;
  const imgs = [];
  for(const k of Object.keys(pages)){
    const pg = pages[k];
    if(pg.images) for(const im of pg.images) imgs.push(im.title);
  }
  return imgs;
}

async function getImageUrl(imageTitle){
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(imageTitle)}&prop=imageinfo&iiprop=url&format=json&origin=*`;
  const j = await fetchJson(url);
  if(!j || !j.query || !j.query.pages) return null;
  const pages = j.query.pages;
  for(const k of Object.keys(pages)){
    const pg = pages[k];
    if(pg.imageinfo && pg.imageinfo[0] && pg.imageinfo[0].url) return pg.imageinfo[0].url;
  }
  return null;
}

async function tryDownload(url){
  try{
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if(!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if(!ct.startsWith('image')) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return { buf, ct, url };
  }catch(e){ return null; }
}

(async()=>{
  for(const t of targets){
    console.log('>>>', t.symbol, t.queryNames.join(' / '));
    let found = null;
    for(const name of t.queryNames){
      const imgs = await getImagesFromPage(name);
      if(!imgs || imgs.length===0) continue;
      for(const im of imgs){
        if(/logo/i.test(im) || /Logo/i.test(im) || /emblem/i.test(im)){
          const imgUrl = await getImageUrl(im);
          if(!imgUrl) continue;
          const dl = await tryDownload(imgUrl);
          if(dl){ found = { ...dl, source: imgUrl }; break; }
        }
      }
      if(found) break;
    }
    if(!found){
      console.log('No logo image found on Wikipedia for', t.symbol);
      continue;
    }
    const ext = found.ct.includes('svg') ? 'svg' : found.ct.includes('png') ? 'png' : found.ct.includes('jpeg')||found.ct.includes('jpg') ? 'jpg' : (found.ct.includes('icon') ? 'ico' : 'bin');
    const outPath = path.join(outDir, `${t.symbol.toLowerCase()}.${ext}`);
    fs.writeFileSync(outPath, found.buf);
    console.log('Saved', outPath, 'from', found.source);
  }
  console.log('done');
})();
