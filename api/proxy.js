import http from 'http';
import https from 'https';

export default function handler(req, res) {
    const { url, port, token } = req.query;
  
    const targetUrl = `http://${url}:${port}?token=${encodeURIComponent(token)}`;
  
    res.redirect(targetUrl);
  }