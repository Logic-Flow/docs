import { defineConfig } from 'vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/demo/dist/bpmn-vue/",
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements
          isCustomElement: (tag) => tag.includes('-'),
        },
      },
    }),
    createSvgIconsPlugin({
      // 指定要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
      // 执行icon name的格式
      symbolId: '[name]',
    }),
  ],
  server: {
    host: 'localhost',
  },
  optimizeDeps: {
    include: ['@logicflow/core'],
  },
  build: {
    commonjsOptions: {
      include: [/logicflow/, /node_modules/],
    },
  },
});
