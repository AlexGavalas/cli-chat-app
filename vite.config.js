import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    root: 'src',
    plugins: [react()],
    server: {
        hmr: true,
        proxy: {
            '/socket.io': {
                target: 'ws://localhost:3000',
                ws: true,
            },
        },
    },
});
