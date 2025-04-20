import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to the backend server
      '/api': {
        target: 'http://localhost:8005', // Your Spring Boot backend address
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false,      // Optional: Set to false if backend uses self-signed SSL cert
        // Optional: rewrite path if backend expects paths without /api prefix
        // rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
    // Optional: Define the port for the Vite dev server if needed
    // port: 3000, 
  },
})
