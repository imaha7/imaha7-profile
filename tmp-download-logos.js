const fs = require('fs');
const targets = {
  'bbca.svg': 'https://pustaka.bca.co.id/public-assets/logo-bca-white.svg',
  'bmri.ico': 'https://www.bankmandiri.co.id/o/mandiri-corporate-theme/images/favicon.ico',
  'tlkm.svg': 'https://www.telkom.co.id/images/logo_horizontal.svg',
  'asii.ico': 'https://www.astra.co.id/astra-favicon.ico',
  'medc.png': 'https://www.medcoenergi.com/uploads/logo/MedcoEnergi-Logo-horizontal-primary.png',
  'unvr.svg': 'https://www.unilever.co.id/favicon.svg',
  'bbri.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/BANK_BRI_logo.svg/120px-BANK_BRI_logo.svg.png',
  'adro.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/AlamTri_logo.webp/250px-AlamTri_logo.webp.png',
  'bbni.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Bank_Negara_Indonesia_logo_%282004%29.svg/250px-Bank_Negara_Indonesia_logo_%282004%29.svg.png',
};

(async () => {
  try {
    fs.mkdirSync('public/logos', { recursive: true });
  } catch (e) {
    // ignore
  }

  for (const [file, url] of Object.entries(targets)) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: '*/*' } });
      console.log(file, url, res.status, res.headers.get('content-type'));
      if (res.ok) {
        const data = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(`public/logos/${file}`, data);
        console.log('saved', file, data.length);
      } else {
        console.error('failed', file, res.status);
      }
    } catch (e) {
      console.error('ERR', file, url, e.message);
    }
  }
})();
