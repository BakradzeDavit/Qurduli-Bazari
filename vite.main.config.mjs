import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { builtinModules } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  build: {
    ssr: true,
    target: 'node18',
    lib: {
      entry: path.join(__dirname, 'src', 'main.cjs'),
      formats: ['cjs'],
      fileName: () => 'main.cjs',
    },
    rollupOptions: {
      external: [
        'electron',
        'firebase-admin',  // Add this back!
        /^firebase-admin\//,  // Also exclude firebase-admin sub-modules
        ...builtinModules,
        ...builtinModules.map(m => `node:${m}`),
      ],
      output: {
        format: 'cjs',
      },
    },
    outDir: path.join(__dirname, '.vite', 'build'),
    emptyOutDir: false,
  },
});