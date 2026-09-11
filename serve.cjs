// Local preview: node serve.cjs. Serves only the new portfolio's public files.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png'};
http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname); }
  catch { res.writeHead(400).end(); return; }
  const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
  if (!['index.html','styles.css','script.js'].includes(relative) && !/^assets\/[a-z0-9-]+\.(webp|svg|png)$/.test(relative)) {
    res.writeHead(404).end('Not found'); return;
  }
  fs.readFile(path.join(__dirname, relative),(error, data) => {
    if(error) {res.writeHead(404).end('Not found'); return;}
    res.writeHead(200, {'Content-Type':types[path.extname(relative)] || 'application/octet-stream','Cache-Control':'no-store'});
    res.end(data);
  });
}).listen(4173,'127.0.0.1',()=>console.log('Portfolio preview: http://127.0.0.1:4173'));
