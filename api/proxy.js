// api/proxy.js
import http from 'http';
import https from 'https';

export default function handler(req, res) {
  const { url, port, token } = req.query;

  // Construct the full target URL
  const targetUrl = `${url}:${port}`;

  // Set up the options for the request to the target server
  const options = {
    hostname: url,
    port: port,
    path: req.url.replace(`/api/proxy?url=${url}&port=${port}&token=${token}`, ''), // forward the rest of the path
    method: req.method,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  // Choose HTTP or HTTPS depending on the port
  const protocol = port == 443 ? https : http;

  // Create the request to forward to the target site
  const proxyReq = protocol.request(options, (proxyRes) => {
    // Forward the status code and headers from the target server
    res.writeHead(proxyRes.statusCode, proxyRes.headers);

    // Pipe the target server's response to the client's browser
    proxyRes.pipe(res, { end: true });
  });

  // Forward the body of the original request if necessary
  req.pipe(proxyReq, { end: true });

  proxyReq.on('error', (err) => {
    // Handle any errors in the proxy request
    res.status(500).json({ error: 'Proxy request failed', details: err.message });
  });
}
