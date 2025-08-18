import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const BASE = env.VITE_BASE_NAME || '/';
  const API_URL = env.VITE_API_URL || 'http://0.0.0.0:8000';
  
  return {
    plugins: [react()],
    base: BASE,
    server: {
      proxy: {
        '/api': {
          target: API_URL,
          changeOrigin: true, // Most servers expect host to match their domain, so we handle that here
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    }
  }
});