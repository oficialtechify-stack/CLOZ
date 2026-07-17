import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

import fs from 'fs';

export default defineConfig(() => {
  const hasConfig = fs.existsSync(path.resolve(__dirname, 'firebase-applet-config.json'));
  const alias: Record<string, string> = {
    '@': path.resolve(__dirname, '.'),
  };
  if (!hasConfig) {
    alias['../../firebase-applet-config.json'] = path.resolve(__dirname, 'firebase-applet-config.fallback.json');
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
