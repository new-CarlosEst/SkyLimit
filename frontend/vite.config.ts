import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      usePolling: true, // Esto obliga a Vite a revisar cambios manualmente
    },
    host: true, // Necesario para que Docker pueda mapear el puerto
    strictPort: true,
    port: 5173, 
  },
})
