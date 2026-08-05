import { defineConfig } from 'vite';

import { tanstackStart } from '@tanstack/solid-start/plugin/vite';
import { nitro } from 'nitro/vite';
import viteSolid from 'vite-plugin-solid';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: { port: 3021 },
  plugins: [
    tanstackStart({}),
    nitro(),
    viteSolid({ ssr: true, extensions: ['.js', '.ts', '.jsx', '.tsx'] }),
  ],
});
