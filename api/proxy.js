// api/proxy.js
export default function handler(req, res) {
    const { url, port, token } = req.query;
  
    // Construct the full URL to redirect the user to
    const targetUrl = `http://${url}:${port}`;
  
    // Set up the redirect response to the actual URL
    res.redirect(302, targetUrl);  // 302 is a temporary redirect
  }
  