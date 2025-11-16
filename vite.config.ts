import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'admin-spa-fallback',
      configureServer(server) {
        server.middlewares.use((req: any, res: any, next: any) => {
          const url = (req.url || '') as string;
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
        target: 'http://192.168.18.37:8080',
        changeOrigin: true,
      },
    },
  },
});
