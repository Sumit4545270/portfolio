import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  /*
   * GitHub Pages serves this project from /portfolio/, so the build needs a
   * base path. Driven by an env var rather than hard-coded, so a root-served
   * host (Netlify, a custom domain) builds correctly with no edit.
   */
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) return "vendor"
        },
      },
    },
  },
})
