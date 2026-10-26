import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteApiPlugin } from './server/viteApiPlugin.js'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    strictPort: false
  },
  plugins: [
    tailwindcss(),
    react(),
    viteApiPlugin()
  ],
})
