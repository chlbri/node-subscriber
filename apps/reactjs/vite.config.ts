import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const config = defineConfig({
  resolve: { tsconfigPaths: true, dedupe: ['react', 'react-dom'] },
  server: { port: 3022 },
  plugins: [tsconfigPaths(), tanstackStart(), nitro(), viteReact()],
});

export default config;
