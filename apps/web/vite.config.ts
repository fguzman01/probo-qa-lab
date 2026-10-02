import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // En local, /api se redirige a la API para no depender de CORS.
    proxy: { '/api': 'http://127.0.0.1:4100' },
    port: 5173,
  },
});
