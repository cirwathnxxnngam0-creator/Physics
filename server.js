/**
 * server.js - Lightweight Loopback Static Web Server for PhysicsNoza 3.0
 * Binds strictly to 127.0.0.1 loopback for secure local preview.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

let QRCode;
try {
  QRCode = require('qrcode');
} catch (e) {
  QRCode = null;
}

const HOST = '0.0.0.0';
let PORT = parseInt(process.env.PORT || '8080', 10);

function getNetworkAddresses() {
  const nets = os.networkInterfaces();
  const results = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        results.push({ iface: name, ip: net.address });
      }
    }
  }
  return results;
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf'
};

const ROOT_DIR = __dirname;

function serveFile(req, res) {
  let reqPath = req.url.split('?')[0];

  // API endpoint for frontend to display phone QR / network access
  if (reqPath === '/api/network-info') {
    const addresses = getNetworkAddresses();
    const wifiAddr = addresses.find(a => a.iface && (a.iface.toLowerCase().includes('wi-fi') || a.iface.toLowerCase().includes('wlan') || a.iface.toLowerCase().includes('wireless'))) || addresses[0];
    const targetIp = wifiAddr ? wifiAddr.ip : '127.0.0.1';
    const targetUrl = `http://${targetIp}:${PORT}/`;

    const respond = (qrSvg) => {
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({
        port: PORT,
        targetUrl: targetUrl,
        targetIp: targetIp,
        targetIface: wifiAddr ? wifiAddr.iface : 'LAN',
        qrSvg: qrSvg || '',
        networkUrls: addresses.map(a => ({ name: a.iface, url: `http://${a.ip}:${PORT}/`, ip: a.ip }))
      }));
    };

    if (QRCode) {
      QRCode.toString(targetUrl, { type: 'svg', margin: 1, color: { dark: '#0F172A', light: '#FFFFFF' } }, (err, svg) => {
        respond(err ? '' : svg);
      });
    } else {
      respond('');
    }
    return;
  }

  if (reqPath === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(ROOT_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 Not Found: ${reqPath}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
}

const server = http.createServer(serveFile);

function startServer(port) {
  PORT = port;
  server.listen(port, HOST, () => {
    const addrs = getNetworkAddresses();
    console.log(`=======================================================`);
    console.log(`PhysicsNoza 3.0 Web Server Running on 0.0.0.0 (All Interfaces)`);
    console.log(`Local (This PC):    http://localhost:${port}/`);
    console.log(`Loopback:           http://127.0.0.1:${port}/`);
    addrs.forEach(a => {
      console.log(`Mobile / LAN (${a.iface}): http://${a.ip}:${port}/`);
    });
    console.log(`Serving root:       ${ROOT_DIR}`);
    console.log(`=======================================================`);
  });

  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', e);
    }
  });
}

startServer(PORT);
