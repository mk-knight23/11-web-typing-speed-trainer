import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: '/10-typing-speed-trainer/',
    build: {
        outDir: 'dist',
    },
    server: {
        port: 3000,
        open: true,
    }
});
