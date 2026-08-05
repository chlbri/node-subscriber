import { defineConfig } from 'vite';

import { tanstackRouter } from '@tanstack/router-plugin/vite';

import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: { port: 3021 },
  plugins: [
    tanstackRouter({ target: 'solid', autoCodeSplitting: true }),
    solidPlugin(),
  ],
});
