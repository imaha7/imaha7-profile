const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, '..', 'public', 'logos');
if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });

function extFromHeader(b, ext) {
  const header = b.slice(0, 16);
  const h = header.toString('hex');
  if (ext === 'svg') {
    const txt = b.toString('utf8', 0, 32);
    if (txt.startsWith('<?xml') || txt.startsWith('<svg')) return 'svg';
    return 'svg';
  }
  if (ext === 'ico') {
    if (h.startsWith('89504e47')) return 'png';
    if (h.startsWith('3c737667') || h.startsWith('3c3f786d')) return 'svg';
    if (Buffer.compare(header.slice(0, 4), Buffer.from([0, 0, 1, 0])) === 0) return 'ico';
    if (Buffer.compare(header.slice(0, 4), Buffer.from([0, 0, 2, 0])) === 0) return 'ico';
    return 'ico';
  }
  if (ext === 'bin') {
    if (h.startsWith('89504e47')) return 'png';
    if (h.startsWith('ffd8ff')) return 'jpg';
    const txt = b.toString('utf8', 0, 32);
    if (txt.startsWith('<?xml') || txt.startsWith('<svg')) return 'svg';
    return 'bin';
  }
  return ext;
}

for (const file of fs.readdirSync(out)) {
  const p = path.join(out, file);
  const b = fs.readFileSync(p);
  const ext = path.extname(file).slice(1).toLowerCase();
  if (file === 'goto.bin' && b.length === 0) {
    fs.unlinkSync(p);
    console.log('deleted empty goto.bin');
    continue;
  }
  const newExt = extFromHeader(b, ext);
  if (newExt !== ext) {
    const np = path.join(out, `${path.basename(file, path.extname(file))}.${newExt}`);
    fs.renameSync(p, np);
    console.log(`${file} -> ${path.basename(np)}`);
  }
}

async function download(url, name) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) {
      console.error('bad', url, res.status);
      return;
    }
    const ct = res.headers.get('content-type') || '';
    if (!ct.startsWith('image')) {
      console.error('not image', url, ct);
      return;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(path.join(out, name), buf);
    console.log('downloaded', name, ct, buf.length);
  } catch (err) {
    console.error('fetch error', url, err.message);
  }
}

(async () => {
  await download('https://goto.id/images/logo.svg', 'goto.svg');
})();
