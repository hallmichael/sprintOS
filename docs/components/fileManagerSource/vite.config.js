import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  publicDir: false,
  plugins: [react()],
  build: {
    emptyOutDir: true,
    outDir: path.join(__dirname, '../fileManager/dist'),
    lib: {
      entry: path.resolve(__dirname, 'index.js'),
      name: 'ReactFileManager',
      fileName: () => 'react-file-manager.es.js',
      formats: ['es'],
    },
    rollupOptions: {
      external: (id) => {
        if (id === 'react' || id === 'react-dom' || id === 'react/jsx-runtime') return true;
        if (id === 'react-native' || id.startsWith('react-native/')) return true;
        return false;
      },
      output: {
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
        assetFileNames: (info) =>
          info.name && info.name.endsWith('.css') ? 'style.css' : '[name][extname]',
      },
    },
  },
});
