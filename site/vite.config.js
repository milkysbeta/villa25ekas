import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/* GitHub Pages serves this repo under /villa25ekas/, so every absolute asset
   path needs that prefix in production. Locally it stays at the root.
   Set VITE_BASE=/ when the custom domain goes live and this disappears. */
export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
  server: { port: 5180, strictPort: true },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: mode !== 'production',
    rollupOptions: {
      output: {
        /* The entry bundle and stylesheet keep FIXED names, deliberately.

           GitHub Pages caches index.html for ten minutes. With hashed entry
           names, a visitor holding a cached page asks for a bundle that the
           latest deploy has already deleted — 404, blank screen, and no way
           for the app to recover because the app is what failed to load.

           Fixed names mean a stale page always requests a file that exists.
           Worst case it runs a version up to ten minutes old, which then
           self-heals. A slightly stale page beats a blank one.

           Everything else keeps its hash: images and fonts are only ever
           referenced from the JS and CSS, which are always current, so they
           can be cached hard and for a long time. */
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (info) =>
          info.names?.[0]?.endsWith('.css')
            ? 'assets/app.css'
            : 'assets/[name]-[hash][extname]',
      },
    },
  },
}));
