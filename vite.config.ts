import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// API Configuration
const API_TARGET = 'http://localhost:3000';
console.log(`\n🚀 Vite Dev Server Configuration`);
console.log(`📡 API Proxy: /api/v1 → ${API_TARGET}/api/v1\n`);

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'admin-spa-fallback',
      configureServer(server) {
        // This middleware runs AFTER Vite's proxy, so API routes should already be handled
        // Only handle non-API routes
        server.middlewares.use((req: any, res: any, next: any) => {
          const url = (req.url || '') as string;
          // Skip API routes completely - proxy handles them
          if (url.startsWith('/api/')) {
            return next();
          }
          const isAsset = /\.[a-zA-Z0-9]{2,6}(?:\?.*)?$/.test(url);
          if (url.startsWith('/admin/') && !isAsset) {
            const file = resolve(__dirname, 'public', 'admin', 'index.html');
            if (fs.existsSync(file)) {
              res.setHeader('Content-Type', 'text/html');
              res.end(fs.readFileSync(file));
              return;
            }
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@src': resolve(__dirname, 'src', 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api/v1': {
        target: API_TARGET,
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, res) => {
            console.error('❌ Proxy error:', err.message);
            console.error('Error details:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log(`📤 [Proxy] ${req.method} ${req.url} → ${API_TARGET}${req.url}`);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            const status = proxyRes.statusCode;
            const emoji = status >= 200 && status < 300 ? '✅' : status === 404 ? '❌' : '⚠️';
            console.log(`${emoji} [Proxy] ${status} ${req.url}`);
          });
        },
      },
    },
  },
});
