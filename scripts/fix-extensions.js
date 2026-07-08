const fs = require('fs');
const path = require('path');
const d = path.join(__dirname, '..', 'public', 'logos');
if (!fs.existsSync(d)) { console.error('logos dir missing'); process.exit(1); }
const files = fs.readdirSync(d);
for (const f of files) {
  const p = path.join(d, f);
  const b = fs.readFileSync(p);
  const h = b.slice(0, 8).toString('hex');
  let ext = '';
  if (b.slice(0, 5).toString() === '<?xml') ext = 'svg';
  else if (b.slice(0, 4).toString() === '<svg') ext = 'svg';
  else if (h.startsWith('89504e47')) ext = 'png';
  else if (h.startsWith('ffd8ff')) ext = 'jpg';
  else if (b.slice(0,4).equals(Buffer.from([0,0,1,0]))) ext = 'ico';
  else ext = 'bin';
  console.log(f, '->', ext);
  if (ext !== 'bin'){
    const base = path.basename(f, path.extname(f));
    const np = path.join(d, base + '.' + ext);
    fs.renameSync(p, np);
    console.log('renamed to', np);
  }
}
console.log('done');
