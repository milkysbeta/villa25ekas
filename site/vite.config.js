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
  build: { outDir: 'dist', emptyOutDir: true, sourcemap: mode !== 'production' },
}));
