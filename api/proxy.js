import httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer();

export default function handler(req, res) {
  // Retrieve token and target URL from query parameters
  const { url, port, token } = req.query;
  const target = `http://${url}:${port}`;

  // Forward the request with the Authorization header
  req.headers['Authorization'] = `Bearer ${token}`;
  proxy.web(req, res, { target, changeOrigin: true });
}