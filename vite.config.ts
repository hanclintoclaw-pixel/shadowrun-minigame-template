import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/shadowrun-minigame-template/',
  plugins: [react()],
})
