// api/proxy.js
import http from 'http';
import https from 'https';

export default function handler(req, res) {
  const { url, port, token } = req.query;

  const targetUrl = `${url}:${port}`;

  // Set the request options
  const options = {
    hostname: url,
    port: port,
    path: req.url.replace(`/api/proxy?url=${url}&port=${port}&token=${token}`, ''),
    method: req.method,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  // Use the appropriate protocol (HTTP or HTTPS)
  const protocol = port == 443 ? https : http;

  const proxyReq = protocol.request(options, (proxyRes) => {
    // Forward response headers and status code to the client
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  // Forward any body content from the request
  req.pipe(proxyReq, { end: true });

  proxyReq.on('error', (err) => {
    res.status(500).json({ error: 'Proxy request failed', details: err.message });
  });
}
