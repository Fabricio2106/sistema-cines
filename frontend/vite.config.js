import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Las librerías grandes y estables van en archivos propios para que el navegador las guarde
    // en caché y no las vuelva a bajar en cada despliegue.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react'
          if (/node_modules\/(react-router|react-router-dom)\//.test(id)) return 'router'
          if (id.includes('@supabase')) return 'supabase'
          if (/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(id)) return 'animacion'
          if (id.includes('@radix-ui')) return 'radix'
          return undefined
        },
      },
    },
    // El reproductor de tráilers (react-player) carga bajo demanda sus módulos para HLS y DASH,
    // que pesan mucho pero solo se descargan si se abre un video de ese tipo (YouTube no los usa).
    chunkSizeWarningLimit: 900,
  },
})
