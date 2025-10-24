import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.cjs'),
      formats: ['cjs'],
      fileName: () => 'main.cjs',
    },
    rollupOptions: {
      external: [
        'electron',
        'path',
        'fs',
        'node:path',
        'node:fs',
        'firebase-admin'
      ],
      output: {
        format: 'cjs',
      },
    },
    outDir: '.vite/build',
    emptyOutDir: false,
  },
});