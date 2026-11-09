import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Listen on every interface and accept the VPS public IP or domain.
// Vite otherwise binds to localhost and rejects the Host header Contabo sends.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: true,
  },
});
