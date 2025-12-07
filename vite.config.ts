import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
const iframeResizerVersion = packageJson.dependencies['iframe-resizer'].replace(/^[\^~]/, '');

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['radio-logo.png'],
        manifest: {
          name: 'Online Radio Streamer',
          short_name: 'Radio Streamer',
          description: 'A simple online radio streamer application.',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
        workbox: {
          navigateFallbackDenylist: [/^\/radio/],
          globPatterns: ['**/*.{js,css,html,ico,png,svg}']
        }
      })
    ],
    server: {
      proxy: {
        '/radio': {
          target: env.VITE_AKASHVANI_PROXY_TARGET || 'https://akashvani.gov.in/radio',
          changeOrigin: true,
        selfHandleResponse: true,
        rewrite: (path) => path.replace(/^\/radio/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
             proxyReq.setHeader('Accept-Encoding', 'identity');
          });
          proxy.on('proxyRes', (proxyRes, _req, res) => {
            // Remove headers
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
            delete proxyRes.headers['x-content-type-options'];
            delete proxyRes.headers['access-control-allow-origin'];

            res.setHeader('Access-Control-Allow-Origin', '*');

            // Only modify HTML response
            const contentType = proxyRes.headers['content-type'] || '';
            if (contentType.includes('text/html')) {
                let body: any[] = [];
                proxyRes.on('data', (chunk) => {
                  body.push(chunk);
                });
                proxyRes.on('end', () => {
                  let bodyStr = Buffer.concat(body).toString();
                  // Inject script
                  const scriptTag = `<script src="https://cdn.jsdelivr.net/npm/iframe-resizer@${iframeResizerVersion}/js/iframeResizer.contentWindow.min.js"></script>`;
                  if (bodyStr.includes('</body>')) {
                    bodyStr = bodyStr.replace('</body>', `${scriptTag}</body>`);
                  }
                  
                  // Copy headers from proxyRes to valid node headers
                  Object.keys(proxyRes.headers).forEach(key => {
                      if (key !== 'content-length' && key !== 'content-encoding') {
                         res.setHeader(key, proxyRes.headers[key] as string | string[]);
                      }
                  });
                  
                  res.end(bodyStr);
                });
            } else {
                // Pipe other content (CSS, JS, Fonts) directly
                proxyRes.pipe(res);
            }
          });
        },
      }
    }
  }
  };
});
