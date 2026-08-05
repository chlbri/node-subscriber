import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

const config = defineConfig({
  server: { port: 3022 },
  resolve: { tsconfigPaths: true, dedupe: ['react', 'react-dom'] },
  ssr: { noExternal: ['@bemedev/subscriber'] },
  plugins: [tanstackStart(), nitro(), viteReact()],
});

export default config;
