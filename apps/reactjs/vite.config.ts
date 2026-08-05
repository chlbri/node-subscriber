import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const config = defineConfig({
  server: { port: 3022 },
  resolve: {
    tsconfigPaths: true,
    dedupe: ['react', 'react-dom'],
    alias: [
      {
        find: /^#\/(.*)/,
        replacement: fileURLToPath(new URL('./src/$1', import.meta.url)),
      },
    ],
  },
  ssr: { noExternal: ['@bemedev/subscriber'] },
  plugins: [tanstackStart(), nitro(), viteReact()],
});

export default config;
