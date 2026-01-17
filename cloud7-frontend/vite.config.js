import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/files': {
                target: 'http://localhost:7777',
                changeOrigin: true
            },
            '/auth': {
                target: 'http://localhost:7777',
                changeOrigin: true
            },
            '/folders': {
                target: 'http://localhost:7777',
                changeOrigin: true
            }
        }
    }
});
