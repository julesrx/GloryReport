import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';
import md5 from 'crypto-js/md5';

export default defineConfig({
  plugins: [vue(), WindiCSS()],
  resolve: {
    alias: [
      { find: '~', replacement: '/src' },
      { find: 'components', replacement: '/src/components' },
      { find: 'views', replacement: '/src/views' }
    ]
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
