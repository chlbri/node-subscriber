import { defineConfig } from 'vite';

import { tanstackStart } from '@tanstack/solid-start/plugin/vite';
import { nitro } from 'nitro/vite';
import viteSolid from 'vite-plugin-solid';

export default defineConfig({
  server: { port: 3021 },
  resolve: { tsconfigPaths: true },
  ssr: { noExternal: ['@bemedev/subscriber'] },
  plugins: [
    tanstackStart({}),
    nitro(),
    viteSolid({ ssr: true, extensions: ['.js', '.ts', '.jsx', '.tsx'] }),
  ],
});
