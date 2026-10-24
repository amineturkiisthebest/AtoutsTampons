import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Minified JS and CSS (Vite's defaults, kept explicit)
    minify: true,
    cssMinify: true,
    // Small images are inlined into the JS/CSS instead of costing an extra request
    assetsInlineLimit: 4096,
    rolldownOptions: {
      output: {
        // React and the router change rarely: keep them in their own long-cached chunk
        manualChunks(id) {
          if (/node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) return 'vendor'
        },
      },
    },
  },
})
