import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/url': 'http://localhost:3001',
      '/get_uid': 'http://localhost:3001',
      '/websocK': 'http://localhost:3001',
      '/wget': 'http://localhost:3001',
      '/fetch': 'http://localhost:3001',
      '/get_bg': 'http://localhost:3001',
      '/generate-key': 'http://localhost:3001',
      '/check-key': 'http://localhost:3001',
      '/get_data': 'http://localhost:3001',
      '/getData': 'http://localhost:3001'
    }
  }
})