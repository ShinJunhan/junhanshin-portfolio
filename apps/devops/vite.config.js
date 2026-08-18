import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // A port of its own so this can run alongside the root app during dev.
  server: { port: 5174 },
})
