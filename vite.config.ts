import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(() => {
  const base = '/project-e-client/'
  
  return {
    plugins: [react()],
    base,
  }
})
