import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

const nm = (p: string) => path.resolve(__dirname, 'node_modules', p);

// The real screen files live in ../src (outside this preview root), so we map
// both their Indi/router imports to local shims AND their shared npm deps to
// this harness's node_modules (Vite won't otherwise resolve bare specifiers
// for files outside the root).
export default defineConfig({
  plugins: [react()],
  // Override on-disk tsconfig discovery so esbuild doesn't try to load the app's
  // tsconfig (which `extends: "expo/tsconfig.base"`, not installed in this harness).
  esbuild: {
    tsconfigRaw: { compilerOptions: { target: 'es2020', useDefineForClassFields: true } },
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      { find: '@/components/forms', replacement: path.resolve(__dirname, 'shims/indi.tsx') },
      { find: '@/components/buttons', replacement: path.resolve(__dirname, 'shims/indi.tsx') },
      { find: '@/components/inputs', replacement: path.resolve(__dirname, 'shims/indi.tsx') },
      { find: '@/components', replacement: path.resolve(__dirname, 'shims/indi.tsx') },
      { find: 'expo-router', replacement: path.resolve(__dirname, 'shims/expoRouter.tsx') },
      // '@/...' (e.g. @/features) → the app's src — anchored so it doesn't catch @hookform/*
      { find: /^@\//, replacement: path.resolve(__dirname, '../src') + '/' },
      // shared npm deps → this harness's node_modules
      { find: /^react$/, replacement: nm('react') },
      { find: /^react-dom$/, replacement: nm('react-dom') },
      { find: /^react\/jsx-runtime$/, replacement: nm('react/jsx-runtime') },
      { find: /^react\/jsx-dev-runtime$/, replacement: nm('react/jsx-dev-runtime') },
      { find: /^react-hook-form$/, replacement: nm('react-hook-form') },
      { find: /^yup$/, replacement: nm('yup') },
      { find: /^@hookform\/resolvers\/yup$/, replacement: nm('@hookform/resolvers/yup') },
    ],
  },
  // The screens live in ../src, so allow the dev server to read the parent dir.
  server: { port: 8888, host: true, fs: { allow: [path.resolve(__dirname, '..'), __dirname] } },
});
