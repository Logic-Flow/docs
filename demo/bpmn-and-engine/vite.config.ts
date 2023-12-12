import { defineConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import vue from '@vitejs/plugin-vue'
import preact from "@preact/preset-vite";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/demo/dist/bpmn-and-engine/",
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
    preact(),
  ],
  optimizeDeps: {
    include: ['@logicflow/core'],
  },
  server: {
    port: 8000,
    open: true,
    cors: true,
  },
})
