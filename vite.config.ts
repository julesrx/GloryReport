import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';
import md5 from 'crypto-js/md5';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), WindiCSS()],
  resolve: {
    alias: [{ find: '@', replacement: '/src' }]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const name = id.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `vendor.${md5(name).toString()}`;
          }
        }
      }
    }
  }
});
