import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages serves from /trenerhelp/; Cloudflare Pages and dev use /
const base = process.env.GH_PAGES ? '/trenerhelp/' : '/'

export default defineConfig({
  base,
  build: {
    // transpile for older iOS Safari (14+) so the bundle at least parses there
    target: ['es2020', 'safari14'],
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      includeAssets: ['icons/icon.svg'],
      manifest: {
        name: 'TrenerHelp',
        short_name: 'TrenerHelp',
        description: 'CRM для персонального тренера',
        theme_color: '#202020',
        background_color: '#EFEFEF',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          { src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
