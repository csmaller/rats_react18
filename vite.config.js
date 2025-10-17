import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Polyfill globalThis.crypto.getRandomValues for older Node.js versions
// Vite and some deps expect the Web Crypto API to exist. On Node < 18
// globalThis.crypto.getRandomValues may be missing. We provide a small
// shim using Node's crypto module when needed.
try {
  if (!globalThis.crypto || typeof globalThis.crypto.getRandomValues !== 'function') {
    // Dynamically require so this file stays ESM-compatible in modern Node.
    // eslint-disable-next-line no-undef
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    const nodeCrypto = require('crypto');

    if (nodeCrypto.webcrypto && typeof nodeCrypto.webcrypto.getRandomValues === 'function') {
      globalThis.crypto = nodeCrypto.webcrypto;
    } else {
      globalThis.crypto = {
        getRandomValues: (arr) => {
          if (!(arr && typeof arr.length === 'number')) {
            throw new TypeError('Expected an array-like object');
          }
          const buf = nodeCrypto.randomBytes(arr.length);
          for (let i = 0; i < buf.length; i++) arr[i] = buf[i];
          return arr;
        },
      };
    }
  }
} catch (e) {
  // If the polyfill fails, log but continue; Vite may still fail later.
  // Keep this a no-op for environments where dynamic import isn't allowed.
  // eslint-disable-next-line no-console
  console.warn('crypto.getRandomValues polyfill failed:', e && e.message ? e.message : e);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: false,
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      util: 'util',
    },
  },
  optimizeDeps: {
    include: ['crypto-browserify'],
  },
});
