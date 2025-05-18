const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('Setting up API proxy middleware to redirect /api/* to http://localhost:5001');
  
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5001',
      changeOrigin: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request: ${req.method} ${req.url} -> http://localhost:5001${req.url}`);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`Proxy response: ${proxyRes.statusCode} ${req.method} ${req.url}`);
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
      }
    })
  );
}; 