const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Proxy middleware
app.use('/proxy', createProxyMiddleware({
    target: 'https://www.example.com', // Default target (will be replaced dynamically)
    changeOrigin: true,
    pathRewrite: {
        '^/proxy/': '', // Remove "/proxy" prefix from the request URL
    },
    onProxyReq: (proxyReq, req) => {
        const targetUrl = req.query.url;
        if (targetUrl) {
            proxyReq.path = targetUrl.replace(/^https?:\/\//, ''); // Rewrite path to actual URL
        }
    }
}));

// Catch-all route to serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
