import { defineConfig } from 'vite';

import { tanstackRouter } from '@tanstack/router-plugin/vite';

import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackRouter({ target: 'solid', autoCodeSplitting: true }),
    solidPlugin(),
  ],
});
