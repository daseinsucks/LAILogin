import http from 'http';
import https from 'https';

export default function handler(req, res) {
  const { url, port, token } = req.query;

  const targetUrl = `${url}:${port}`;

  const options = {
    hostname: url,
    port: port,
    path: '/',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const protocol = port == 443 ? https : http;

  const proxyReq = protocol.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    res.status(500).json({ error: 'Proxy request failed', details: err.message });
  });

  req.pipe(proxyReq, { end: true });
}