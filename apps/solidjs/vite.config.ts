import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { tanstackStart } from '@tanstack/solid-start/plugin/vite';
import { nitro } from 'nitro/vite';
import viteSolid from 'vite-plugin-solid';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: { port: 3021 },
  plugins: [
    tsconfigPaths(),
    tanstackStart({}),
    nitro(),
    viteSolid({ ssr: true, extensions: ['.js', '.ts', '.jsx', '.tsx'] }),
  ],
});
