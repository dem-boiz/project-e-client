import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const BASE = env.VITE_BASE_NAME || '/';


  return {
    plugins: [react()],
    base: BASE,
  }
})
